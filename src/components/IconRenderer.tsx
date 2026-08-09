import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  className = '',
  size = 24,
  color,
}) => {
  // @ts-ignore
  const LucideIcon = Icons[name] || Icons.Sparkles;

  return (
    <LucideIcon
      size={size}
      className={className}
      style={color ? { color } : undefined}
    />
  );
};
