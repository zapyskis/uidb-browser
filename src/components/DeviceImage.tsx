import { useState } from 'react';
import { useDevice } from '../hooks/useDevices';

const DEFAULT_SIZE = 20;
const IMAGE_QUALITY = 85;
const BASE_URL = 'https://images.svc.ui.com/';
const STATIC_URL = 'https://static.ui.com/fingerprint/ui/images';

interface Props {
  deviceId: string;
  size?: number;
  className?: string;
  alt?: string;
}

const buildImageUrl = (deviceId: string, imageHash: string, size: number): string => {
  const encodedPath = encodeURIComponent(`${STATIC_URL}/${deviceId}/default/${imageHash}.png`);
  return `${BASE_URL}?u=${encodedPath}&w=${size}&q=${IMAGE_QUALITY}`;
};

export const DeviceImage: React.FC<Props> = ({ deviceId, size = DEFAULT_SIZE, className = '', alt }) => {
  const [imageError, setImageError] = useState(false);
  const { device } = useDevice(deviceId);

  if (!device?.images?.default || imageError) {
    return null;
  }

  const imageUrl = buildImageUrl(deviceId, device.images.default, size);
  const imageAlt = alt ?? `${device.product.name} image`;

  return (
    <img
      src={imageUrl}
      alt={imageAlt}
      width={size}
      height={size}
      className={className}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};
