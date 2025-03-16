import React from 'react';
import { useDevices } from '../hooks/useDevices';
import CardView from '../components/CardView';

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

  return <CardView devices={devices} />;
};

export default DevicesListPage;
