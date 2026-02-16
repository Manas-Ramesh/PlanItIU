import type { HTMLAttributes } from 'react';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  readonly value: number;
  readonly max?: number;
  readonly className?: string;
}
