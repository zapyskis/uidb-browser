import React from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { Device } from '../types/device';
import { DeviceCard } from './DeviceCard';

const CONSTANTS = {
  CARD_WIDTH: 216,
  CARD_SPACING: 16,
  CONTAINER_PADDING: 20,
  HEADER_HEIGHT: 150,
};

const STYLES = {
  container: {
    height: `calc(100vh - ${CONSTANTS.HEADER_HEIGHT}px)`,
  },
  virtuoso: {
    height: '100%',
  },
  gridStyles: `
    .grid-container {
      display: grid;
      grid-template-columns: repeat(var(--num-columns), ${CONSTANTS.CARD_WIDTH}px);
      grid-gap: ${CONSTANTS.CARD_SPACING}px;
      justify-content: start;
    }

    .grid-item {
      width: ${CONSTANTS.CARD_WIDTH}px;
      height: 100%;
    }
  `,
} as const;

interface Props {
  devices: Device[];
}

const useGridColumns = () => {
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const calculateColumns = () => {
      if (!gridRef.current) return;

      const containerWidth = gridRef.current.clientWidth - CONSTANTS.CONTAINER_PADDING;
      const calculatedColumns = Math.floor(
        (containerWidth + CONSTANTS.CARD_SPACING) / (CONSTANTS.CARD_WIDTH + CONSTANTS.CARD_SPACING),
      );
      const newColumns = Math.max(1, calculatedColumns);
      gridRef.current.style.setProperty('--num-columns', newColumns.toString());
    };

    calculateColumns();

    const resizeObserver = new ResizeObserver(calculateColumns);
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        resizeObserver.unobserve(gridRef.current);
      }
    };
  }, []);

  return gridRef;
};

export const CardView: React.FC<Props> = ({ devices }) => {
  const gridRef = useGridColumns();

  return (
    <div ref={gridRef} style={STYLES.container}>
      <VirtuosoGrid
        style={STYLES.virtuoso}
        totalCount={devices.length}
        overscan={50}
        itemContent={(index) => <DeviceCard device={devices[index]} />}
        listClassName="grid-container"
        itemClassName="grid-item"
      />
      <style>{STYLES.gridStyles}</style>
    </div>
  );
};
