import React from 'react';
import { Button } from '@ubnt/ui-components';
import { ArrowLeftPrimaryIconL, ArrowRightPrimaryIconL } from '@ubnt/icons';
import { Link } from '@tanstack/react-router';

const STYLES = {
  container: 'w-full flex items-center justify-between',
  backContainer: 'flex max-w-md',
  navigationContainer: 'flex items-center space-x-1 ml-4',
  button: '!text-sm !text-u-text-3 !h-[28px] drop-shadow-xl !rounded !bg-white hover:bg-u-neutral-02 cursor-pointer',
  backButton: '!pl-2 !pr-1',
  navButton: '!w-[28px]',
};

const NavigationButton: React.FC<{
  direction: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  label: string;
}> = ({ direction, onClick, disabled }) => (
  <Button
    Icon={direction === 'left' ? <ArrowLeftPrimaryIconL /> : <ArrowRightPrimaryIconL />}
    iconSize="medium"
    variant="inline"
    className={`${STYLES.button} ${STYLES.navButton}`}
    onClick={onClick}
    disabled={disabled}
  />
);

const BackButton: React.FC = () => (
  <Link to="/">
    <Button
      Icon={<ArrowLeftPrimaryIconL />}
      iconSize="medium"
      variant="inline"
      className={`${STYLES.button} ${STYLES.backButton}`}
    >
      Back
    </Button>
  </Link>
);

interface Props {
  onPrevious?: () => void;
  onNext?: () => void;
}

export const ToolbarDetails: React.FC<Props> = ({ onPrevious, onNext }) => {
  return (
    <div className={STYLES.container} role="toolbar">
      <div className={STYLES.backContainer}>
        <BackButton />
      </div>

      <div className={STYLES.navigationContainer}>
        <NavigationButton direction="left" onClick={onPrevious} disabled={!onPrevious} label="View previous item" />
        <NavigationButton direction="right" onClick={onNext} disabled={!onNext} label="View next item" />
      </div>
    </div>
  );
};
