'use client';

import { forwardRef } from 'react';
import { cn } from '../../../lib/utils/cn';
import type {
  ButtonProps as Props,
  ButtonSize,
  ButtonVariant,
} from './Button.types';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] border-0 hover:bg-[var(--color-brand-strong)] focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)] transition',
  secondary:
    'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-surface)] focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)] transition',
  ghost:
    'bg-transparent text-[var(--color-text-primary)] border-0 hover:bg-[var(--color-bg-surface)] focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)] transition',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm py-1.5 px-3 gap-1.5',
  md: 'text-base py-2 px-4 gap-2',
  lg: 'text-lg py-2.5 px-5 gap-2',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      'aria-label': ariaLabel,
      'aria-busy': ariaBusy,
      ...rest
    },
    ref
  ) {
    const isAnchor = rest.as === 'a';
    const isDisabled = !isAnchor && (rest.disabled ?? isLoading);
    const classNames = cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition-opacity',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      isDisabled && 'opacity-60 cursor-not-allowed',
      className
    );

    const content = (
      <>
        {isLoading ? (
          <span
            className="inline-block size-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
        ) : (
          leftIcon ? (
            <span className="shrink-0 [&>svg]:size-[1em]" aria-hidden>
              {leftIcon}
            </span>
          ) : null
        )}
        <span className={cn(isLoading && leftIcon ? 'sr-only' : null)}>
          {children}
        </span>
        {!isLoading && rightIcon ? (
          <span className="shrink-0 [&>svg]:size-[1em]" aria-hidden>
            {rightIcon}
          </span>
        ) : null}
      </>
    );

    if (isAnchor) {
      const { as, href, ...anchorRest } = rest;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classNames}
          aria-label={ariaLabel}
          aria-busy={isLoading ? true : ariaBusy}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    const { as: _as, type, disabled, ...buttonRest } = rest;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? 'button'}
        disabled={isDisabled}
        className={classNames}
        aria-label={ariaLabel}
        aria-busy={isLoading ? true : ariaBusy}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);
