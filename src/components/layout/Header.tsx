import React from 'react';
import { UbntLogo } from '@ubnt/icons';
import { designToken } from '@ubnt/ui-components';
import { Text } from '@ubnt/ui-components/aria';

const Header: React.FC = () => {
  return (
    <header
      className="relative w-full h-[50px] flex flex-row"
      style={{ backgroundColor: designToken.motifs.light['desktop-color-neutral-02'] }}
    >
      <div className="w-full h-full flex justify-between items-center">
        <div className="w-[50px] h-full items-center justify-center flex">
          <UbntLogo variant="neutral" size={34} />
        </div>
        <div className="">
          <Text variant="body-secondary">Devices</Text>
        </div>
        <div className="flex-1 text-right mr-5">
          <Text variant="body-secondary">Author/Mindaugas Zemaitis</Text>
        </div>
      </div>
    </header>
  );
};

export default Header;
