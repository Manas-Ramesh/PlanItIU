export type FeatureIconGradient =
  | 'teal'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'pink';

export interface FeatureItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly accentGradient: FeatureIconGradient;
  readonly imageSrc?: string;
  readonly imagePlaceholder: string;
}

export interface FeatureGridProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly features: ReadonlyArray<FeatureItem>;
  readonly className?: string;
  readonly id?: string;
  readonly 'aria-labelledby'?: string;
}
