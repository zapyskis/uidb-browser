import React from 'react';
import { Device } from '../types/device';
import { ResizeTable } from '@ubnt/ui-components';
import { DeviceImage } from './DeviceImage';
import { useRouter } from '@tanstack/react-router';

const IMAGE_COLUMN_SIZE = 36;
const TABLE_HEIGHT = 'calc(100vh - 150px)';
const ROW_HEIGHT = '33px';

interface Props {
  devices: Device[];
}

interface ShortNamesProps {
  shortnames: string[];
}

const ShortNames: React.FC<ShortNamesProps> = ({ shortnames }) => (
  <div className="whitespace-nowrap overflow-hidden text-ellipsis" title={shortnames.join(', ')}>
    {shortnames.join(', ')}
  </div>
);

const getTableColumns = () => [
  {
    id: 'image',
    size: IMAGE_COLUMN_SIZE,
    maxSize: IMAGE_COLUMN_SIZE,
    minSize: IMAGE_COLUMN_SIZE,
    enableResizing: false,
    enableSorting: false,
    header: undefined,
    cell: ({ row: { original: device } }: { row: { original: Device } }) => (
      <DeviceImage deviceId={device.id} alt={`${device.product.name} thumbnail`} />
    ),
  },
  {
    accessorKey: 'line.name',
    id: 'productLine',
    header: 'Product Line',
    minSize: 100,
    maxSize: 150,
    enableSorting: false,
  },
  {
    accessorKey: 'product.name',
    id: 'productName',
    header: 'Name',
    minSize: 200,
    enableSorting: false,
  },
  {
    id: 'shortnames',
    header: 'Short Names',
    enableSorting: false,
    minSize: 300,
    cell: ({ row: { original: device } }: { row: { original: Device } }) => (
      <ShortNames shortnames={device.shortnames} />
    ),
  },
  {
    accessorKey: 'sku',
    id: 'sku',
    header: 'SKU',
    enableSorting: false,
    minSize: 100,
    maxSize: 120,
  },
  {
    accessorKey: 'sysid',
    id: 'sysid',
    header: 'SysID',
    enableSorting: false,
    minSize: 100,
    maxSize: 120,
  },
];

export const TableView: React.FC<Props> = ({ devices = [] }) => {
  const router = useRouter();

  const handleNavigate = (device: Device) => {
    router.navigate({
      to: '/device/$deviceId',
      params: { deviceId: device.id },
    });
  };

  return (
    <div>
      <ResizeTable
        data={devices}
        rowStyle={{
          height: ROW_HEIGHT,
          color: 'text-1',
        }}
        onRowClick={handleNavigate}
        columns={getTableColumns()}
        tableHeight={TABLE_HEIGHT}
        virtualize
        stickyHeader
      />
    </div>
  );
};
