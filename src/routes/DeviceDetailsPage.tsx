import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useDevices } from '../hooks/useDevices';

const DeviceDetailsPage: React.FC = () => {
  const { deviceId } = useParams({ from: '/device/$deviceId' });
  const { devices, isLoading, error } = useDevices();

  if (isLoading) {
    return <div>Loading devices...</div>;
  }

  if (error) {
    return (
      <div>
        <div>Error!</div>
        <div>{error}</div>
      </div>
    );
  }

  const device = devices.find((d) => d.id === deviceId);

  if (!device) {
    return <div>Device not found</div>;
  }

  return (
    <div>
      <div>DeviceDetailsPage</div>

      <div>{device.line.name}</div>
      <div>{device.product.name}</div>
    </div>
  );
};

export default DeviceDetailsPage;
