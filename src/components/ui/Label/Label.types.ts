import type { LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  readonly children: React.ReactNode;
  readonly htmlFor: string;
  readonly className?: string;
}
