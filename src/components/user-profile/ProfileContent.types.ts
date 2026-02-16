import type { UserProfile } from '@/lib/types';

export interface ProfileContentProps {
  readonly profile: UserProfile | null;
  readonly onClose?: () => void;
  readonly showCloseButton?: boolean;
}
