import type { SavedChat } from '@/lib/types';

export type NavIconType = 'home' | 'schedule' | 'degree' | 'career';

export interface AppSidebarLink {
  readonly href: string;
  readonly label: string;
  readonly icon: NavIconType;
}

export interface AppSidebarProps {
  readonly brandHref?: string;
  readonly brandLabel?: string;
  readonly links: ReadonlyArray<AppSidebarLink>;
  readonly savedChats: ReadonlyArray<SavedChat>;
  readonly onNewChat?: () => void;
  readonly userDisplayName?: string;
  readonly onUpgradeClick?: () => void;
  readonly className?: string;
}
