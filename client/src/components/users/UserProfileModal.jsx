import React from 'react';
import { X, Mail, Phone, Building, Briefcase, Calendar, Hash } from 'lucide-react';
import { useGetUserDetailsQuery } from '../../features/users/userApi';

export default function UserProfileModal({ userId, onClose }) {
  const { data: user, isLoading, error } = useGetUserDetailsQuery(userId, {
    skip: !userId, // skip fetching if no user id provided
  });

  if (!userId) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '500px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#1e293b' }}>User Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {isLoading ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>Loading details...</p>
          ) : error ? (
            <p style={{ color: '#ef4444', textAlign: 'center' }}>Failed to load profile.</p>
          ) : user ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                  {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.25rem' }}>{user.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '1rem', textTransform: 'capitalize' }}>{user.role}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                  <Mail size={20} color="#3b82f6" />
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.1rem' }}>Email Address</p>
                    <p style={{ color: '#1e293b', fontWeight: 500 }}>{user.email}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                  <Briefcase size={20} color="#8b5cf6" />
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.1rem' }}>Department</p>
                    <p style={{ color: '#1e293b', fontWeight: 500 }}>{user.department || 'Not Assigned'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                  <Calendar size={20} color="#10b981" />
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.1rem' }}>Joined Date</p>
                    <p style={{ color: '#1e293b', fontWeight: 500 }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b' }}>No data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
