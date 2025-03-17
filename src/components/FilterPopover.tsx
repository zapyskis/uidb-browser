import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import Popover, { RenderToggleProps } from '@ubnt/ui-components/Popover/Popover';
import { Checkbox_Default } from '@ubnt/ui-components/aria/experimental';
import { Heading } from '@ubnt/ui-components/aria';
import Button from '@ubnt/ui-components/Button/Button';

const STYLES = {
  container: '!w-[134px]',
  heading: '!mb-4',
  checkboxContainer: 'mb-2',
  resetButton: 'w-full mt-3',
  popoverCard: '!p-4 max-h-[calc(100vh-120px)]',
};

interface FilterItem {
  id: string;
  name: string;
}

interface Props {
  onSelectionChange: (selectedItems: string[]) => void;
  items: FilterItem[];
  selectedItems?: string[];
  renderToggle?: (open?: boolean) => ReactNode;
}

interface CheckboxItemProps {
  item: FilterItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ item, isSelected, onSelect }) => (
  <div className={STYLES.checkboxContainer}>
    <Checkbox_Default label={item.name} onChange={() => onSelect(item.id)} isSelected={isSelected} />
  </div>
);

const ResetButton: React.FC<{ disabled: boolean; onClick: () => void }> = ({ disabled, onClick }) => (
  <Button
    style={{ fontSize: '14px' }}
    disabled={disabled}
    color="danger"
    variant="inline"
    className={STYLES.resetButton}
    onClick={onClick}
  >
    Reset
  </Button>
);

export const FilterPopover: React.FC<Props> = ({ items, onSelectionChange, selectedItems = [], renderToggle }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedItems));

  useEffect(() => {
    setSelected(new Set(selectedItems));
  }, [selectedItems]);

  const handleCheckboxChange = useCallback(
    (itemId: string) => {
      const newSelected = new Set(selected);
      if (selected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      setSelected(newSelected);
      onSelectionChange(Array.from(newSelected));
    },
    [selected, onSelectionChange],
  );

  const handleReset = useCallback(() => {
    onSelectionChange([]);
  }, [onSelectionChange]);

  const internalRenderToggle = useCallback(
    (props: RenderToggleProps): ReactNode => {
      if (!renderToggle) return undefined;
      return renderToggle(props.open ?? false);
    },
    [renderToggle],
  );

  return (
    <Popover
      viewport={false}
      size="auto"
      classNameCard={STYLES.popoverCard}
      align="bottomLeft"
      toggleOffset={0}
      rootSelector="#root"
      renderToggle={internalRenderToggle}
    >
      <div className={STYLES.container}>
        <Heading variant="medium" className={STYLES.heading}>
          Product Line
        </Heading>
        {items.map((item) => (
          <CheckboxItem key={item.id} item={item} isSelected={selected.has(item.id)} onSelect={handleCheckboxChange} />
        ))}
        <ResetButton disabled={selected.size === 0} onClick={handleReset} />
      </div>
    </Popover>
  );
};
