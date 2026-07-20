import { useState, useCallback } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errMsg = 'Geolocation is not supported by your browser';
        setError(errMsg);
        reject(new Error(errMsg));
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: null
          };

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc.latitude}&lon=${loc.longitude}&format=json`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.address) {
                const { state, city, town, village, county, suburb, neighbourhood } = data.address;
                const place = city || town || village || suburb || neighbourhood || county;
                loc.address = [place, state].filter(Boolean).join(', ');
              }
            }
          } catch (e) {
            console.error('Reverse geocoding failed', e);
          }

          setLocation(loc);
          setIsLoading(false);
          resolve(loc);
        },
        (err) => {
          let errMsg = 'Unable to retrieve your location';
          if (err.code === 1) errMsg = 'Location permission denied. Please allow location access.';
          setError(errMsg);
          setIsLoading(false);
          reject(new Error(errMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, []);

  return { location, error, isLoading, fetchLocation };
}