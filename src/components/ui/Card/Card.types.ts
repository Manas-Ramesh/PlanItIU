import type { BaseComponentProps } from '../../types';

export type CardVariant = 'default' | 'feature';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends BaseComponentProps {
  variant?: CardVariant;
  as?: 'div' | 'article' | 'section';
  padding?: CardPadding;
  children?: React.ReactNode;
}
