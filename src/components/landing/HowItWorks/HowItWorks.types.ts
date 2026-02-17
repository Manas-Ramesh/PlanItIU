import type { ReactElement } from 'react';

export interface StepItem {
  readonly number: number;
  readonly title: string;
  readonly description: string;
  readonly icon: ReactElement;
}

export interface HowItWorksProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly steps: ReadonlyArray<StepItem>;
  readonly className?: string;
  readonly id?: string;
}
