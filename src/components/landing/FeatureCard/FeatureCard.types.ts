import type { ReactElement } from 'react';
import type { FeatureIconGradient } from '../FeatureGrid/FeatureGrid.types';

export interface FeatureCardProps {
  readonly icon: ReactElement;
  readonly title: string;
  readonly description: string;
  readonly iconGradient?: FeatureIconGradient;
  readonly className?: string;
  readonly id?: string;
  readonly 'aria-labelledby'?: string;
}
