import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Device } from '../types/device';
import { fetchUidbData } from '../api/uidbApi';
import FlexSearch from 'flexsearch';

type ViewMode = 'table' | 'card';
const VIEW_MODE_KEY = 'deviceListViewMode';

interface DevicesContextType {
  devices: Device[];
  filteredDevices: Device[];
  devicesById: Record<string, Device>;
  getDeviceById: (id: string) => Device | undefined;
  isLoading: boolean;
  error: string | null;
  usingFallback: boolean;
  selectedProductLines: string[];
  setSelectedProductLines: (lines: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const DevicesContext = createContext<DevicesContextType>({
  devices: [],
  filteredDevices: [],
  isLoading: true,
  error: null,
  usingFallback: false,
  devicesById: {},
  getDeviceById: () => undefined,
  selectedProductLines: [],
  setSelectedProductLines: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  viewMode: 'table',
  setViewMode: () => {},
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
  const [selectedProductLines, setSelectedProductLines] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const savedMode = localStorage.getItem(VIEW_MODE_KEY);
    return (savedMode as ViewMode) || 'table';
  });

  const setViewMode = (mode: ViewMode) => {
    localStorage.setItem(VIEW_MODE_KEY, mode);
    setViewModeState(mode);
  };

  const searchIndex = useMemo(() => {
    if (devices.length === 0) return null;

    const index = new FlexSearch.Document({
      document: {
        id: 'id',
        index: ['product.name', 'shortnames', 'line.name'],
        store: true,
      },
      tokenize: 'forward',
    });

    devices.forEach((device) => {
      index.add({
        id: device.id,
        'product.name': device.product.name,
        shortnames: device.shortnames,
        'line.name': device.line.name,
      });
    });

    return index;
  }, [devices]);

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

  const filteredDevices = useMemo(() => {
    let results = devices;

    if (searchTerm && searchIndex) {
      const searchResults = searchIndex.search(searchTerm);
      const matchedIds = new Set<string>();

      searchResults.forEach((result) => {
        result.result.forEach((id) => matchedIds.add(id as string));
      });

      results = devices.filter((device) => matchedIds.has(device.id));
    }

    return results.filter((device) => {
      if (selectedProductLines.length === 0) {
        return true;
      }
      return selectedProductLines.includes(device.line.id);
    });
  }, [devices, selectedProductLines, searchTerm, searchIndex]);

  return (
    <DevicesContext.Provider
      value={{
        devices,
        filteredDevices,
        isLoading,
        error,
        usingFallback,
        devicesById,
        getDeviceById,
        selectedProductLines,
        setSelectedProductLines,
        searchTerm,
        setSearchTerm,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
};
