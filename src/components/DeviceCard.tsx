import React from 'react';
import { Link } from '@tanstack/react-router';
import { Device } from '../types/device';
import { Text } from '@ubnt/ui-components/aria';
import { Tag } from './Tag';
import { DeviceImage } from './DeviceImage';

const IMAGE_SIZE = 100;
const CARD_HEIGHT = 172;

const STYLES = {
  card: 'overflow-hidden flex flex-col w-full rounded-lg border border-u-neutral-03',
  cardLink: 'group',
  imageContainer: 'relative h-[100px] flex items-center justify-center bg-u-neutral-01 group-hover:bg-u-neutral-02',
  tag: 'absolute top-[3px] right-[3px]',
  noImage: 'text-gray-400',
  contentContainer: 'flex-1 group-hover:bg-u-neutral-01',
  content: 'flex flex-col justify-between h-full p-2',
  shortnames: 'text-xs text-gray-500 truncate',
};

interface Props {
  device: Device;
}

const NoImage: React.FC = () => <div className={STYLES.noImage}>No image</div>;

const DeviceContent: React.FC<{ device: Device }> = ({ device }) => (
  <div className={STYLES.content}>
    <Text
      color="text-1"
      title={device.product.name}
      variant="body-primary"
      style={{ lineHeight: 1, maxHeight: '30px' }}
    >
      {device.product.name}
    </Text>
    {device.shortnames && device.shortnames.length > 0 && (
      <div className={STYLES.shortnames}>{device.shortnames.join(', ')}</div>
    )}
  </div>
);

export const DeviceCard: React.FC<Props> = ({ device }) => {
  return (
    <Link to="/device/$deviceId" params={{ deviceId: device.id }} className={STYLES.cardLink}>
      <div className={STYLES.card} style={{ height: CARD_HEIGHT }}>
        <div className={STYLES.imageContainer}>
          <Tag className={STYLES.tag} text={device.line.name} />
          {device.images?.default ? <DeviceImage size={IMAGE_SIZE} deviceId={device.id} /> : <NoImage />}
        </div>

        <div className={STYLES.contentContainer}>
          <DeviceContent device={device} />
        </div>
      </div>
    </Link>
  );
};
