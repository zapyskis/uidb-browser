import { useContext } from 'react';
import { DevicesContext } from '../contexts/DevicesContext';

export const useDevices = () => {
  const { devices, isLoading, error, usingFallback } = useContext(DevicesContext);

  return {
    devices: devices,
    isLoading,
    error,
    usingFallback,
  };
};
