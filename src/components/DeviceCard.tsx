import React from 'react';
import { Link } from '@tanstack/react-router';
import { Device } from '../types/device';
import { Text } from '@ubnt/ui-components/aria';
import Tag from './Tag';
import { DeviceImage } from './DeviceImage';

const DEVICE_IMAGE_SIZE = 100;

interface Props {
  device: Device;
}

const DeviceCard: React.FC<Props> = ({ device }) => {
  return (
    <Link to="/device/$deviceId" params={{ deviceId: device.id }} className="group">
      <div className="overflow-hidden flex flex-col w-full h-[172px] rounded-lg border border-u-neutral-03">
        <div className="relative h-[100px] flex items-center justify-center bg-u-neutral-01 group-hover:bg-u-neutral-02">
          <Tag className="absolute top-[3px] right-[3px]" text={device.line.name} />
          {device.images?.default ? (
            <DeviceImage size={DEVICE_IMAGE_SIZE} deviceId={device.id} />
          ) : (
            <div className="text-gray-400">No image</div>
          )}
        </div>

        <div className="flex-1 group-hover:bg-u-neutral-01">
          <div className="flex flex-col justify-between h-full p-2">
            <Text color="text-1" variant="body-primary">
              {device.product.name}
            </Text>
            {device.shortnames && device.shortnames.length > 0 && (
              <div className="text-xs text-gray-500 truncate">{device.shortnames.join(', ')}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DeviceCard;
