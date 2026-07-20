import React, { useState } from 'react';
import useCamera from '../../hooks/useCamera';
import useGeolocation from '../../hooks/useGeolocation';
import { usePunchInMutation, usePunchOutMutation, useGetTodayAttendanceQuery, useGetAttendanceHistoryQuery } from '../../features/attendance/attendanceApi';

export default function PunchWidget() {
  const { videoRef, isCameraActive, error: cameraError, startCamera, stopCamera, capturePhoto } = useCamera();
  const { location, error: geoError, isLoading: isGeoLoading, fetchLocation } = useGeolocation();

  const [step, setStep] = useState('idle'); // idle | active | processing | done
  const [photoData, setPhotoData] = useState(null);
  
  const { data: todayData, isLoading: isLoadingToday } = useGetTodayAttendanceQuery();
  const { data: historyData, isLoading: isLoadingHistory } = useGetAttendanceHistoryQuery();
  
  const [punchIn, { isLoading: isPunchingIn }] = usePunchInMutation();
  const [punchOut, { isLoading: isPunchingOut }] = usePunchOutMutation();
  const [punchResult, setPunchResult] = useState(null);

  const attendance = todayData?.attendance;
  const isPunchedIn = attendance && !attendance.punchOut;
  const isShiftCompleted = attendance && attendance.punchOut;

  const handleStartPunch = async () => {
    setStep('active');
    startCamera();
    try {
      await fetchLocation();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmPunch = async (type) => {
    const photo = capturePhoto();
    if (!photo || !location) return;

    setPhotoData(photo);
    stopCamera();
    setStep('processing');

    try {
      let res;
      if (type === 'out') {
        res = await punchOut({
          photo,
          latitude: location.latitude,
          longitude: location.longitude
        }).unwrap();
        setPunchResult({
          status: 'success',
          message: 'Successfully punched out at ' + new Date().toLocaleTimeString()
        });
      } else {
        res = await punchIn({
          photo,
          latitude: location.latitude,
          longitude: location.longitude
        }).unwrap();
        setPunchResult({
          status: 'success',
          message: 'Successfully punched in at ' + new Date().toLocaleTimeString()
        });
      }
      setStep('done');
    } catch (err) {
      setPunchResult({ 
        status: 'error', 
        message: err?.data?.message || 'Failed to record punch' 
      });
      setStep('done');
    }
  };

  const handleCancel = () => {
    stopCamera();
    setPhotoData(null);
    setStep('idle');
  };

  const renderAttendanceCalendar = () => {
    if (isLoadingHistory) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading calendar...</div>;
    
    const history = historyData?.history || [];
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayDate = now.getDate();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    return (
      <div className="widget" style={{ width: '100%', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px', textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={idx} style={{ padding: '0.5rem' }}></div>;
            
            const cellDate = new Date(currentYear, currentMonth, day);
            const isSunday = cellDate.getDay() === 0;
            const isPast = cellDate.getTime() < new Date(currentYear, currentMonth, todayDate).getTime();
            const isToday = day === todayDate;
            
            const record = history.find(item => {
              const itemDate = new Date(item.attendanceDate);
              return itemDate.getDate() === day && itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
            });

            let statusText = '';
            let borderColor = 'transparent'; // No border for future days
            let textColor = '#64748b';
            let bgColor = 'transparent';

            if (isSunday) {
              statusText = 'Week Off';
              borderColor = '#cbd5e1'; // Gray
              textColor = '#64748b';
              bgColor = '#f8fafc';
            } else if (record) {
              if (record.punchOut) {
                if (record.workingHours >= 8) {
                  statusText = 'Completed';
                  borderColor = '#22c55e'; // Green
                  textColor = '#15803d';
                  bgColor = '#f0fdf4';
                } else {
                  statusText = 'Incomplete';
                  borderColor = '#eab308'; // Yellow
                  textColor = '#a16207';
                  bgColor = '#fefce8';
                }
              } else {
                statusText = 'Pending';
                borderColor = '#f97316'; // Orange
                textColor = '#c2410c';
                bgColor = '#fff7ed';
              }
            } else {
              if (isPast) {
                statusText = 'Absent';
                borderColor = '#ef4444'; // Red
                textColor = '#b91c1c';
                bgColor = '#fef2f2';
              } else if (isToday) {
                statusText = 'Not Punched';
                borderColor = '#94a3b8';
              }
            }

            return (
              <div key={idx} className="attendance-calendar-cell" style={{ 
                border: `2px solid ${borderColor}`, 
                borderRadius: '8px', 
                padding: '0.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                background: bgColor
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '700', color: isToday ? 'var(--blue-accent)' : 'var(--text-main)' }}>{day}</span>
                {statusText && (
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: textColor, marginTop: '6px', textAlign: 'center', lineHeight: 1.1 }}>
                    {statusText}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCameraSection = () => {
    if (isLoadingToday) {
      return <div className="punch-widget idle-state" style={{ textAlign: 'center', padding: '2rem 0' }}>Loading status...</div>;
    }

    if (isShiftCompleted) {
      return (
        <div className="punch-widget done-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h4 style={{ color: 'var(--success)' }}>Shift Completed!</h4>
          <p style={{ color: 'var(--text-muted)' }}>You have completed your shift for today.</p>
        </div>
      );
    }

    if (step === 'idle') {
      return (
        <div className="punch-widget idle-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <button className="btn-login" onClick={handleStartPunch} style={{ maxWidth: '300px', fontSize: '1.1rem', padding: '1rem', background: 'var(--blue-accent)', color: '#fff' }}>
            Open Camera for Attendance
          </button>
        </div>
      );
    }

    if (step === 'processing') {
      return (
        <div className="punch-widget processing-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Processing your punch...</p>
        </div>
      );
    }

    if (step === 'done') {
      return (
        <div className="punch-widget done-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h4 style={{ color: punchResult?.status === 'success' ? 'var(--success)' : 'var(--danger)' }}>
            {punchResult?.status === 'success' ? 'Success!' : 'Error'}
          </h4>
          <p style={{ color: 'var(--text-muted)' }}>{punchResult?.message}</p>
          <button className="btn-login" onClick={() => setStep('idle')} style={{ marginTop: '1rem', maxWidth: '150px' }}>
            Done
          </button>
        </div>
      );
    }

    return (
      <div className="punch-widget active-state">
        <div className="video-container" style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', minHeight: '300px' }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {!isCameraActive && !cameraError && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff' }}>Starting camera...</div>
          )}
        </div>

        <div className="status-indicators" style={{ textAlign: 'center', margin: '1rem 0', fontSize: '0.9rem' }}>
          <p style={{ color: cameraError ? 'red' : 'green', margin: '0.2rem 0' }}>
            📷 Camera: {cameraError ? cameraError : (isCameraActive ? 'Active' : 'Starting...')}
          </p>
          <p style={{ color: geoError ? 'red' : (location ? 'green' : 'orange'), margin: '0.2rem 0' }}>
            📍 GPS: {geoError ? geoError : (location ? `Acquired: ${location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}` : 'Fetching...')}
          </p>
        </div>

        <div className="action-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-login" 
            onClick={() => handleConfirmPunch('in')}
            disabled={!isCameraActive || !location || isPunchingIn || isPunchingOut || isPunchedIn}
            style={{ flex: 1, backgroundColor: isPunchedIn ? 'var(--bg-card)' : 'var(--success)', color: isPunchedIn ? 'var(--text-muted)' : '#fff', minWidth: '140px', maxWidth: '200px' }}
          >
            {isPunchingIn ? 'Punching...' : 'Punch In'}
          </button>
          <button 
            className="btn-login" 
            onClick={() => handleConfirmPunch('out')}
            disabled={!isCameraActive || !location || isPunchingIn || isPunchingOut || !isPunchedIn}
            style={{ flex: 1, backgroundColor: !isPunchedIn ? 'var(--bg-card)' : 'var(--warning)', color: !isPunchedIn ? 'var(--text-muted)' : '#10162a', minWidth: '140px', maxWidth: '200px' }}
          >
            {isPunchingOut ? 'Punching...' : 'Punch Out'}
          </button>
          <button 
            className="btn-login" 
            onClick={handleCancel} 
            style={{ flex: 1, backgroundColor: 'var(--text-muted)', color: '#fff', minWidth: '140px', maxWidth: '200px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Helper to generate the last 5 days data
  const generateRecentDays = () => {
    const days = [];
    const history = historyData?.history || [];
    
    // Create last 5 days (including today)
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      
      const isSunday = d.getDay() === 0;
      const isToday = i === 0;
      
      const record = history.find(item => {
        const itemDate = new Date(item.attendanceDate);
        itemDate.setHours(0,0,0,0);
        return itemDate.getTime() === d.getTime();
      });

      let status = '';
      let colorClass = '';

      if (isSunday) {
        status = 'Week Off';
        colorClass = 'gray-border';
      } else if (record) {
        if (record.punchOut && record.workingHours >= 8) {
          status = 'Completed';
          colorClass = 'green-border';
        } else if (record.punchOut && record.workingHours < 8) {
          status = 'Incomplete';
          colorClass = 'orange-border'; // Using orange as fallback for yellow in CSS
        } else {
          status = 'Pending';
          colorClass = 'orange-border';
        }
      } else {
        if (isToday) {
          status = 'Not Punched';
          colorClass = 'gray-border';
        } else {
          status = 'Absent';
          colorClass = 'red-border';
        }
      }

      days.push({
        dateStr: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        status,
        colorClass
      });
    }
    return days;
  };

  return (
    <div>
      {/* Top Section: Camera & Punch Buttons */}
      {renderCameraSection()}

      {/* Bottom Section: Calendar and Recent 5 Days */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '3rem', alignItems: 'flex-start' }}>
        
        {/* Left Side: Full Month Calendar */}
        <div style={{ flex: '2 1 600px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.5rem' }}>Monthly Attendance</h3>
          {renderAttendanceCalendar()}
        </div>

        {/* Right Side: Recent 5 Days */}
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.5rem' }}>Recent 5 Days</h3>
          {isLoadingHistory ? (
            <p>Loading history...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {generateRecentDays().map((day, idx) => (
                <div 
                  key={idx} 
                  className={`attendance-day-card ${day.colorClass}`}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1.25rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '12px',
                    borderLeft: '5px solid',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                    {day.dateStr}
                  </div>
                  <div style={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px'
                  }} className={`status-text-${day.colorClass}`}>
                    {day.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
