import type { BaseComponentProps } from '../../types';

export interface HeroSectionProps extends BaseComponentProps {
  readonly headline: string;
  readonly highlight?: string;
  readonly subtitle: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly 'aria-labelledby'?: string;
}
