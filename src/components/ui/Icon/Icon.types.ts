import type { ReactNode } from 'react';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  children: ReactNode;
  size?: IconSize;
  'aria-hidden'?: boolean;
  className?: string;
}
