import React, { useState } from 'react';

export default function QuickAddTask({ onAdd }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await onAdd({ title: trimmed, category: 'personal', priority: 'medium' });
      setValue('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        className="input"
        placeholder="Quick add — type a task and press Enter..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        disabled={loading}
      />
      <button
        className="btn btn-primary"
        onClick={handleAdd}
        disabled={!value.trim() || loading}
        style={{ whiteSpace: 'nowrap' }}
      >
        {loading ? '...' : '+ Add'}
      </button>
    </div>
  );
}
