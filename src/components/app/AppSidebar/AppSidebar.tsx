'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import type { AppSidebarProps as Props, NavIconType } from './AppSidebar.types';

/* ── SVG Icons ── */

function NavIcon({ type, className }: { readonly type: NavIconType; readonly className?: string }) {
  const c = cn('size-[18px] shrink-0', className);
  switch (type) {
    case 'home':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'schedule':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'degree':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case 'study':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'assignments':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      );
    case 'career':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
  }
}

/* ── Nav link renderer ── */

function NavLink({
  link,
  isActive,
  collapsed,
}: {
  readonly link: { href: string; label: string; icon: NavIconType; accent?: string };
  readonly isActive: boolean;
  readonly collapsed: boolean;
}) {
  const accentVar = link.accent ?? 'var(--color-text-muted)';
  return (
    <Link
      href={link.href}
      className={cn(
        'group relative flex items-center rounded-xl transition-all duration-200',
        collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 h-10',
        isActive
          ? 'bg-[grey]/10 text-[var(--color-text-primary)]'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/40'
      )}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? link.label : undefined}
    >
      {isActive && (
        <span
          className={cn(
            'absolute left-0 w-[3px] rounded-full bg-[var(--color-brand-primary)]',
            'shadow-[0_0_8px_var(--color-brand-glow)]',
            collapsed ? 'h-5 -left-[5px]' : 'h-5 -left-0.5'
          )}
          aria-hidden
        />
      )}
      <span
        className={cn('shrink-0 transition-colors duration-200', isActive ? 'text-[var(--color-brand-primary)]' : '')}
        style={!isActive ? { color: accentVar } : undefined}
      >
        <NavIcon type={link.icon} />
      </span>
      {!collapsed && <span className="text-[13px] font-medium truncate">{link.label}</span>}
    </Link>
  );
}

function MoreNavLinks({
  primaryLinks,
  moreLinks,
  anyMoreActive,
  pathname,
  collapsed,
}: {
  readonly primaryLinks: ReadonlyArray<{ href: string; label: string; icon: NavIconType; accent?: string }>;
  readonly moreLinks: ReadonlyArray<{ href: string; label: string; icon: NavIconType; accent?: string }>;
  readonly anyMoreActive: boolean;
  readonly pathname: string;
  readonly collapsed: boolean;
}) {
  const [moreOpen, setMoreOpen] = useState(anyMoreActive);

  return (
    <ul role="list" className="flex flex-col gap-0.5">
      {primaryLinks.map((link) => (
        <li key={link.href}>
          <NavLink
            link={link}
            isActive={pathname === link.href || pathname.startsWith(link.href + '/')}
            collapsed={collapsed}
          />
        </li>
      ))}

      {moreLinks.length > 0 && (
        <>
          {/* More tools toggle */}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className={cn(
                'group relative flex items-center rounded-xl transition-all duration-200 w-full',
                collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 h-10',
                anyMoreActive
                  ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/40'
              )}
              title={collapsed ? 'More tools' : undefined}
              aria-expanded={moreOpen}
            >
              {/* Active dot when collapsed and a "more" link is active */}
              {anyMoreActive && collapsed && (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[var(--color-brand-primary)]" aria-hidden />
              )}
              {/* Grid icon */}
              <span className={cn('shrink-0', anyMoreActive ? 'text-[var(--color-brand-primary)]' : '')}>
                <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </span>
              {!collapsed && (
                <>
                  <span className="text-[13px] font-medium flex-1 text-left">More tools</span>
                  <svg
                    className={cn('size-3.5 shrink-0 transition-transform duration-200', moreOpen ? 'rotate-180' : '')}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </>
              )}
            </button>
          </li>

          {/* Expanded more links */}
          {moreOpen && moreLinks.map((link) => (
            <li key={link.href} className={collapsed ? '' : 'pl-3'}>
              <NavLink
                link={link}
                isActive={pathname === link.href || pathname.startsWith(link.href + '/')}
                collapsed={collapsed}
              />
            </li>
          ))}
        </>
      )}
    </ul>
  );
}

/* ── Component ── */

export function AppSidebar({
  brandHref = '/',
  brandLabel = 'PlanitUni',
  links,
  savedChats = [],
  onNewChat,
  userDisplayName = '',
  userEmail,
  onUpgradeClick,
  onSettingsClick,
  collapsed: controlledCollapsed,
  onToggleCollapse,
  className,
}: Props) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detect small screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) setMobileOpen(false);
    };
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isMobile) setMobileOpen(false);
  }, [pathname, isMobile]);

  // On mobile: collapsed sliver is always visible; expanded state overlays
  const collapsed = isMobile ? !mobileOpen : (controlledCollapsed ?? internalCollapsed);
  const toggleCollapse = isMobile
    ? () => setMobileOpen((o) => !o)
    : (onToggleCollapse ?? (() => setInternalCollapsed((c) => !c)));

  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  const initials = userDisplayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
    {/* Backdrop overlay when mobile sidebar is expanded */}
    {isMobile && mobileOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={toggleMobile}
        aria-hidden
      />
    )}

    {/* Collapsed sliver — always in document flow on mobile */}
    {isMobile && (
      <div className="shrink-0 w-[68px]" aria-hidden />
    )}

    <aside
      className={cn(
        'shrink-0 flex flex-col h-screen',
        'bg-[var(--color-bg-elevated)] border-r border-[var(--color-border-subtle)]/40',
        'transition-all duration-300 ease-out',
        // Desktop: normal inline flow
        !isMobile && (collapsed ? 'w-[68px]' : 'w-[240px]'),
        !isMobile && 'sticky top-0',
        // Mobile: collapsed sliver is fixed, expands as overlay
        isMobile && 'fixed top-0 left-0 h-screen',
        isMobile && (mobileOpen ? 'w-[240px] z-50 shadow-2xl' : 'w-[68px] z-30'),
        className
      )}
      aria-label="App navigation"
    >
      {/* ── Brand ── */}
      <div className={cn(
        'flex items-center shrink-0 h-16 border-b border-[var(--color-border-subtle)]/30',
        collapsed ? 'justify-center px-0' : 'px-4 gap-3'
      )}>
        <Link
          href={brandHref}
          className="flex items-center gap-2.5 min-w-0"
          aria-label={`${brandLabel} home`}
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden>
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>
          {!collapsed && (
            // wide letter spacing only on brand to avoid truncation issues on nav links
            <span className="font-serif text-lg text-[var(--color-text-primary)]  truncate">
              {brandLabel}
            </span>
          )}
        </Link>
      </div>

      {/* ── Primary nav ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5" aria-label="Primary">
        {(() => {
          const PRIMARY_COUNT = 3;
          const primaryLinks = links.slice(0, PRIMARY_COUNT);
          const moreLinks = links.slice(PRIMARY_COUNT);
          const anyMoreActive = moreLinks.some(
            (l) => pathname === l.href || pathname.startsWith(l.href + '/')
          );
          return (
            <MoreNavLinks
              primaryLinks={primaryLinks}
              moreLinks={moreLinks}
              anyMoreActive={anyMoreActive}
              pathname={pathname}
              collapsed={collapsed}
            />
          );
        })()}

        {/* ── Advisor Chats ── */}
        {!collapsed && savedChats.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)]/20">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/60">
                Recent Chats
              </span>
              {onNewChat && (
                <button
                  type="button"
                  onClick={onNewChat}
                  className="rounded-md p-1 text-[var(--color-text-muted)]/50 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/40 transition-colors"
                  aria-label="New chat"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              )}
            </div>
            <ul role="list" className="flex flex-col gap-0.5">
              {savedChats.slice(0, 5).map((chat) => (
                <li key={chat.id}>
                  <Link
                    href={`/dashboard/chat/${chat.id}`}
                    className="block rounded-lg px-2.5 py-1.5 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]/30 transition-colors truncate"
                  >
                    {chat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* ── Bottom section ── */}
      <div className="shrink-0 flex flex-col gap-1 p-2.5 border-t border-[var(--color-border-subtle)]/30">
        {/* Premium upsell */}
        {!collapsed && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className={cn(
              'flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 mb-1 text-left transition-all duration-200',
              'bg-[var(--color-brand-primary)]/8 border border-[var(--color-brand-primary)]/15',
              'hover:bg-[var(--color-brand-primary)]/12 hover:border-[var(--color-brand-primary)]/25',
              'group'
            )}
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)] shrink-0" aria-hidden>
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[var(--color-text-primary)]">Upgrade to Premium</p>
              <p className="text-[10px] text-[var(--color-text-muted)]/60">Unlock all features</p>
            </div>
          </button>
        )}

        {/* Settings */}
        <button
          type="button"
          onClick={onSettingsClick}
          className={cn(
            'flex items-center rounded-xl transition-all duration-200',
            'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/40',
            collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 h-10'
          )}
          title={collapsed ? 'Settings' : undefined}
          aria-label="Settings"
        >
          <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          {!collapsed && <span className="text-[13px] font-medium">Settings</span>}
        </button>

        {/* Collapse / Expand toggle */}
        <button
          type="button"
          onClick={toggleCollapse}
          className={cn(
            'flex items-center rounded-xl transition-all duration-200',
            'text-[var(--color-text-muted)]/50 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/40',
            collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 h-10'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={cn('size-[18px] shrink-0 transition-transform duration-300', collapsed && 'rotate-180')}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden
          >
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
          {!collapsed && <span className="text-[13px] font-medium">Collapse</span>}
        </button>

        {/* User profile */}
        <div className={cn(
          'flex items-center rounded-xl mt-1 pt-2 border-t border-[var(--color-border-subtle)]/20',
          collapsed ? 'justify-center' : 'gap-2.5 px-2'
        )}>
          <div
            className={cn(
              'flex items-center justify-center rounded-lg shrink-0',
              'bg-[var(--color-brand-primary)]/12 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20',
              collapsed ? 'size-9' : 'size-8'
            )}
            aria-hidden
          >
            <span className="text-[11px] font-bold leading-none">{initials || 'U'}</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[var(--color-text-primary)] truncate">
                {userDisplayName || 'User'}
              </p>
              {userEmail && (
                <p className="text-[10px] text-[var(--color-text-muted)]/50 truncate">{userEmail}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}
