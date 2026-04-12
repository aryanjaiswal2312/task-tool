import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import TaskItem from '../components/tasks/TaskItem';
import TaskModal from '../components/tasks/TaskModal';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateStr() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const { todos, stats, toggleTodo, updateTodo, deleteTodo, addTodo, loading } = useTasks();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [editTask, setEditTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const todayTodos = todos.filter(t => {
    if (!t.dueDate) return !t.completed;
    const due = new Date(t.dueDate);
    const now = new Date();
    return due.toDateString() === now.toDateString();
  }).slice(0, 6);

  const recentPending = todos.filter(t => !t.completed).slice(0, 6);
  const displayTodos = todayTodos.length > 0 ? todayTodos : recentPending;

  const handleToggle = async (id) => {
    try { await toggleTodo(id); }
    catch { error('Could not update task'); }
  };

  const handleDelete = async (id) => {
    try { await deleteTodo(id); success('Task deleted'); }
    catch { error('Could not delete task'); }
  };

  const handleSave = async (data) => {
    if (editTask) {
      await updateTodo(editTask.id, data);
      success('Task updated');
    } else {
      await addTodo(data);
      success('Task added');
    }
  };

  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const openAdd  = () => { setEditTask(null); setModalOpen(true); };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</div>
          <div className="page-sub">{getDateStr()} · {stats.pending} task{stats.pending !== 1 ? 's' : ''} pending</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Task</button>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total tasks</div>
            <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats.total}</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.completed}</div>
            <div className="stat-sub">{stats.completionRate}% rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: 'var(--amber)' }}>{stats.pending}</div>
            <div className="stat-sub">To do</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Due today</div>
            <div className="stat-value" style={{ color: 'var(--red)' }}>{stats.today}</div>
            <div className="stat-sub">Urgent</div>
          </div>
        </div>

        {/* Progress */}
        {stats.total > 0 && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Overall progress</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{stats.completed}/{stats.total} done</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.completionRate}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Task list */}
        <div className="section-header">
          <span className="section-title">
            {todayTodos.length > 0 ? "Today's tasks" : "Recent tasks"}
            <span className="count-badge">{displayTodos.length}</span>
          </span>
          <button className="btn btn-sm" onClick={() => navigate('/tasks')}>View all →</button>
        </div>

        {loading ? (
          <div className="loading-page"><div className="spinner" /><span>Loading tasks...</span></div>
        ) : displayTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">All caught up!</div>
            <div className="empty-sub">No pending tasks. Add a new one to get started.</div>
            <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={openAdd}>+ Add Task</button>
          </div>
        ) : (
          <div className="task-list">
            {displayTodos.map(todo => (
              <TaskItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editTask={editTask}
      />
    </>
  );
}
