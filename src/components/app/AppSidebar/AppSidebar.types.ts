import type { SavedChat } from '@/lib/types';

export type NavIconType =
  | 'home'
  | 'schedule'
  | 'degree'
  | 'study'
  | 'assignments'
  | 'career';

export interface AppSidebarLink {
  readonly href: string;
  readonly label: string;
  readonly icon: NavIconType;
  /** Feature accent color CSS variable, e.g. 'var(--color-feature-blue)'. */
  readonly accent?: string;
}

export interface AppSidebarProps {
  readonly brandHref?: string;
  readonly brandLabel?: string;
  readonly links: ReadonlyArray<AppSidebarLink>;
  readonly savedChats?: ReadonlyArray<SavedChat>;
  readonly onNewChat?: () => void;
  readonly userDisplayName?: string;
  readonly userEmail?: string;
  readonly onUpgradeClick?: () => void;
  readonly onSettingsClick?: () => void;
  readonly collapsed?: boolean;
  readonly onToggleCollapse?: () => void;
  readonly className?: string;
}
