import type { ReactNode } from 'react';
import type { BaseComponentProps } from '../../types';

export interface FooterProps extends BaseComponentProps {
  readonly children: ReactNode;
  readonly 'aria-label'?: string;
}
