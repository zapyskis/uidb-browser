import { designToken } from '@ubnt/ui-components';
import React from 'react';

interface TagProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ text, style, className }) => {
  return (
    <div
      className={`h-5 bg-white text-xs rounded inline-flex items-center px-1 ${className || ''}`}
      style={{
        color: designToken.motifs.light['desktop-color-ublue-06'],
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export default Tag;
