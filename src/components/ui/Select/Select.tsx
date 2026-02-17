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

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <label
        htmlFor={id}
        className={cn(
          'block text-sm font-medium text-text-secondary mb-1',
          hideLabel && 'sr-only',
          !hideLabel && disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        {label}
        {required && (
          <span className="text-danger ml-0.5" aria-hidden>
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
          'w-full flex items-center justify-between gap-2 rounded-lg border text-left transition',
          'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
          variant === 'landing'
            ? 'min-h-12 py-3 px-4 rounded-xl bg-bg-light border-border-light text-text-dark placeholder:text-text-dark-muted hover:border-border-light-hover focus:ring-offset-0'
            : 'min-h-10 py-2 px-3 border-border-subtle bg-surface text-text-primary focus:ring-offset-background hover:border-border-strong',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span
          className={cn(
            variant === 'landing'
              ? !selectedOption && 'text-text-dark-muted'
              : !selectedOption && 'text-text-muted'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={cn(
            'shrink-0 transition-transform',
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
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-border-subtle bg-elevated py-1 shadow-card"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={cn(
                'cursor-pointer py-2 px-3 text-text-primary',
                option.value === value && 'bg-surface',
                option.disabled && 'opacity-50 cursor-not-allowed',
                focusedIndex === index && 'bg-surface',
                !option.disabled && 'hover:bg-surface'
              )}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
