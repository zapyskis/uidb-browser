import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Device } from '../types/device';
import { fetchUidbData } from '../api/uidbApi';

interface DevicesContextType {
  devices: Device[];
  devicesById: Record<string, Device>;
  getDeviceById: (id: string) => Device | undefined;
  isLoading: boolean;
  error: string | null;
  usingFallback: boolean;
}

export const DevicesContext = createContext<DevicesContextType>({
  devices: [],
  isLoading: true,
  error: null,
  usingFallback: false,
  devicesById: {},
  getDeviceById: () => undefined,
});

const normalizeDevicesById = (devices: Device[]): Record<string, Device> => {
  return devices.reduce(
    (acc, device) => {
      acc[device.id] = device;
      return acc;
    },
    {} as Record<string, Device>,
  );
};

export const DevicesProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        setIsLoading(true);
        const { data, usingFallback: isUsingFallback } = await fetchUidbData();

        setDevices(data.devices);
        setUsingFallback(isUsingFallback);
        setError(null);
      } catch (err) {
        setError('Failed to load device data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, []);

  const devicesById = useMemo(() => normalizeDevicesById(devices), [devices]);
  const getDeviceById = (id: string): Device | undefined => devicesById[id];

  return (
    <DevicesContext.Provider value={{ devices, isLoading, error, usingFallback, devicesById, getDeviceById }}>
      {children}
    </DevicesContext.Provider>
  );
};
