import { useState, useEffect } from 'react';
import { Text } from '@ubnt/ui-components/aria';
import { Search_Default } from '@ubnt/ui-components/aria/experimental';
import { useDevices } from '../hooks/useDevices';

const STYLES = {
  container: 'flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 w-full',
  deviceCount: 'whitespace-nowrap',
};

const BREAKPOINT = {
  smallScreen: 640,
  defaultWidth: 320,
  mobileWidth: 280,
};

const DEBOUNCE_DELAY = 100;

interface Props {
  onSearch?: (query: string) => void;
}

const useSearchWidth = () => {
  const getSearchWidth = () =>
    window.innerWidth < BREAKPOINT.smallScreen ? BREAKPOINT.mobileWidth : BREAKPOINT.defaultWidth;
  const [searchWidth, setSearchWidth] = useState(getSearchWidth());

  useEffect(() => {
    const handleResize = () => setSearchWidth(getSearchWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return searchWidth;
};

const DeviceCount: React.FC<{ count: number }> = ({ count }) => (
  <Text variant="caption" color="text-4" className={STYLES.deviceCount}>
    {count} Devices
  </Text>
);

export const Search: React.FC<Props> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const { devices, setSearchTerm } = useDevices();
  const searchWidth = useSearchWidth();

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchValue);
      setSearchTerm(searchValue);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch, setSearchTerm]);

  return (
    <div className={STYLES.container}>
      <Search_Default placeholder="Search" onInputChange={setSearchValue} width={searchWidth} aria-label="Search" />
      <DeviceCount count={devices.length} />
    </div>
  );
};
