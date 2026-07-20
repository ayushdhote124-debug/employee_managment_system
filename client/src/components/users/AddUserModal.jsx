import React, { useState } from 'react';
import { useCreateUserMutation } from '../../features/users/userApi';
import { X } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, defaultRole = 'employee' }) {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
    department: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createUser(formData).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ name: '', email: '', password: '', role: defaultRole, department: '' });
      }, 1500);
    } catch (err) {
      setError(err?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
            Add New {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem', borderRadius: '8px', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {success && (
            <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #a7f3d0' }}>
              User successfully created!
            </div>
          )}
          {error && (
            <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} id="add-user-form">
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Full Name</label>
              <input 
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                className="form-input"
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Email Address</label>
              <input 
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Password</label>
              <input 
                type="password" name="password" required minLength={6}
                value={formData.password} onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Role</label>
                <select 
                  name="role"
                  value={formData.role} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Department</label>
                <input 
                  type="text" name="department"
                  value={formData.department} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            type="button" onClick={onClose}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid #cbd5e1', background: '#fff', color: '#475569', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            type="submit" form="add-user-form" disabled={isLoading}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
