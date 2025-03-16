import React from 'react';
import { useDevices } from '../hooks/useDevices';
import { Link } from '@tanstack/react-router';

const DevicesListPage: React.FC = () => {
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

  return (
    <div>
      <div>DevicesListPage</div>

      <div>
        {devices.map((device) => (
          <div key={device.id}>
            <Link to="/device/$deviceId" params={{ deviceId: device.id }}>
              {device.product.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevicesListPage;
