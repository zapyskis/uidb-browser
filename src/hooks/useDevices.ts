import { useContext, useMemo } from 'react';
import { DevicesContext } from '../contexts/DevicesContext';

export const useDevices = () => {
  const {
    devices,
    filteredDevices,
    isLoading,
    error,
    usingFallback,
    selectedProductLines,
    setSelectedProductLines,
    searchTerm,
    setSearchTerm,
  } = useContext(DevicesContext);

  const productLines = useMemo(() => {
    const lines = devices.map((device) => device.line);
    return [...new Map(lines.map((item) => [item.id, item])).values()];
  }, [devices]);

  return {
    devices: filteredDevices,
    allDevices: devices,
    isLoading,
    error,
    usingFallback,
    productLines,
    selectedProductLines,
    setSelectedProductLines,
    searchTerm,
    setSearchTerm,
  };
};

export function useDevice(id: string) {
  const { getDeviceById, isLoading, error, usingFallback } = useContext(DevicesContext);
  const device = getDeviceById(id);

  return { device, isLoading, error, usingFallback };
}
