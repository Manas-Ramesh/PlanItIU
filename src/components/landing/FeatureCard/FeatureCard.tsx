'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { FeatureCardProps as Props } from './FeatureCard.types';
import type { FeatureIconGradient } from '../FeatureGrid/FeatureGrid.types';

const ICON_GRADIENT_CLASSES: Record<
  FeatureIconGradient,
  readonly [string, string]
> = {
  teal: ['from-feature-teal', 'to-feature-cyan'],
  blue: ['from-feature-blue', 'to-feature-cyan'],
  green: ['from-feature-green', 'to-feature-emerald'],
  purple: ['from-feature-purple', 'to-feature-indigo'],
  orange: ['from-feature-orange', 'to-feature-amber'],
  pink: ['from-feature-pink', 'to-feature-rose'],
} as const;

function getIconWrapperClasses(gradient?: FeatureIconGradient): string {
  if (!gradient) {
    return 'text-brand mb-4';
  }
  const [from, to] = ICON_GRADIENT_CLASSES[gradient];
  return cn(
    'w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br',
    from,
    to
  );
}

export function FeatureCard({
  icon,
  title,
  description,
  iconGradient,
  className,
  id: idProp,
  'aria-labelledby': ariaLabelledBy,
}: Props) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const titleId = `${id}-title`;

  return (
    <Card
      variant="feature"
      as="article"
      padding="none"
      id={id}
      className={className}
      aria-labelledby={ariaLabelledBy ?? titleId}
    >
      <div className={getIconWrapperClasses(iconGradient)}>
        <Icon size="lg" className={iconGradient ? 'text-text-on-brand' : undefined}>
          {icon}
        </Icon>
      </div>
      <h3 id={titleId} className="text-lg font-bold text-text-on-brand mb-2">
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </Card>
  );
}
