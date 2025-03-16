import { createContext, useState, useEffect, ReactNode } from 'react';
import { Device } from '../types/device';
import { fetchUidbData } from '../api/uidbApi';

interface DevicesContextType {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  usingFallback: boolean;
}

export const DevicesContext = createContext<DevicesContextType>({
  devices: [],
  isLoading: true,
  error: null,
  usingFallback: false,
});

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

  return (
    <DevicesContext.Provider value={{ devices, isLoading, error, usingFallback }}>{children}</DevicesContext.Provider>
  );
};
