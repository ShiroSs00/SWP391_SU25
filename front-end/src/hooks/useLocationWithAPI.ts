import { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import { locationService } from '../services/location.service';

interface UseLocationWithAPIOptions {
  autoSend?: boolean; // Tự động gửi lên server khi có vị trí mới
  watchPosition?: boolean; // Theo dõi vị trí liên tục
  sendInterval?: number; // Khoảng thời gian gửi lên server (ms)
}

export const useLocationWithAPI = (options: UseLocationWithAPIOptions = {}) => {
  const {
    autoSend = false,
    watchPosition = false,
    sendInterval = 30000, // 30 giây
  } = options;

  const { position, loading, error, getCurrentPosition, watchPosition: startWatching, clearWatch } = useGeolocation();
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Gửi vị trí lên server
  const sendLocationToServer = useCallback(async () => {
    if (!position) return;

    setSending(true);
    setSendError(null);

    try {
      await locationService.sendLocation({
        latitude: position.latitude,
        longitude: position.longitude,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setSendError('Không thể gửi vị trí lên server');
      console.error('Error sending location:', error);
    } finally {
      setSending(false);
    }
  }, [position]);

  // Bắt đầu theo dõi vị trí
  const startLocationTracking = () => {
    if (watchPosition) {
      const id = startWatching();
      if (id) {
        setWatchId(id);
      }
    } else {
      getCurrentPosition();
    }
  };

  // Dừng theo dõi vị trí
  const stopLocationTracking = useCallback(() => {
    if (watchId) {
      clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId, clearWatch]);

  // Tự động gửi vị trí lên server khi có vị trí mới
  useEffect(() => {
    if (autoSend && position && !sending) {
      sendLocationToServer();
    }
  }, [position, autoSend, sending, sendLocationToServer]);

  // Gửi vị trí định kỳ
  useEffect(() => {
    if (autoSend && position && sendInterval > 0) {
      const interval = setInterval(() => {
        sendLocationToServer();
      }, sendInterval);

      return () => clearInterval(interval);
    }
  }, [autoSend, position, sendInterval, sendLocationToServer]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, [stopLocationTracking]);

  return {
    // Geolocation data
    position,
    loading,
    error,
    
    // API data
    sending,
    sendError,
    
    // Control functions
    getCurrentPosition,
    startLocationTracking,
    stopLocationTracking,
    sendLocationToServer,
    
    // State
    isTracking: watchId !== null,
  };
};
