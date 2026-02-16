export interface NavLinkItem {
  readonly href: string;
  readonly label: string;
}

type NavBarCtaLink = {
  readonly ctaHref: string;
  readonly onCtaClick?: never;
};

type NavBarCtaButton = {
  readonly onCtaClick: () => void;
  readonly ctaHref?: never;
};

export type NavBarCta = NavBarCtaLink | NavBarCtaButton;

export interface NavBarPropsBase {
  readonly brandLabel: string;
  readonly brandHighlight?: string;
  readonly navLinks: ReadonlyArray<NavLinkItem>;
  readonly ctaLabel: string;
  readonly className?: string;
  readonly 'aria-label'?: string;
}

export type NavBarProps = NavBarPropsBase & NavBarCta;
