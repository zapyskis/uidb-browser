import { useState } from 'react';
import { useDevice } from '../hooks/useDevices';

interface DeviceImageProps {
  deviceId: string;
  size?: number;
  className?: string;
}

export function DeviceImage({ deviceId, size = 20, className = '' }: DeviceImageProps) {
  const [imageError, setImageError] = useState(false);
  const { device } = useDevice(deviceId);

  if (!device || imageError) {
    return null;
  }

  const imageUrl = `https://images.svc.ui.com/?u=https%3A%2F%2Fstatic.ui.com%2Ffingerprint%2Fui%2Fimages%2F${deviceId}%2Fdefault%2F${device.images?.default}.png&w=${size}&q=85`;

  return (
    <img
      src={imageUrl}
      alt={`${device.product.name}`}
      width={size}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
