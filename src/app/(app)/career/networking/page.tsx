'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  SAMPLE_CONTACTS,
  SAMPLE_OUTREACH_METRICS,
  SAMPLE_FIRM_OUTREACH,
} from '@/lib/data/sampleData';
import { cn } from '@/lib/utils/cn';

// ─── Sub-tab nav ───────────────────────────────────────────────────────────────

const SUBTABS = [
  {
    id: 'swipe',
    label: 'Swipe Contacts',
    icon: (
      <svg className="size-[13px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    id: 'network',
    label: 'My Network',
    icon: (
      <svg className="size-[13px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Outreach Analytics',
    icon: (
      <svg className="size-[13px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// Deterministic hue from name so avatar colors are stable
const AVATAR_COLORS = [
  'bg-[var(--color-brand-primary)]/80',
  'bg-[var(--color-feature-teal)]/80',
  'bg-[var(--color-feature-purple)]/80',
  'bg-[var(--color-feature-indigo)]/80',
  'bg-[var(--color-feature-green)]/80',
  'bg-[var(--color-feature-cyan)]/80',
];
function avatarColor(id: string) {
  const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ─── Page ──────────────────────────────────────────────────────────────────────

function CareerNetworkingPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = (searchParams.get('tab') as 'swipe' | 'network' | 'analytics') || 'swipe';

  return (
    <div className="flex h-full min-h-0">
      {/* Left sub-tab nav */}
      <aside className="w-[180px] shrink-0 border-r border-[var(--color-border-subtle)]/40 flex flex-col overflow-y-auto">
        <div className="px-3 pt-4 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Tools</p>
        </div>
        <nav className="flex-1 px-2 pb-4 space-y-0.5">
          {SUBTABS.map((t) => (
            <button
              key={t.id}
              onClick={() => router.push(`?tab=${t.id}`, { scroll: false })}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-all',
                tab === t.id
                  ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]/60 hover:text-[var(--color-text-secondary)]'
              )}
            >
              <span className={tab === t.id ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-muted)]'}>
                {t.icon}
              </span>
              <span className="text-[12px] font-semibold truncate">{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {tab === 'swipe' && <SwipeContactsTab />}
        {tab === 'network' && <div className="flex-1 overflow-y-auto p-6"><MyNetworkTab /></div>}
        {tab === 'analytics' && <div className="flex-1 overflow-y-auto p-6"><OutreachAnalyticsTab /></div>}
      </div>
    </div>
  );
}

// ─── Swipe Contacts ────────────────────────────────────────────────────────────

function SwipeContactsTab() {
  const [selectedId, setSelectedId] = useState(SAMPLE_CONTACTS[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'iu' | 'other'>('all');
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [passed, setPassed] = useState<Set<string>>(new Set());

  const visible = SAMPLE_CONTACTS.filter((c) => {
    const matchSearch = search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'iu' && c.sector === 'Indiana University') ||
      (filter === 'other' && c.sector !== 'Indiana University');
    return matchSearch && matchFilter && !passed.has(c.id);
  });

  const selected = visible.find((c) => c.id === selectedId) ?? visible[0] ?? null;

  const handleConnect = (id: string) => {
    setConnected((prev) => new Set([...prev, id]));
    const next = visible.find((c) => c.id !== id);
    if (next) setSelectedId(next.id);
  };

  const handlePass = (id: string) => {
    setPassed((prev) => new Set([...prev, id]));
    const next = visible.find((c) => c.id !== id);
    if (next) setSelectedId(next.id);
  };

  return (
    <div className="flex flex-1 min-h-0 h-full overflow-hidden">
      {/* Left: contact list */}
      <div className="w-[280px] shrink-0 border-r border-[var(--color-border-subtle)]/40 flex flex-col overflow-hidden">
        {/* Search */}
        <div className="shrink-0 px-3 pt-3 pb-2 border-b border-[var(--color-border-subtle)]/30 space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/60 px-2.5 py-1.5">
            <svg className="size-3.5 text-[var(--color-text-muted)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[11px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/60 outline-none"
            />
          </div>
          <div className="flex gap-1">
            {([['all', 'All'], ['iu', 'IU Alumni'], ['other', 'Other']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors',
                  filter === key
                    ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                    : 'border border-[var(--color-border-subtle)]/60 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-primary)]">{visible.length}</span> contacts · <span className="text-[var(--color-success)] font-semibold">{connected.size}</span> connected
          </p>
        </div>

        {/* List */}
        <ul role="list" className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {visible.length === 0 ? (
            <li className="text-center py-8 text-[12px] text-[var(--color-text-muted)]">No contacts found</li>
          ) : visible.map((c) => {
            const isSelected = c.id === selected?.id;
            const isConnected = connected.has(c.id);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    'w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-all',
                    isSelected
                      ? 'bg-[var(--color-brand-primary)]/8 border border-[var(--color-brand-primary)]/20'
                      : 'border border-transparent hover:bg-[var(--color-bg-surface)]/50'
                  )}
                >
                  <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white', avatarColor(c.id))}>
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-[12px] font-semibold truncate', isSelected ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-primary)]')}>
                      {c.name}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">{c.title}</p>
                  </div>
                  {isConnected && (
                    <svg className="size-3.5 shrink-0 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right: detail */}
      {selected ? (
        <div className="flex-1 min-w-0 overflow-y-auto p-6 space-y-5">
          {/* Profile header */}
          <div className="flex items-start gap-4">
            <span className={cn('flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white', avatarColor(selected.id))}>
              {initials(selected.name)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">{selected.name}</h2>
                  <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">{selected.title}</p>
                </div>
                {connected.has(selected.id) && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-[var(--color-success)]/10 text-[var(--color-success)] shrink-0">
                    <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
                    Connected
                  </span>
                )}
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { icon: <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, label: selected.company },
                  { icon: <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: selected.location },
                  { icon: <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, label: selected.sector },
                ].map((m) => (
                  <span key={m.label} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-surface)]/60 border border-[var(--color-border-subtle)]/50 px-2.5 py-1 text-[11px] text-[var(--color-text-muted)]">
                    {m.icon}{m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Email template */}
          <div className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border-subtle)]/40">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Outreach Template</p>
              <button className="text-[10px] font-medium text-[var(--color-brand-primary)] hover:opacity-75 transition-opacity">Copy</button>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <p className="text-[11px] text-[var(--color-text-muted)]"><span className="font-semibold text-[var(--color-text-secondary)]">To:</span> {selected.name.toLowerCase().replace(' ', '.')}@{selected.company.toLowerCase().replace(/\s+/g, '')}.com</p>
              <p className="text-[11px] text-[var(--color-text-muted)]"><span className="font-semibold text-[var(--color-text-secondary)]">Subject:</span> IU Student — Exploring {selected.title} Opportunities</p>
              <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed pt-1">
                Hi {selected.name.split(' ')[0]}, I'm a student at Indiana University interested in your work at {selected.company}. I'd love to learn more about your career path and any advice you'd share for someone looking to break into this space. Would you have 15 minutes for a quick call?
              </p>
            </div>
          </div>

          {/* Actions */}
          {!connected.has(selected.id) ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleConnect(selected.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Connect
              </button>
              <button
                onClick={() => handlePass(selected.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border-subtle)]/60 text-[13px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-all"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Pass
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-sm">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                Compose Email
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border-subtle)]/60 text-[13px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-all">
                View in My Network
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[13px] text-[var(--color-text-muted)]">
          No contacts match your filters
        </div>
      )}
    </div>
  );
}

// ─── My Network ────────────────────────────────────────────────────────────────

const MY_CONNECTIONS = [
  { id: 'n1', name: 'Timothy Johnson', title: 'Managing Director', company: 'Lincoln International', location: 'Chicago, IL', university: 'Indiana University', email: 'timothy.johnson@lincolninternational.com', lastContact: '3 days ago', tags: ['Finance', 'M&A'] },
  { id: 'n2', name: 'Sarah Mitchell', title: 'IB Analyst', company: 'Goldman Sachs', location: 'New York, NY', university: 'Indiana University', email: 'sarah.mitchell@gs.com', lastContact: '1 week ago', tags: ['Banking', 'Capital Markets'] },
];

function MyNetworkTab() {
  const [selected, setSelected] = useState<string | null>(null);
  const contact = MY_CONNECTIONS.find((c) => c.id === selected) ?? null;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Connections', value: MY_CONNECTIONS.length.toString(), icon: <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: 'var(--color-brand-primary)' },
          { label: 'Emails Sent', value: '6', icon: <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, color: 'var(--color-feature-teal)' },
          { label: 'Response Rate', value: '33%', icon: <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, color: 'var(--color-feature-green)' },
          { label: 'Pending Replies', value: '4', icon: <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, color: 'var(--color-feature-purple)' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/50 p-4 flex items-center gap-3">
            <div className="size-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[20px] font-bold text-[var(--color-text-primary)] leading-none">{s.value}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-start">
        {/* Connection cards */}
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Your Connections</p>
          {MY_CONNECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              className={cn(
                'w-full text-left rounded-xl border px-4 py-3.5 flex items-center gap-4 transition-all',
                selected === c.id
                  ? 'border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-primary)]/5'
                  : 'border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/40 hover:bg-[var(--color-bg-surface)]/80'
              )}
            >
              <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white', avatarColor(c.id))}>
                {initials(c.name)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">{c.name}</p>
                  {c.tags.map((tag) => (
                    <span key={tag} className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]">{tag}</span>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{c.title} · {c.company}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1">
                    <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {c.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Last contact {c.lastContact}
                  </span>
                </div>
              </div>
              <svg className={cn('size-4 shrink-0 text-[var(--color-text-muted)] transition-transform', selected === c.id && 'rotate-180')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {contact && (
          <div className="w-[300px] shrink-0 rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/50 overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-[var(--color-border-subtle)]/40">
              <div className="flex items-center gap-3 mb-3">
                <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl text-[15px] font-bold text-white', avatarColor(contact.id))}>
                  {initials(contact.name)}
                </span>
                <div>
                  <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{contact.name}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{contact.title}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {[
                  { icon: <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, text: contact.company },
                  { icon: <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, text: contact.location },
                  { icon: <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, text: contact.university },
                  { icon: <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, text: contact.email },
                ].map((row) => (
                  <div key={row.text} className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                    <span className="shrink-0">{row.icon}</span>
                    <span className="truncate">{row.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 py-3 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[12px] font-semibold py-2 hover:opacity-90 transition-opacity">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email
              </button>
              <button className="px-3 py-2 rounded-lg border border-[var(--color-border-subtle)]/60 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Outreach Analytics ────────────────────────────────────────────────────────

function OutreachAnalyticsTab() {
  const m = SAMPLE_OUTREACH_METRICS;

  const statCards = [
    { label: 'Emails Sent', value: m.totalEmailsSent, sub: 'Total outreach', color: 'var(--color-brand-primary)', icon: <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> },
    { label: 'Responses', value: m.responsesReceived, sub: 'Replies received', color: 'var(--color-feature-green)', icon: <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { label: 'Response Rate', value: m.responseRate, sub: 'Industry avg: 18%', color: 'var(--color-feature-teal)', icon: <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label: 'Scheduled / Drafts', value: m.scheduleSendDrafts, sub: 'In queue', color: 'var(--color-feature-purple)', icon: <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{s.label}</p>
              <div className="size-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <p className="text-[26px] font-black text-[var(--color-text-primary)] leading-none">{s.value}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Firm performance table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[13px] font-bold text-[var(--color-text-primary)]">Firm Outreach Performance</p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Track response rates across your target companies</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[12px] font-semibold hover:opacity-90 transition-opacity">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Firm
          </button>
        </div>

        <div className="rounded-xl border border-[var(--color-border-subtle)]/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-elevated)]/60">
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Company</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Location</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Sent</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Response Rate</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]/30">
              {SAMPLE_FIRM_OUTREACH.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--color-bg-elevated)]/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-primary)]/10 text-[10px] font-bold text-[var(--color-brand-primary)]">
                        {row.firm.charAt(0)}
                      </span>
                      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">{row.firm}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
                      <svg className="size-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {row.location}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[var(--color-text-secondary)]">{row.emailsSent}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden max-w-[80px]">
                        <div className="h-full rounded-full bg-[var(--color-brand-primary)]/30" style={{ width: row.responseRate }} />
                      </div>
                      <span className="text-[12px] text-[var(--color-text-muted)] tabular-nums">{row.responseRate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]">
                      <span className="size-1.5 rounded-full bg-[var(--color-brand-primary)]" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Emails', value: m.totalEmails, note: 'Across all firms' },
          { label: 'Converted to Chat', value: m.convertedToChat, note: 'Scheduled calls' },
          { label: 'Conversion Rate', value: m.conversionRate, note: 'Email → call' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/40 px-4 py-3.5 text-center">
            <p className="text-[24px] font-black text-[var(--color-text-primary)]">{s.value}</p>
            <p className="text-[12px] font-semibold text-[var(--color-text-secondary)] mt-0.5">{s.label}</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────

export default function CareerNetworkingPage() {
  return (
    <Suspense fallback={<div className="flex h-full" />}>
      <CareerNetworkingPageInner />
    </Suspense>
  );
}
