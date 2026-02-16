import type { UserProfile } from '@/lib/types';

export interface UserProfileModalProps {
  readonly profile: UserProfile | null;
  readonly onClose: () => void;
}
