import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div className="spinner" style={{ width: 28, height: 28 }} />
        <span style={{ fontSize: 14, color: 'var(--muted)' }}>Loading Taskly...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
