import { useState } from 'react';

interface Position {
  latitude: number;
  longitude: number;
}

interface LocationState {
  position: Position | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<LocationState>({
    position: null,
    loading: false,
    error: null,
  });

  const getCurrentPosition = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Trình duyệt không hỗ trợ Geolocation',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = 'Không thể lấy vị trí';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Người dùng từ chối chia sẻ vị trí';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Thông tin vị trí không khả dụng';
            break;
          case error.TIMEOUT:
            errorMessage = 'Hết thời gian chờ lấy vị trí';
            break;
        }
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const watchPosition = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Trình duyệt không hỗ trợ Geolocation',
      }));
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = 'Không thể lấy vị trí';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Người dùng từ chối chia sẻ vị trí';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Thông tin vị trí không khả dụng';
            break;
          case error.TIMEOUT:
            errorMessage = 'Hết thời gian chờ lấy vị trí';
            break;
        }
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    return watchId;
  };

  const clearWatch = (watchId: number) => {
    navigator.geolocation.clearWatch(watchId);
  };

  return {
    ...state,
    getCurrentPosition,
    watchPosition,
    clearWatch,
  };
};
