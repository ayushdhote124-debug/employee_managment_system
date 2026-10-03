/**
 * File Name: CameraCapture.jsx
 * File Path: client/src/components/attendance/CameraCapture.jsx
 * 
 * Component Description:
 * Modern photo verification camera component used for employee facial attendance verification.
 * Uses web browser media devices API (via `useCamera` hook) to render live camera stream,
 * take snapshot images, preview captured photos, and reset/retake.
 * 
 * Data & Props Used:
 * - useCamera Hook: provides videoRef, isCameraOn, capturedImage, startCamera, stopCamera, capturePhoto, retakePhoto, cameraError
 * - onPhotoCaptured (function): Callback receiving base64 image data string when photo is confirmed/captured
 * - required (boolean): Visual required tag
 * 
 * Responsiveness:
 * - Aspect-ratio responsive viewfinder canvas (4:3 / 16:9 layout)
 * - Mobile front/rear camera compatibility & touch buttons
 * 
 * Component Usage:
 * - PunchWidget, PunchPage, ValidationPage
 */

import React, { useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import useCamera from '../../hooks/useCamera';

export default function CameraCapture({
  onPhotoCaptured,
  required = true,
  className = ''
}) {
  const {
    videoRef,
    isCameraOn,
    capturedImage,
    startCamera,
    stopCamera,
    capturePhoto,
    retakePhoto,
    cameraError
  } = useCamera();

  // Auto-start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Pass captured image data to parent component callback
  const handleCapture = () => {
    const photoData = capturePhoto();
    if (photoData && onPhotoCaptured) {
      onPhotoCaptured(photoData);
    }
  };

  const handleRetake = () => {
    retakePhoto();
    if (onPhotoCaptured) {
      onPhotoCaptured(null);
    }
  };

  return (
    <div
      className={`camera-capture-container ${className}`}
      style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-color, #e2e8f0)',
        borderRadius: '1rem',
        padding: '1.25rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        width: '100%'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Camera size={18} style={{ color: '#3b82f6' }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>
            Photo Verification {required && <span style={{ color: '#ef4444' }}>*</span>}
          </h4>
        </div>
        
        {isCameraOn && !capturedImage && (
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} /> LIVE
          </span>
        )}
      </div>

      {/* Viewfinder Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '360px',
          height: '240px',
          borderRadius: '0.75rem',
          backgroundColor: '#0f172a',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed var(--border-color, #cbd5e1)'
        }}
      >
        {cameraError ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#ef4444' }}>
            <AlertTriangle size={32} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>Camera Access Error</p>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              {cameraError || 'Please allow camera permission in browser.'}
            </p>
            <button
              onClick={startCamera}
              style={{
                marginTop: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '0.375rem',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry Camera
            </button>
          </div>
        ) : capturedImage ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={capturedImage}
              alt="Captured verification photo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.9)',
              color: '#ffffff',
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <CheckCircle size={12} /> Photo Captured
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />
        )}
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '360px' }}>
        {capturedImage ? (
          <button
            onClick={handleRetake}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--bg-app, #f1f5f9)',
              color: 'var(--text-main, #0f172a)',
              fontWeight: '600',
              fontSize: '0.85rem',
              border: '1px solid var(--border-color, #cbd5e1)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} /> Retake Photo
          </button>
        ) : (
          <button
            onClick={handleCapture}
            disabled={!isCameraOn || !!cameraError}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.66rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: !isCameraOn || !!cameraError ? '#94a3b8' : '#3b82f6',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.85rem',
              border: 'none',
              cursor: !isCameraOn || !!cameraError ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.25)'
            }}
          >
            <Camera size={18} /> Capture Photo
          </button>
        )}
      </div>
    </div>
  );
}