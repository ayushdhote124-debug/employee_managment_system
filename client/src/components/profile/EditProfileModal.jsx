import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useUpdateProfileMutation } from '../../features/users/userApi';
import { updateUser } from '../../features/auth/authSlice';
import { X, Upload, User, Loader2 } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, user }) {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [name, setName] = useState(user?.name || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB');
        return;
      }
      setError('');
      setImageFile(file);

      // Create preview & convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = { name };
      if (imageFile && imagePreview) {
        payload.profileImage = imagePreview; // base64 string
      }

      const updatedUser = await updateProfile(payload).unwrap();
      dispatch(updateUser(updatedUser));
      onClose();
    } catch (err) {
      setError(err?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '450px', position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#64748b'
        }}>
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Edit Profile</h2>

        {error && (
          <div className="error-banner" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Avatar Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: '#f1f5f9', border: '3px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', marginBottom: '1rem', position: 'relative'
            }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} color="#94a3b8" />
              )}
            </div>

            <label style={{
              cursor: 'pointer', color: '#3b82f6', fontWeight: '500',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
              <Upload size={16} /> Change Photo
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="form-group-clean">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              placeholder="Enter your full name"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-action-base btn-primary-blue" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.9rem' }}
          >
            {isLoading ? <><Loader2 size={18} className="spin" /> Saving...</> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
