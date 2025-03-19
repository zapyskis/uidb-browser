import { useState, useEffect, useRef } from 'react';
import { useDevice } from '../hooks/useDevices';
import { Loader } from '@ubnt/ui-components';

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

const ImageLoader: React.FC = () => (
  <div className={`w-full h-full flex justify-center items-center`}>
    <Loader />
  </div>
);

export const DeviceImage: React.FC<Props> = ({ deviceId, size = DEFAULT_SIZE, className = '', alt }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { device } = useDevice(deviceId);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setImageError(false);

    if (imageRef.current?.complete) {
      setIsLoading(false);
    }
  }, [deviceId]);

  if (!device?.images?.default || imageError) {
    return null;
  }

  const imageUrl = buildImageUrl(deviceId, device.images.default, size);
  const imageAlt = alt ?? `${device.product.name} image`;

  return (
    <div style={{ width: size, height: size }}>
      {isLoading && <ImageLoader />}
      <img
        ref={imageRef}
        key={deviceId}
        src={imageUrl}
        alt={imageAlt}
        width={size}
        height={size}
        className={`${isLoading ? 'invisible' : 'visible'} ${className}`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
    </div>
  );
};
