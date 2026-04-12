import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const ACCENT_COLORS = [
  { name: 'Purple', value: '#534AB7' },
  { name: 'Teal', value: '#0F6E56' },
  { name: 'Coral', value: '#D85A30' },
  { name: 'Pink', value: '#D4537E' },
  { name: 'Blue', value: '#185FA5' },
];

export default function Settings() {
  const { logout } = useAuth();
  const { success } = useToast();
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();
  const navigate = useNavigate();

  const [reminders, setReminders] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [autoSort, setAutoSort] = useState(false);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Delete account? This cannot be undone.')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-sub">Customize your Taskly experience</div>
        </div>
      </div>

      <div className="page-body">

        <div className="settings-section">
          <div className="settings-label">Appearance</div>
          <div className="settings-card">

            <div className="setting-row">
              <div className="setting-icon" style={{ background: 'var(--surface2)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" fill="currentColor" opacity=".6"/>
                  <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="setting-info">
                <div className="setting-name">Dark mode</div>
                <div className="setting-desc">Switch between light and dark theme</div>
              </div>
              <button className={`toggle ${theme === 'dark' ? 'on' : ''}`} onClick={toggleTheme} aria-label="Toggle dark mode" />
            </div>

            <div className="setting-row">
              <div className="setting-icon" style={{ background: 'var(--accent-light)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="5.5" stroke="var(--accent)" strokeWidth="1.3"/>
                  <circle cx="8" cy="8" r="2" fill="var(--accent)"/>
                </svg>
              </div>
              <div className="setting-info">
                <div className="setting-name">Accent color</div>
                <div className="setting-desc">Choose your app's theme color</div>
              </div>
              <div className="color-picker">
                {ACCENT_COLORS.map(c => (
                  <div key={c.value} className={`color-dot ${accentColor === c.value ? 'selected' : ''}`} style={{ background: c.value }} onClick={() => setAccentColor(c.value)} title={c.name} />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">Tasks</div>
          <div className="settings-card">

            <div className="setting-row">
              <div className="setting-icon" style={{ background: 'var(--surface2)', fontSize: 16 }}>🔔</div>
              <div className="setting-info">
                <div className="setting-name">Due date reminders</div>
                <div className="setting-desc">Get notified before a task is due</div>
              </div>
              <button className={`toggle ${reminders ? 'on' : ''}`} onClick={() => setReminders(v => !v)} />
            </div>

            <div className="setting-row">
              <div className="setting-icon" style={{ background: 'var(--surface2)', fontSize: 16 }}>📊</div>
              <div className="setting-info">
                <div className="setting-name">Show completed tasks</div>
                <div className="setting-desc">Display completed tasks in the list</div>
              </div>
              <button className={`toggle ${showCompleted ? 'on' : ''}`} onClick={() => setShowCompleted(v => !v)} />
            </div>

            <div className="setting-row">
              <div className="setting-icon" style={{ background: 'var(--surface2)', fontSize: 16 }}>🔄</div>
              <div className="setting-info">
                <div className="setting-name">Auto-sort by priority</div>
                <div className="setting-desc">High priority tasks appear first</div>
              </div>
              <button className={`toggle ${autoSort ? 'on' : ''}`} onClick={() => setAutoSort(v => !v)} />
            </div>

          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">Account</div>
          <div className="settings-card">

            <div className="setting-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              <div className="setting-icon" style={{ background: 'var(--blue-light)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5.5" r="3" stroke="var(--blue)" strokeWidth="1.3"/>
                  <path d="M2.5 14.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="var(--blue)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="setting-info">
                <div className="setting-name">Edit profile</div>
                <div className="setting-desc">Update your name, bio, and info</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>

            <div className="setting-row" style={{ cursor: 'pointer' }} onClick={handleLogout}>
              <div className="setting-icon" style={{ background: 'var(--amber-light)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6.5 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3.5M10.5 5.5l3 2.5-3 2.5M13.5 8H7" stroke="var(--amber)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="setting-info">
                <div className="setting-name">Sign out</div>
                <div className="setting-desc">Log out from your account</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>

            <div className="setting-row" style={{ cursor: 'pointer' }} onClick={handleDeleteAccount}>
              <div className="setting-icon" style={{ background: 'var(--red-light)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M6 4V2.5h4V4M6.5 7v4.5M9.5 7v4.5M3 4l.75 9h8.5L13 4" stroke="var(--red)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="setting-info">
                <div className="setting-name" style={{ color: 'var(--red)' }}>Delete account</div>
                <div className="setting-desc">Permanently delete all your data</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>

          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--hint)', marginTop: 8 }}>
          Taskly v1.0.0 · Built with React + Node.js
        </div>

      </div>
    </>
  );
}
