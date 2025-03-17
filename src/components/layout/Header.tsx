import React from 'react';
import { UbiquitiLogo } from '@ubnt/icons';
import { Text } from '@ubnt/ui-components/aria';

const STYLES = {
  header: 'relative w-full h-[50px] flex flex-row bg-u-neutral-02',
  container: 'w-full h-full flex justify-between items-center',
  logoContainer: 'w-[50px] h-full items-center justify-center flex',
  titleContainer: 'ml-2',
  authorContainer: 'flex-1 text-right mr-8',
};

interface Props {
  title?: string;
  author?: string;
}

export const Header: React.FC<Props> = ({ title = 'Devices', author = 'Author/Mindaugas Zemaitis' }) => {
  return (
    <header className={STYLES.header}>
      <div className={STYLES.container}>
        <div className={STYLES.logoContainer}>
          <UbiquitiLogo variant="neutral" size={40} />
        </div>
        <div className={STYLES.titleContainer}>
          <Text variant="body-secondary">{title}</Text>
        </div>
        <div className={STYLES.authorContainer}>
          <Text variant="body-secondary">{author}</Text>
        </div>
      </div>
    </header>
  );
};
