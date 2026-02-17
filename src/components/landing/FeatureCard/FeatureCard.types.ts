import type { FeatureIconGradient } from '../FeatureGrid/FeatureGrid.types';

export interface FeatureCardProps {
  readonly title: string;
  readonly description: string;
  readonly accentGradient: FeatureIconGradient;
  readonly imageSrc?: string;
  readonly imagePlaceholder: string;
  readonly className?: string;
  readonly id?: string;
  readonly 'aria-labelledby'?: string;
}
