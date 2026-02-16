import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import type { AriaProps } from '../../../lib/types';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonBase = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
} & AriaProps;

export type ButtonAsButton = ButtonBase & {
  as?: 'button';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;

export type ButtonAsAnchor = ButtonBase & {
  as: 'a';
  href: string;
} & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'className' | 'href'
  >;

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;
