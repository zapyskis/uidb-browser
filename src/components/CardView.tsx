import React from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { Device } from '../types/device';
import DeviceCard from './DeviceCard';

interface Props {
  devices: Device[];
}

const CARD_WIDTH = 216;
const CARD_SPACING = 16;

const CardView: React.FC<Props> = ({ devices }) => {
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const calculateColumns = () => {
      if (gridRef.current) {
        const containerWidth = gridRef.current.clientWidth;
        const calculatedColumns = Math.floor((containerWidth + CARD_SPACING) / (CARD_WIDTH + CARD_SPACING));
        const newColumns = Math.max(1, calculatedColumns);
        gridRef.current.style.setProperty('--num-columns', newColumns.toString());
      }
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

  return (
    <div ref={gridRef} style={{ height: '100%' }}>
      <VirtuosoGrid
        style={{ height: '100%' }}
        totalCount={devices.length}
        overscan={200}
        itemContent={(index) => <DeviceCard device={devices[index]} />}
        listClassName="grid-container"
        itemClassName="grid-item"
      />

      <style>{`
        .grid-container {
          display: grid;
          grid-template-columns: repeat(var(--num-columns), ${CARD_WIDTH}px);
          grid-gap: ${CARD_SPACING}px;
          justify-content: start;
        }

        .grid-item {
          width: ${CARD_WIDTH}px;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default CardView;
