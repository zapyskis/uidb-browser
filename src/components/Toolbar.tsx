import React, { ReactNode } from 'react';
import { Search } from './Search';
import { ListViewIcon, GridViewIcon } from '@ubnt/icons';
import { FilterPopover } from './FilterPopover';
import { useDevices } from '../hooks/useDevices';
import { Text } from '@ubnt/ui-components/aria';

type ViewMode = 'table' | 'card';

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const STYLES = {
  button: 'h-8 rounded flex items-center justify-center hover:bg-u-neutral-02 cursor-pointer',
  iconButton: 'w-8 h-8 rounded flex items-center justify-center hover:bg-u-neutral-02 cursor-pointer',
  activeButton: 'bg-u-neutral-01',
  filterIndicator: 'w-[6px] h-[6px] bg-[#006fff] rounded-full absolute top-[3px] right-[3px]',
  toolbar: 'w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0',
  searchContainer: 'flex w-full sm:w-auto sm:max-w-md',
  controlsContainer: 'flex items-center space-x-2 w-full sm:w-auto sm:justify-end mt-2 sm:mt-0',
};

const ViewModeButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactElement;
}> = ({ isActive, onClick, icon }) => (
  <button className={`${STYLES.iconButton} ${isActive ? STYLES.activeButton : ''}`} type="button" onClick={onClick}>
    {React.cloneElement(icon, {
      size: 'original',
      color: isActive ? '#0066FF' : '#838691',
    })}
  </button>
);

const FilterButton: React.FC<{ open?: boolean; hasFilters: boolean }> = ({ open, hasFilters }) => (
  <button className={`${STYLES.button} px-[6px] ml-[6px] relative ${open ? STYLES.activeButton : ''}`} type="button">
    {hasFilters && <div className={STYLES.filterIndicator} />}
    <Text size="medium" color={open ? 'ublue-06' : 'text-3'}>
      Filter
    </Text>
  </button>
);

export const Toolbar: React.FC<ToolbarProps> = ({ viewMode, onViewModeChange }) => {
  const { productLines, selectedProductLines, setSelectedProductLines, setSearchTerm } = useDevices();

  const renderFilterToggle = (open?: boolean): ReactNode => (
    <FilterButton open={open} hasFilters={selectedProductLines.length > 0} />
  );

  return (
    <div className={STYLES.toolbar} role="toolbar">
      <div className={STYLES.searchContainer}>
        <Search onSearch={setSearchTerm} />
      </div>

      <div className={STYLES.controlsContainer}>
        <ViewModeButton
          isActive={viewMode === 'table'}
          onClick={() => onViewModeChange('table')}
          icon={<ListViewIcon />}
        />
        <ViewModeButton
          isActive={viewMode === 'card'}
          onClick={() => onViewModeChange('card')}
          icon={<GridViewIcon />}
        />

        <FilterPopover
          items={productLines}
          selectedItems={selectedProductLines}
          onSelectionChange={setSelectedProductLines}
          renderToggle={renderFilterToggle}
        />
      </div>
    </div>
  );
};
