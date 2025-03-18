import React from 'react';
import { useDevices } from '../hooks/useDevices';
import { CardView } from '../components/CardView';
import { Toolbar } from '../components/Toolbar';
import { TableView } from '../components/TableView';
import { Device } from '../types/device';

const STYLES = {
  container: 'toolbar h-full space-y-8',
  loadingContainer: 'flex items-center justify-center h-64',
  errorContainer: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4',
  errorTitle: 'font-bold mr-2',
};

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading devices...' }) => (
  <div className={STYLES.loadingContainer}>{message}</div>
);

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className={STYLES.errorContainer}>
    <span className={STYLES.errorTitle}>Error!</span>
    <span>{error}</span>
  </div>
);

interface DeviceViewProps {
  devices: Device[];
}

const DeviceView: React.FC<DeviceViewProps> = ({ devices }) => {
  const { viewMode } = useDevices();
  return viewMode === 'table' ? <TableView devices={devices} /> : <CardView devices={devices} />;
};

export const DevicesListPage: React.FC = () => {
  const { devices, isLoading, error, viewMode, setViewMode } = useDevices();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className={STYLES.container}>
      <Toolbar className="pl-8 pr-8" viewMode={viewMode} onViewModeChange={setViewMode} />
      <div className="pl-8">
        <DeviceView devices={devices} />
      </div>
    </div>
  );
};
