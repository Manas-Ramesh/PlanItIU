/**
 * Accessibility props for ARIA attributes.
 * Components that support aria can extend this and pass through to the DOM.
 */
export interface AriaProps {
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'listbox' | 'dialog' | boolean;
  'aria-controls'?: string;
  'aria-describedby'?: string;
  'aria-busy'?: boolean;
}
