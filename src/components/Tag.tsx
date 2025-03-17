import { designToken } from '@ubnt/ui-components';
import React from 'react';

const STYLES = {
  tag: 'h-5 bg-white text-xs rounded inline-flex items-center px-1',
};

interface Props {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Tag: React.FC<Props> = ({ text, style, className }) => {
  return (
    <div
      className={`${STYLES.tag} ${className || ''}`}
      style={{
        color: designToken.motifs.light['desktop-color-ublue-06'],
        ...style,
      }}
    >
      {text}
    </div>
  );
};
