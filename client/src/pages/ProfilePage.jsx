import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Shield, Building, Edit2 } from 'lucide-react';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
      <div className="dashboard-welcome-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="welcome-content">
          <h2>My Profile</h2>
          <p className="welcome-subtitle">Manage your account information and preferences</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-action-base btn-primary-blue" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Edit2 size={16} /> Edit Profile
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        {/* Profile Header Background */}
        <div style={{ height: '120px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}></div>
        
        {/* Profile Info */}
        <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
          {/* Avatar */}
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: '#f1f5f9', 
            border: '4px solid #fff',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'absolute',
            top: '-50px',
            left: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color="#94a3b8" />
            )}
          </div>

          <div style={{ marginLeft: '120px', paddingTop: '0.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.25rem', fontWeight: '700' }}>{user.name}</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', textTransform: 'capitalize' }}>{user.role} | {user.department || 'General Department'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              
              {/* Detail Item */}
              <div className="profile-detail-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ background: '#dbeafe', padding: '0.75rem', borderRadius: '50%', color: '#3b82f6' }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Full Name</p>
                  <p style={{ color: '#1e293b', fontWeight: 500 }}>{user.name}</p>
                </div>
              </div>

              {/* Detail Item */}
              <div className="profile-detail-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ background: '#fce7f3', padding: '0.75rem', borderRadius: '50%', color: '#ec4899' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Email Address</p>
                  <p style={{ color: '#1e293b', fontWeight: 500 }}>{user.email}</p>
                </div>
              </div>

              {/* Detail Item */}
              <div className="profile-detail-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '50%', color: '#f59e0b' }}>
                  <Building size={20} />
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Department</p>
                  <p style={{ color: '#1e293b', fontWeight: 500 }}>{user.department || 'General'}</p>
                </div>
              </div>

              {/* Detail Item */}
              <div className="profile-detail-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '50%', color: '#10b981' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>System Role</p>
                  <p style={{ color: '#1e293b', fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</p>
                </div>
              </div>

            </div>
        </div>
      </div>
      
      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={user} 
      />
    </div>
  );
}
