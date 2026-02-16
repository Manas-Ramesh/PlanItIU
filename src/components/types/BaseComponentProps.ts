/**
 * Base props for layout and composed components.
 * Single source of truth for id/className; extend and add children or slots where needed.
 */
export interface BaseComponentProps {
  id?: string;
  className?: string;
}
