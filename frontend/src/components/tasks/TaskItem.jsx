import React from 'react';

const EditIcon = () => (
  <svg viewBox="0 0 13 13" fill="none">
    <path d="M1.5 11.5l2.5-1 6.5-6.5-1.5-1.5-6.5 6.5-1 2.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 13 13" fill="none">
    <path d="M2 3.5h9M5 3.5V2.5h3v1M5.5 6v3.5M7.5 6v3.5M3 3.5l.5 8h5.5l.5-8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const categoryClass = {
  work: 'tag-work',
  personal: 'tag-personal',
  study: 'tag-study',
  health: 'tag-health',
  other: 'tag-other',
};

const priorityClass = {
  high: 'p-high',
  medium: 'p-medium',
  low: 'p-low',
};

function formatDue(dateStr) {
  if (!dateStr) return null;
  const due = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { label: 'Due today', overdue: false };
  if (diff === 1) return { label: 'Due tomorrow', overdue: false };
  return { label: `Due ${new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, overdue: false };
}

export default function TaskItem({ todo, onToggle, onEdit, onDelete }) {
  const dueInfo = formatDue(todo.dueDate);

  return (
    <div className={`task-item ${todo.completed ? 'completed' : ''}`}>
      <div
        className={`task-check ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <svg viewBox="0 0 10 10" style={{ width: 11, height: 11 }}>
            <path d="M1.5 5l2.5 2.5 5-5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div className="task-body">
        <div className="task-title">{todo.title}</div>
        <div className="task-meta">
          <span className={`tag ${categoryClass[todo.category] || 'tag-other'}`}>
            {todo.category}
          </span>
          {dueInfo && (
            <span className={`task-due ${dueInfo.overdue ? 'overdue' : ''}`}>
              {dueInfo.label}
            </span>
          )}
          {todo.description && (
            <span style={{ fontSize: 11, color: 'var(--hint)' }} title={todo.description}>
              Has note
            </span>
          )}
        </div>
      </div>

      <div className={`priority-dot ${priorityClass[todo.priority] || 'p-medium'}`} title={`${todo.priority} priority`} />

      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(todo)} title="Edit task">
          <EditIcon />
        </button>
        <button className="icon-btn" onClick={() => onDelete(todo.id)} title="Delete task" style={{ color: 'var(--red)' }}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
