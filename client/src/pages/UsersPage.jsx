import React, { useState } from 'react';
import { useGetUsersQuery } from '../features/users/userApi';
import DashboardHeader from '../components/layout/DashboardHeader';
import { Search, ChevronRight } from 'lucide-react';
import UserProfileModal from '../components/users/UserProfileModal';

export default function UsersPage() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <DashboardHeader />
      </div>

      <div className="widget" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#1e293b' }}>Users Directory</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px', border: '1px solid #e2e8f0',
                outline: 'none', fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading users...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>Failed to load users.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Department</th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr 
                      key={user._id} 
                      onClick={() => setSelectedUserId(user._id)}
                      style={{ 
                        borderBottom: '1px solid #f1f5f9', 
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {user.name.substring(0,2).toUpperCase()}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                          backgroundColor: user.role === 'admin' ? '#f5f3ff' : user.role === 'manager' ? '#ecfdf5' : '#eff6ff',
                          color: user.role === 'admin' ? '#8b5cf6' : user.role === 'manager' ? '#10b981' : '#3b82f6'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{user.department || '-'}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#94a3b8' }}>
                        <ChevronRight size={20} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No users found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUserId && (
        <UserProfileModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </div>
  );
}
