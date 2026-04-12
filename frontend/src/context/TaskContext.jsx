import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { todosAPI } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] };
    case 'UPDATE_TODO':
      return { ...state, todos: state.todos.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };
    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter(t => !t.completed) };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, { todos: [], loading: true });

  useEffect(() => {
    if (user) fetchTodos();
    else dispatch({ type: 'SET_TODOS', payload: [] });
  }, [user]);

  const fetchTodos = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await todosAPI.getAll();
      dispatch({ type: 'SET_TODOS', payload: res.data });
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addTodo = async (data) => {
    const res = await todosAPI.create(data);
    dispatch({ type: 'ADD_TODO', payload: res.data });
    return res.data;
  };

  const updateTodo = async (id, data) => {
    const res = await todosAPI.update(id, data);
    dispatch({ type: 'UPDATE_TODO', payload: res.data });
    return res.data;
  };

  const toggleTodo = async (id) => {
    const res = await todosAPI.toggle(id);
    dispatch({ type: 'UPDATE_TODO', payload: res.data });
  };

  const deleteTodo = async (id) => {
    await todosAPI.delete(id);
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const clearCompleted = async () => {
    await todosAPI.clearCompleted();
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  const stats = {
    total: state.todos.length,
    completed: state.todos.filter(t => t.completed).length,
    pending: state.todos.filter(t => !t.completed).length,
    today: state.todos.filter(t => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      const now = new Date();
      return due.toDateString() === now.toDateString();
    }).length,
    completionRate: state.todos.length > 0
      ? Math.round((state.todos.filter(t => t.completed).length / state.todos.length) * 100)
      : 0
  };

  return (
    <TaskContext.Provider value={{
      todos: state.todos,
      loading: state.loading,
      stats,
      addTodo,
      updateTodo,
      toggleTodo,
      deleteTodo,
      clearCompleted,
      fetchTodos
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
