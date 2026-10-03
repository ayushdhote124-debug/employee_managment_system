/**
 * File Name: LocationPicker.jsx
 * File Path: client/src/components/attendance/LocationPicker.jsx
 * 
 * Component Description:
 * GPS Location Verification component for location-restricted attendance marking.
 * Integrates `useGeolocation` hook to detect user latitude, longitude, and accuracy.
 * Calculates proximity to office geofence coordinates and displays validation feedback.
 * 
 * Data & Props Used:
 * - useGeolocation Hook: provides latitude, longitude, accuracy, error, loading, getLocation
 * - officeGeofence (object): { lat: number, lng: number, radiusMeters: number } (default HQ coords)
 * - onLocationVerified (function): Callback receiving location object { lat, lng, isGeofenced, distance }
 * 
 * Responsiveness:
 * - Responsive card layout with visual status badge and refresh trigger
 * - Mobile GPS location support
 * 
 * Component Usage:
 * - PunchWidget, PunchPage, ValidationPage
 */

import React, { useEffect } from 'react';
import { MapPin, Navigation, RefreshCw, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import useGeolocation from '../../hooks/useGeolocation';

export default function LocationPicker({
  officeGeofence = { lat: 28.6139, lng: 77.2090, radiusMeters: 500, name: 'Main HQ Office' },
  onLocationVerified,
  className = ''
}) {
  const { latitude, longitude, accuracy, error, loading, getLocation } = useGeolocation();

  // Helper formula to calculate distance between two coordinates in meters (Haversine formula)
  const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  const distanceMeters = calculateDistanceInMeters(latitude, longitude, officeGeofence.lat, officeGeofence.lng);
  const isWithinGeofence = distanceMeters !== null ? distanceMeters <= officeGeofence.radiusMeters : true;

  useEffect(() => {
    if (latitude && longitude && onLocationVerified) {
      onLocationVerified({
        latitude,
        longitude,
        accuracy,
        isWithinGeofence,
        distanceMeters
      });
    }
  }, [latitude, longitude, accuracy, isWithinGeofence]);

  return (
    <div
      className={`location-picker-container ${className}`}
      style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-color, #e2e8f0)',
        borderRadius: '1rem',
        padding: '1.25rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} style={{ color: '#10b981' }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>
            GPS Location Verification
          </h4>
        </div>

        <button
          onClick={getLocation}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.3rem 0.6rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--border-color, #cbd5e1)',
            backgroundColor: 'var(--bg-app, #f8fafc)',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--text-main, #0f172a)',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Locating...' : 'Refresh GPS'}
        </button>
      </div>

      {/* GPS Status Card */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderRadius: '0.75rem',
          backgroundColor: error
            ? 'rgba(239, 68, 68, 0.08)'
            : latitude
            ? isWithinGeofence
              ? 'rgba(16, 185, 129, 0.08)'
              : 'rgba(245, 158, 11, 0.08)'
            : 'var(--bg-app, #f8fafc)',
          border: `1px solid ${
            error
              ? 'rgba(239, 68, 68, 0.3)'
              : latitude
              ? isWithinGeofence
                ? 'rgba(16, 185, 129, 0.3)'
                : 'rgba(245, 158, 11, 0.3)'
              : 'var(--border-color, #e2e8f0)'
          }`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        {error ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#ef4444' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>GPS Signal Unreachable</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{error}</p>
            </div>
          </div>
        ) : latitude && longitude ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: isWithinGeofence ? '#10b981' : '#d97706',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                {isWithinGeofence ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {isWithinGeofence ? 'Inside Office Geofence' : 'Remote / Out of Bounds'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Accuracy: ±{Math.round(accuracy || 15)}m
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-main, #1e293b)', fontFamily: 'monospace' }}>
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </div>

            {distanceMeters !== null && (
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                Distance to {officeGeofence.name}: {distanceMeters} meters
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
            <Navigation size={18} />
            <span style={{ fontSize: '0.8rem' }}>Detecting your location...</span>
          </div>
        )}
      </div>
    </div>
  );
}