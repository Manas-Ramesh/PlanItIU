import type { ReactElement } from 'react';
import type { BaseComponentProps } from '../../types';

export interface HeroSectionProps extends BaseComponentProps {
  readonly headline: string;
  readonly highlight?: string;
  readonly subtitle: string;
  readonly ctaSlot: ReactElement;
  readonly 'aria-labelledby'?: string;
}
