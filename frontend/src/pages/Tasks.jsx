import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import TaskItem from '../components/tasks/TaskItem';
import TaskModal from '../components/tasks/TaskModal';
import QuickAddTask from '../components/tasks/QuickAddTask';

const FILTERS = ['all', 'pending', 'completed'];
const CATEGORIES = ['all', 'personal', 'work', 'study', 'health', 'other'];
const PRIORITIES = ['all', 'high', 'medium', 'low'];

export default function Tasks() {
  const { todos, loading, addTodo, updateTodo, toggleTodo, deleteTodo, clearCompleted } = useTasks();
  const { success, error } = useToast();

  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const filtered = useMemo(() => {
    let list = [...todos];

    if (filter === 'pending') list = list.filter(t => !t.completed);
    if (filter === 'completed') list = list.filter(t => t.completed);
    if (category !== 'all') list = list.filter(t => t.category === category);
    if (priority !== 'all') list = list.filter(t => t.priority === priority);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'newest': list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'oldest': list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'due': list.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }); break;
      case 'priority': {
        const order = { high: 0, medium: 1, low: 2 };
        list.sort((a, b) => (order[a.priority] || 1) - (order[b.priority] || 1));
        break;
      }
    }

    return list;
  }, [todos, filter, category, priority, search, sortBy]);

  const handleToggle = async (id) => {
    try { await toggleTodo(id); }
    catch { error('Failed to update task'); }
  };

  const handleDelete = async (id) => {
    try { await deleteTodo(id); success('Task deleted'); }
    catch { error('Failed to delete task'); }
  };

  const handleSave = async (data) => {
    if (editTask) {
      await updateTodo(editTask.id, data);
      success('Task updated ✓');
    } else {
      await addTodo(data);
      success('Task added ✓');
    }
  };

  const handleClearCompleted = async () => {
    const count = todos.filter(t => t.completed).length;
    if (count === 0) return;
    if (!confirm(`Delete ${count} completed task${count > 1 ? 's' : ''}?`)) return;
    try { await clearCompleted(); success(`${count} task${count > 1 ? 's' : ''} cleared`); }
    catch { error('Failed to clear tasks'); }
  };

  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const openAdd  = () => { setEditTask(null); setModalOpen(true); };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">My Tasks</div>
          <div className="page-sub">{filtered.length} task{filtered.length !== 1 ? 's' : ''} shown</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {completedCount > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleClearCompleted}>
              Clear done ({completedCount})
            </button>
          )}
          <button className="btn btn-primary" onClick={openAdd}>+ New Task</button>
        </div>
      </div>

      <div className="page-body">
        {/* Quick add */}
        <QuickAddTask onAdd={async (data) => { await addTodo(data); success('Task added ✓'); }} />

        {/* Search */}
        <div style={{ marginBottom: 12 }}>
          <input
            className="input"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <div className="filter-row" style={{ margin: 0 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-chip ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <select
            className="select"
            style={{ width: 'auto', fontSize: 12, padding: '5px 10px' }}
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>

          <select
            className="select"
            style={{ width: 'auto', fontSize: 12, padding: '5px 10px' }}
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            {PRIORITIES.map(p => <option key={p} value={p}>{p === 'all' ? 'All priorities' : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>

          <select
            className="select"
            style={{ width: 'auto', fontSize: 12, padding: '5px 10px', marginLeft: 'auto' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="due">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* List */}
        {loading ? (
          <div className="loading-page"><div className="spinner" /><span>Loading...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{search ? '🔍' : '📝'}</div>
            <div className="empty-title">{search ? 'No results found' : 'No tasks here'}</div>
            <div className="empty-sub">{search ? `No tasks match "${search}"` : 'Add a new task to get started'}</div>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={openAdd}>+ Add Task</button>
            )}
          </div>
        ) : (
          <div className="task-list">
            {filtered.map(todo => (
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
