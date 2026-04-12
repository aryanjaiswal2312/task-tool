import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../services/api';

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" style={{ width: 14, height: 14 }}>
    <path d="M2 7l3.5 3.5L12 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Login failed. Please try again.');
      setErrors({ submit: msg });
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon"><CheckIcon /></div>
          <span className="logo-text">Taskly</span>
        </div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to continue to your tasks</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="input"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors({}); }}
              autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors({}); }}
              autoComplete="current-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          {errors.submit && (
            <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '9px 12px', borderRadius: 6, fontSize: 13, marginBottom: 12 }}>
              {errors.submit}
            </div>
          )}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="divider"><span>new here?</span></div>

        <div className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create account</Link>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 8, fontSize: 12, color: 'var(--muted)' }}>
          💡 <strong>Demo:</strong> Sign up with any email to get started — data is stored locally!
        </div>
      </div>
    </div>
  );
}
