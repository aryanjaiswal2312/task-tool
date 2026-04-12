import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userAPI } from '../services/api';
import { useTasks } from '../context/TaskContext';

const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Australia/Sydney'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { stats } = useTasks();
  const { success, error } = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', location: '', timezone: 'Asia/Kolkata' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        timezone: user.timezone || 'Asia/Kolkata',
      });
    }
  }, [user]);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const resetFormFromUser = () => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        timezone: user.timezone || 'Asia/Kolkata',
      });
    }
  };

  const cancelEdit = () => {
    resetFormFromUser();
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { error('Name is required'); return; }
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      updateUser(res.data);
      success('Profile updated ✓');
      setEditing(false);
    } catch {
      error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    const errs = {};
    if (!pwForm.currentPassword) errs.cur = 'Required';
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) errs.new = 'Min 6 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }
    setSavingPw(true);
    try {
      await userAPI.updatePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      success('Password updated ✓');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwErrors({});
    } catch (e) {
      error(e?.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPw(false);
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Profile</div>
          <div className="page-sub">Manage your account information</div>
        </div>
      </div>

      <div className="page-body">
        {/* Profile card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="profile-cover" />
          <div className="profile-body" style={{ padding: '0 20px 20px' }}>
            <div className="profile-avatar-wrap">
              <div className="avatar avatar-lg">{initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>{user?.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user?.email}</div>
                {joinedDate && <div style={{ fontSize: 12, color: 'var(--hint)', marginTop: 2 }}>Member since {joinedDate}</div>}
              </div>
              <div className="profile-header-actions">
                {editing ? (
                  <>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" className="btn btn-sm" onClick={cancelEdit} disabled={saving}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-sm" onClick={() => setEditing(true)}>Edit profile</button>
                )}
              </div>
            </div>

            {editing ? (
              <div className="profile-edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full name</label>
                    <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="input" placeholder="City, Country" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="textarea" placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={2} />
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select className="select" value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}>
                    {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
                  <button type="button" className="btn" onClick={cancelEdit} disabled={saving}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                {[
                  { label: 'Email', val: user?.email },
                  { label: 'Location', val: user?.location || '—' },
                  { label: 'Timezone', val: user?.timezone || '—' },
                  { label: 'Bio', val: user?.bio || '—' },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, color: 'var(--text)' }}>{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stat-grid" style={{ marginBottom: 20 }}>
          <div className="profile-stat">
            <div className="profile-stat-val" style={{ color: 'var(--accent)' }}>{stats.total}</div>
            <div className="profile-stat-lbl">Total tasks</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-val" style={{ color: 'var(--green)' }}>{stats.completed}</div>
            <div className="profile-stat-lbl">Completed</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-val" style={{ color: 'var(--amber)' }}>{stats.completionRate}%</div>
            <div className="profile-stat-lbl">Completion rate</div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Change Password</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Current password</label>
              <input className="input" type="password" placeholder="••••••••" value={pwForm.currentPassword} onChange={e => { setPwForm(f => ({ ...f, currentPassword: e.target.value })); setPwErrors({}); }} />
              {pwErrors.cur && <div className="form-error">{pwErrors.cur}</div>}
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New password</label>
                <input className="input" type="password" placeholder="Min 6 characters" value={pwForm.newPassword} onChange={e => { setPwForm(f => ({ ...f, newPassword: e.target.value })); setPwErrors({}); }} />
                {pwErrors.new && <div className="form-error">{pwErrors.new}</div>}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm new password</label>
                <input className="input" type="password" placeholder="Repeat" value={pwForm.confirmPassword} onChange={e => { setPwForm(f => ({ ...f, confirmPassword: e.target.value })); setPwErrors({}); }} />
                {pwErrors.confirm && <div className="form-error">{pwErrors.confirm}</div>}
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handlePasswordSave} disabled={savingPw}>
              {savingPw ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
