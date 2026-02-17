import type { ReactNode } from 'react';
import type { BaseComponentProps } from '../../types';

export interface FooterLinkGroup {
  readonly title: string;
  readonly links: ReadonlyArray<{
    readonly label: string;
    readonly href: string;
  }>;
}

export interface FooterProps extends BaseComponentProps {
  readonly children: ReactNode;
  readonly linkGroups?: ReadonlyArray<FooterLinkGroup>;
  readonly brandLabel?: string;
  readonly brandDescription?: string;
  readonly 'aria-label'?: string;
}
