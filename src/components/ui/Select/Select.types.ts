import type { HTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectVariant = 'default' | 'landing';

export interface SelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  id: string;
  label: string;
  placeholder?: string;
  options: ReadonlyArray<SelectOption>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: SelectOption) => void;
  disabled?: boolean;
  required?: boolean;
  variant?: SelectVariant;
  hideLabel?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
