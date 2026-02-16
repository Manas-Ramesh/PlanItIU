'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import type { AppSidebarProps as Props, AppSidebarLink, NavIconType } from './AppSidebar.types';

function LogoIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function NavIcon({ type, className }: { readonly type: NavIconType; readonly className?: string }) {
  const c = cn('size-5 shrink-0', className);
  if (type === 'home') {
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (type === 'schedule') {
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }
  if (type === 'degree') {
    return (
      <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    );
  }
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function StarIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" />
    </svg>
  );
}

function PlusIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CrownIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function PersonIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function AppSidebar({
  brandHref = '/',
  brandLabel = 'Planituni',
  links,
  savedChats,
  onNewChat,
  userDisplayName = '',
  onUpgradeClick,
  className,
}: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'w-56 shrink-0 flex flex-col border-r border-border-subtle bg-surface',
        className
      )}
      aria-label="App navigation"
    >
      <div className="flex items-center gap-2 p-4 border-b border-border-subtle">
        <Link
          href={brandHref}
          className="flex items-center gap-2 min-w-0"
          aria-label={`${brandLabel} home`}
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-white bg-nav-active"
            aria-hidden
          >
            <LogoIcon className="size-5" />
          </span>
          <span className="truncate text-lg font-semibold text-text-primary">{brandLabel}</span>
        </Link>
        <button
          type="button"
          className="shrink-0 rounded p-1 text-text-muted hover:text-text-secondary"
          aria-label="Collapse sidebar"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Primary">
        <ul role="list" className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-nav-active text-white'
                      : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.icon === 'home' ? (
                    <StarIcon className="size-5 shrink-0" />
                  ) : (
                    <NavIcon type={link.icon} className="shrink-0" />
                  )}
                  <span className="truncate">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 pt-4 border-t border-border-subtle">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              ADVISOR CHATS
            </span>
            {onNewChat ? (
              <button
                type="button"
                onClick={onNewChat}
                className="rounded p-1 text-text-muted hover:bg-elevated hover:text-text-primary"
                aria-label="New chat"
              >
                <PlusIcon className="size-4" />
              </button>
            ) : null}
          </div>
          <ul className="space-y-0.5" role="list">
            {savedChats.length === 0 ? (
              <li className="px-2 py-2 text-xs text-text-muted">No chats yet</li>
            ) : (
              savedChats.map((chat) => (
                <li key={chat.id}>
                  <Link
                    href="/dashboard"
                    className="flex flex-col rounded-lg px-2 py-2 text-sm text-text-secondary hover:bg-elevated hover:text-text-primary"
                  >
                    <span className="truncate">{chat.title}</span>
                    <span className="text-xs text-text-muted">{chat.timestamp}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mt-4 rounded-lg border border-border-subtle bg-elevated p-3">
          <div className="flex items-center gap-2">
            <CrownIcon className="size-5 shrink-0 text-nav-active" />
            <span className="text-sm font-medium text-text-primary">Upgrade to Premium</span>
          </div>
          <p className="mt-1 text-xs text-text-muted">Unlock all features</p>
          {onUpgradeClick ? (
            <button
              type="button"
              onClick={onUpgradeClick}
              className="mt-3 w-full rounded-lg bg-nav-active py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Purchase Premium
            </button>
          ) : (
            <span className="mt-3 block w-full rounded-lg bg-nav-active py-2 text-center text-sm font-medium text-white">
              Purchase Premium
            </span>
          )}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border-subtle p-3">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-text-primary hover:bg-elevated"
          aria-label="Profile menu"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-nav-active text-white"
            aria-hidden
          >
            <PersonIcon className="size-4" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {userDisplayName || 'Profile'}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 text-text-muted" />
        </button>
      </div>
    </aside>
  );
}
