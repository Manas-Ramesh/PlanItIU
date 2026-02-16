import type { OptionItem } from '@/lib/types';

/**
 * When options are empty (e.g. not yet loaded from backend), return a single sample
 * option so the dropdown can be used and form validation can pass.
 * Use for any required Select that may receive an empty options array.
 */
export function getOptionsWithSample(
  options: ReadonlyArray<OptionItem>,
  sample: OptionItem
): ReadonlyArray<OptionItem> {
  return options.length > 0 ? options : [sample];
}
