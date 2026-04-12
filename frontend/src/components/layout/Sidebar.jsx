import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';

const IconDashboard = () => (
  <svg viewBox="0 0 17 17" fill="none" className="nav-icon">
    <rect x="1" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity=".85"/>
    <rect x="9.5" y="1" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity=".5"/>
    <rect x="1" y="9.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity=".5"/>
    <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" opacity=".3"/>
  </svg>
);
const IconTasks = () => (
  <svg viewBox="0 0 17 17" fill="none" className="nav-icon">
    <path d="M2 4.5h13M2 8.5h9M2 12.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconProfile = () => (
  <svg viewBox="0 0 17 17" fill="none" className="nav-icon">
    <circle cx="8.5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2.5 15c0-3.314 2.686-5.5 6-5.5s6 2.186 6 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 17 17" fill="none" className="nav-icon">
    <circle cx="8.5" cy="8.5" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8.5 1.5v1.8M8.5 13.7v1.8M1.5 8.5h1.8M13.7 8.5h1.8M3.55 3.55l1.27 1.27M12.18 12.18l1.27 1.27M3.55 13.45l1.27-1.27M12.18 4.82l1.27-1.27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 17 17" fill="none" className="nav-icon">
    <path d="M6.5 3H3a1 1 0 00-1 1v9a1 1 0 001 1h3.5M11 5.5l3 3-3 3M14 8.5H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" style={{width:14,height:14}}>
    <path d="M2 7l3.5 3.5L12 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { stats } = useTasks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <CheckIcon />
        </div>
        <span className="logo-text">Taskly</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <IconDashboard />
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <IconTasks />
          My Tasks
          {stats.pending > 0 && <span className="nav-badge">{stats.pending}</span>}
        </NavLink>

        <div className="nav-section-label">Account</div>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <IconProfile />
          Profile
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <IconSettings />
          Settings
        </NavLink>
        <button
          className="nav-item"
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
        >
          <IconLogout />
          Logout
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user" onClick={() => navigate('/profile')}>
          <div className="avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
