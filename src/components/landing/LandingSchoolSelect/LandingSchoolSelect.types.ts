import type { SelectOption } from '@/components/ui/Select';

export interface LandingSchoolSelectProps {
  readonly options: ReadonlyArray<SelectOption>;
  readonly selectId?: string;
  readonly label: string;
  readonly placeholder: string;
}
