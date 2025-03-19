import React, { useState, useEffect, useContext, ContextType, useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useDevices } from '../hooks/useDevices';
import { DeviceImage } from '../components/DeviceImage';
import { Heading } from '@ubnt/ui-components/aria';
import { Text } from '@ubnt/ui-components/aria';
import Button from '@ubnt/ui-components/Button/Button';
import { ToolbarDetails } from '../components/ToolbarDetails';
import { ErrorPage_Default } from '@ubnt/ui-components/aria';
import { Device } from '../types/device';
import { EntityToast, ToastContext } from '@ubnt/ui-components/Toast';
import { InfoIconL } from '@ubnt/icons';
import { getSetting, setSetting } from '../utils/localStorage';

const STYLES = {
  container: 'min-h-screen overflow-auto flex flex-col pr-8 pl-8',
  contentWrapper: 'flex flex-col md:flex-row w-full max-w-[768px] mx-auto px-4 md:px-0 mt-8',
  imageContainer: 'flex w-full md:w-[292px] h-[292px] bg-u-neutral-01 items-center justify-center rounded-lg',
  detailsContainer: 'flex-1 mt-4 md:mt-0 md:pl-8',
  detailRow: 'flex h-[32px] items-center',
  detailLabel: 'whitespace-nowrap text-right',
  detailValue: 'flex-1',
  jsonButton: '!text-sm !mt-6',
  jsonContainer:
    'flex mx-auto bg-u-neutral-01 rounded-lg overflow-hidden transition-all duration-300 ease-in-out w-full max-w-[768px] px-4 md:px-0',
  jsonVisible: 'opacity-100 mt-4 h-[calc(100vh-500px)]',
  jsonHidden: 'max-h-0 opacity-0',
  jsonContent: 'p-4 w-full overflow-auto',
  loadingContainer: 'flex items-center justify-center h-64',
  loadingSpinner: 'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto',
  loadingText: 'mt-4 text-gray-600',
  errorContainer: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4',
};

const IMAGE_SIZE = 260;

interface DetailItemProps {
  label: string;
  value?: string | number;
  units?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, units }) => (
  <div className={STYLES.detailRow}>
    <div className={STYLES.detailLabel}>
      <Text color="text-1">{label}</Text>
    </div>
    <div className={STYLES.detailValue} style={{ textAlign: 'right' }}>
      <Text color="text-3" className="leading-[0.5]">
        {value || '-'} {value ? units : ''}
      </Text>
    </div>
  </div>
);

const LoadingState: React.FC = () => (
  <div className={STYLES.loadingContainer}>
    <div className="text-center">
      <div className={STYLES.loadingSpinner} />
      <p className={STYLES.loadingText}>Loading product details...</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className={STYLES.errorContainer}>
    <strong className="font-bold">Error!</strong>
    <span className="block sm:inline"> {error}</span>
  </div>
);

interface DeviceDetailsProps {
  device: Device;
  onNext: () => void;
  onPrevious: () => void;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device, onNext, onPrevious }) => {
  const [isJsonVisible, setIsJsonVisible] = useState(false);

  const detailItems: DetailItemProps[] = [
    { label: 'Product Line', value: device.line.name },
    { label: 'ID', value: device.id },
    { label: 'Name', value: device.product.name },
    { label: 'Short Name', value: device.shortnames?.join(', ') },
    { label: 'Max. Power', value: device.unifi?.network?.power?.capacity, units: 'W' },
    { label: 'Speed', value: device.unifi?.network?.ethernetMaxSpeedMegabitsPerSecond, units: 'Mbps' },
    { label: 'Number of Ports', value: device.unifi?.network?.numberOfPorts },
  ];

  return (
    <div className={STYLES.container}>
      <ToolbarDetails onNext={onNext} onPrevious={onPrevious} />
      <div className={STYLES.contentWrapper}>
        <div className={STYLES.imageContainer}>
          <DeviceImage size={IMAGE_SIZE} deviceId={device.id} />
        </div>
        <div className={STYLES.detailsContainer}>
          <div>
            <Heading variant="xlarge-1">{device.product.name}</Heading>
            <Heading variant="body-secondary">{device.line.name}</Heading>
          </div>
          <div className="flex flex-col mt-4">
            {detailItems.map((item, index) => (
              <DetailItem key={index} {...item} />
            ))}
            <div className="flex justify-start">
              <Button className={STYLES.jsonButton} variant="inline" onClick={() => setIsJsonVisible(!isJsonVisible)}>
                {isJsonVisible ? 'Hide JSON Details' : 'See All Details as JSON'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="json-details"
        className={`${STYLES.jsonContainer} ${isJsonVisible ? STYLES.jsonVisible : STYLES.jsonHidden}`}
      >
        <pre className={STYLES.jsonContent}>{JSON.stringify(device, null, 2)}</pre>
      </div>
    </div>
  );
};

export const DeviceDetailsPage: React.FC = () => {
  const { deviceId } = useParams({ from: '/device/$deviceId' });
  const { allDevices, isLoading, error } = useDevices();
  const navigate = useNavigate();
  const { createNotification, removeNotification } = useContext<ContextType<typeof ToastContext>>(ToastContext);

  const getNeighborDevices = () => {
    const currentIndex = allDevices.findIndex((d) => d.id === deviceId);
    return {
      prevDevice: currentIndex > 0 ? allDevices[currentIndex - 1] : null,
      nextDevice: currentIndex < allDevices.length - 1 ? allDevices[currentIndex + 1] : null,
    };
  };

  const device = allDevices.find((d) => d.id === deviceId);
  const { prevDevice, nextDevice } = getNeighborDevices();

  useEffect(() => {
    const timer = setTimeout(() => {
      const doNotShowKeyboardTip = getSetting('doNotShowKeyboardTip');

      if (doNotShowKeyboardTip !== 'true') {
        createNotification(
          <div id="keyboardTip">
            <EntityToast
              duration={10000}
              title="Keyboard Navigation Tip"
              details={'Use the left and right arrow keys to navigate easily.'}
              icon={InfoIconL}
              primaryButton={{
                label: 'Do not show again',
                onClick: () => {
                  setSetting('doNotShowKeyboardTip', 'true');
                  removeNotification('keyboardTip');
                },
              }}
              onClose={(_e, id) => removeNotification(id || '')}
            />
          </div>,
        );
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      removeNotification('keyboardTip');
    };
  }, [createNotification, removeNotification]);

  const handlePrevious = useCallback(() => {
    if (prevDevice) {
      navigate({ to: '/device/$deviceId', params: { deviceId: prevDevice.id } });
    }
  }, [prevDevice, navigate]);

  const handleNext = useCallback(() => {
    if (nextDevice) {
      navigate({ to: '/device/$deviceId', params: { deviceId: nextDevice.id } });
    }
  }, [nextDevice, navigate]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNext, handlePrevious]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!device) {
    return (
      <ErrorPage_Default
        title="Device not found"
        actionButton={
          <Button variant="primary" onClick={() => navigate({ to: '/' })}>
            Go back to device list
          </Button>
        }
        description="The device you're looking for doesn't exist."
      />
    );
  }

  return <DeviceDetails device={device} onNext={handleNext} onPrevious={handlePrevious} />;
};
