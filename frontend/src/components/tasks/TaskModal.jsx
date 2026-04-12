import React, { useState, useEffect } from 'react';

const CloseIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" style={{ width: 14, height: 14 }}>
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CATEGORIES = ['personal', 'work', 'study', 'health', 'other'];
const PRIORITIES = ['low', 'medium', 'high'];

const defaultForm = {
  title: '',
  description: '',
  category: 'personal',
  priority: 'medium',
  dueDate: '',
};

export default function TaskModal({ isOpen, onClose, onSave, editTask }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        category: editTask.category || 'personal',
        priority: editTask.priority || 'medium',
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({ ...form, dueDate: form.dueDate || null });
      onClose();
    } catch (e) {
      setErrors({ submit: e?.response?.data?.message || 'Failed to save task' });
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" onKeyDown={handleKeyDown}>
        <div className="modal-header">
          <span className="modal-title">{editTask ? 'Edit Task' : 'Add New Task'}</span>
          <button className="btn-icon btn btn-ghost" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              className="input"
              autoFocus
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="textarea"
              placeholder="Add more details..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select
                className="select"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Priority</label>
              <select
                className="select"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label className="form-label">Due Date (optional)</label>
            <input
              className="input"
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {errors.submit && (
            <div className="form-error" style={{ background: 'var(--red-light)', padding: '8px 10px', borderRadius: 6 }}>
              {errors.submit}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : editTask ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
