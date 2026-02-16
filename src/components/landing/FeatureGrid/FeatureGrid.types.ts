import type { ReactElement } from 'react';

export type FeatureIconGradient =
  | 'teal'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'pink';

export interface FeatureItem {
  readonly id: string;
  readonly icon: ReactElement;
  readonly title: string;
  readonly description: string;
  readonly iconGradient?: FeatureIconGradient;
}

export interface FeatureGridProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly features: ReadonlyArray<FeatureItem>;
  readonly className?: string;
  readonly id?: string;
  readonly 'aria-labelledby'?: string;
}
