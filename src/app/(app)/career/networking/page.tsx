'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CareerSubLayout } from '@/components/career/CareerSubLayout';
import {
  SAMPLE_CONTACTS,
  SAMPLE_OUTREACH_METRICS,
  SAMPLE_FIRM_OUTREACH,
} from '@/lib/data/sampleData';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const TABS = [
  { href: '/career/networking?tab=swipe', label: 'Swipe Contacts' },
  { href: '/career/networking?tab=network', label: 'My Network (1)' },
  { href: '/career/networking?tab=analytics', label: 'Outreach Analytics' },
] as const;

export default function CareerNetworkingPage() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') as 'swipe' | 'network' | 'analytics') || 'swipe';

  return (
    <CareerSubLayout
      title="Career Networking"
      subtitle="Connect with IU alumni and build your professional network"
      tabs={TABS}
    >
      {tab === 'swipe' && <SwipeContactsTab />}
      {tab === 'network' && <MyNetworkTab />}
      {tab === 'analytics' && <OutreachAnalyticsTab />}
    </CareerSubLayout>
  );
}

function SwipeContactsTab() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2">
          <svg className="size-5 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search contacts by name, company, title, location..."
            className="flex-1 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
          />
        </div>
        <Button variant="secondary" className="shrink-0 gap-2">Filters</Button>
        <span className="text-sm text-[var(--color-text-muted)] shrink-0">{SAMPLE_CONTACTS.length} contacts available</span>
      </div>
      <ul className="space-y-3">
        {SAMPLE_CONTACTS.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4"
          >
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-nav-active)] text-sm font-semibold text-[var(--color-text-on-brand)]"
              aria-hidden
            >
              {c.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--color-text-primary)]">{c.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{c.title}</p>
              <p className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)] mt-1">
                <span className="flex items-center gap-1">Briefcase {c.company}</span>
                <span className="flex items-center gap-1">Pin {c.location}</span>
                <span className="flex items-center gap-1">Cap Indiana University</span>
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                aria-label="Decline"
              >
                ×
              </button>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]"
                aria-label="Connect"
              >
                ✓
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MyNetworkTab() {
  const [showToast, setShowToast] = useState(true);
  const contact = SAMPLE_CONTACTS[0]; // Timothy Johnson

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {showToast && (
        <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-3 flex items-center gap-2 text-[var(--color-text-primary)]">
          <span className="text-[var(--color-success)]">✔</span>
          Added Timothy Johnson to your network!
        </div>
      )}
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Network</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">Alumni you&apos;ve connected with</p>
      </section>
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5">
        <div className="flex gap-4">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-nav-active)] text-lg font-semibold text-[var(--color-text-on-brand)]"
            aria-hidden
          >
            TJ
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[var(--color-text-primary)]">{contact.name}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">{contact.title}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{contact.company}</p>
            <ul className="mt-3 space-y-1 text-sm text-[var(--color-text-secondary)]">
              <li>Location: Chicago, IL</li>
              <li>Indiana University (Big Ten)</li>
              <li>Carmel High School</li>
              <li>
                <a href="#" className="text-[var(--color-brand-primary)] hover:underline">timothy.johnson@lincolninternational.com</a>
              </li>
              <li>Last contact: NaN days ago</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Button className="gap-2">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Compose Email
              </Button>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                aria-label="Share"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutreachAnalyticsTab() {
  const m = SAMPLE_OUTREACH_METRICS;
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Outreach Analytics</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">Track email yield and response rates by firm</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-on-brand)]"
          >
            Email Analytics
          </button>
          <button
            type="button"
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)]"
          >
            Chat Tracker
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Emails Sent', value: m.totalEmailsSent, icon: 'plane' },
            { label: 'Responses Received', value: m.responsesReceived, icon: 'msg' },
            { label: 'Response Rate', value: m.responseRate, icon: 'check' },
            { label: 'Schedule Send/Drafts', value: m.scheduleSendDrafts, icon: 'cal' },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4">
              <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{card.value}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Chat Conversion Rate</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">Track email-to-chat conversion by firm</p>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">View by Firm: <input type="text" className="ml-2 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-2 py-1 w-48" /></p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase">Total Emails</p>
            <p className="mt-2 text-xl font-bold text-[var(--color-text-primary)]">{m.totalEmails}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase">Converted to Chat</p>
            <p className="mt-2 text-xl font-bold text-[var(--color-feature-green)]">{m.convertedToChat}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase">Conversion Rate</p>
            <p className="mt-2 text-xl font-bold text-[var(--color-text-primary)]">{m.conversionRate}</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Firm Outreach Performance</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">Track which firms are responding to your outreach</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] text-left">
                <th className="p-3 font-medium text-[var(--color-text-primary)]">Firm</th>
                <th className="p-3 font-medium text-[var(--color-text-primary)]">Location</th>
                <th className="p-3 font-medium text-[var(--color-text-primary)]"># of Emails Sent</th>
                <th className="p-3 font-medium text-[var(--color-text-primary)]">Converted to Chat</th>
                <th className="p-3 font-medium text-[var(--color-text-primary)]">Response Rate</th>
                <th className="p-3 font-medium text-[var(--color-text-primary)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_FIRM_OUTREACH.map((row, i) => (
                <tr key={i} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-surface)]">
                  <td className="p-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-[var(--color-text-muted)]">Building</span>
                      {row.firm}
                    </span>
                  </td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{row.location}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{row.emailsSent}</td>
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder=""
                      className="w-12 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-2 py-1 text-center text-[var(--color-text-secondary)]"
                      readOnly
                    />
                  </td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{row.responseRate}</td>
                  <td className="p-3">
                    <span className="inline-block rounded-full bg-[var(--color-feature-amber)]/20 text-[var(--color-feature-amber)] px-2 py-1 text-xs font-medium">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
