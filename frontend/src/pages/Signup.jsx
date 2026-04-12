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

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup(form.name.trim(), form.email, form.password);
      success('Account created! Welcome to Taskly 🎉');
      navigate('/dashboard');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Signup failed. Please try again.');
      setErrors({ submit: msg });
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors({}); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon"><CheckIcon /></div>
          <span className="logo-text">Taskly</span>
        </div>
        <div className="auth-title">Create account</div>
        <div className="auth-sub">Join Taskly and start managing your tasks</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="input" placeholder="Rahul Kumar" value={form.name} onChange={set('name')} autoComplete="name" />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} autoComplete="new-password" />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input className="input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          {errors.submit && (
            <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '9px 12px', borderRadius: 6, fontSize: 13, marginBottom: 12 }}>
              {errors.submit}
            </div>
          )}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-switch" style={{ marginTop: 16 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
