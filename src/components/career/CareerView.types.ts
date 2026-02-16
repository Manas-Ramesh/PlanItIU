import type { JobPosting, NetworkContact, UserProfile } from '@/lib/types';

export interface CareerViewProps {
  readonly jobs: ReadonlyArray<JobPosting>;
  readonly contacts: ReadonlyArray<NetworkContact>;
  readonly userProfile: UserProfile | null;
  readonly onContactSelect?: (contact: NetworkContact) => void;
  readonly onJobSelect?: (job: JobPosting) => void;
}
