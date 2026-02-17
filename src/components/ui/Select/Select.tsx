'use client';

import { useId, useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import type { SelectProps as Props, SelectOption } from './Select.types';

const listboxId = (id: string): string => `${id}-listbox`;

export function Select({
  id,
  label,
  placeholder = 'Select…',
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  variant = 'default',
  hideLabel = false,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: Props) {
  const listboxIdRef = listboxId(id);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const selectedOption = options.find((o) => o.value === value);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      if (!isControlled) setUncontrolledValue(option.value);
      onChange?.(option.value, option);
      close();
    },
    [isControlled, onChange, close]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0 && options[focusedIndex]) {
          handleSelect(options[focusedIndex]);
        } else {
          setIsOpen((prev) => !prev);
          setFocusedIndex(0);
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((i) => (i < options.length - 1 ? i + 1 : i));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((i) => (i > 0 ? i - 1 : 0));
        }
        break;
      default:
        break;
    }
  };

  const isLanding = variant === 'landing';

  return (
    <div
      ref={containerRef}
      className={cn('relative', isOpen ? 'z-50' : 'z-0', className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <label
        htmlFor={id}
        className={cn(
          'block text-sm font-medium text-[var(--color-text-secondary)] mb-1',
          hideLabel && 'sr-only',
          !hideLabel && disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        {label}
        {required && (
          <span className="text-[var(--color-danger)] ml-0.5" aria-hidden>
            *
          </span>
        )}
      </label>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxIdRef}
        aria-label={ariaLabel ?? label}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        aria-disabled={disabled}
        disabled={disabled}
        aria-activedescendant={
          isOpen && focusedIndex >= 0 && options[focusedIndex]
            ? `${id}-option-${focusedIndex}`
            : undefined
        }
        className={cn(
          'w-full flex items-center justify-between gap-2 text-left transition',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/30 disabled:opacity-60 disabled:cursor-not-allowed',
          isLanding
            ? 'min-h-12 py-3 px-4 rounded-xl bg-[var(--color-bg-light)] border border-[var(--color-border-light)] text-[var(--color-text-dark)] placeholder:text-[var(--color-text-dark-muted)] hover:border-[var(--color-border-light-hover)] focus:ring-offset-0'
            : cn(
                'min-h-10 py-3 px-4 rounded-xl text-sm text-[var(--color-text-primary)]',
                'border border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-surface)]',
                'hover:border-[var(--color-border-subtle)]/60 focus:border-[var(--color-brand-primary)]/40 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)]'
              ),
          disabled && 'opacity-60 cursor-not-allowed'
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span
          className={cn(
            'truncate',
            isLanding
              ? !selectedOption && 'text-[var(--color-text-dark-muted)]'
              : !selectedOption && 'text-[var(--color-text-muted)]/50'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={cn(
            'shrink-0 transition-transform duration-200 text-[var(--color-text-muted)]',
            isOpen && 'rotate-180'
          )}
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxIdRef}
          role="listbox"
          aria-label={ariaLabel ?? label}
          className={cn(
            'absolute z-50 mt-2 w-full max-h-60 overflow-auto py-1.5',
            'rounded-xl border border-[var(--color-border-subtle)]/40',
            'bg-[var(--color-bg-elevated)] shadow-[0_8px_32px_var(--color-overlay)]'
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={cn(
                'cursor-pointer py-2.5 px-4 text-sm transition-colors duration-100',
                option.value === value
                  ? 'text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10'
                  : 'text-[var(--color-text-primary)]',
                option.disabled && 'opacity-50 cursor-not-allowed',
                focusedIndex === index && option.value !== value && 'bg-[var(--color-bg-surface)]',
                !option.disabled && option.value !== value && 'hover:bg-[var(--color-bg-surface)]'
              )}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              <span className="flex items-center justify-between">
                {option.label}
                {option.value === value && (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
