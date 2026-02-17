'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CareerSubLayout } from '@/components/career/CareerSubLayout';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const TABS = [
  { href: '/career/interview-prep?tab=practice', label: 'Practice Chat' },
  { href: '/career/interview-prep?tab=drills', label: 'Question Drills' },
  { href: '/career/interview-prep?tab=mock', label: 'Mock Interview' },
] as const;

export default function InterviewPrepPage() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') as 'practice' | 'drills' | 'mock') || 'practice';

  return (
    <CareerSubLayout
      title="PlanIt Interview Prep"
      subtitle="Sharpen your investment banking technicals, interviews, and outreach with one personalized workspace."
      highlightText="investment banking"
      tabs={TABS}
    >
      {tab === 'practice' && <PracticeChatTab />}
      {tab === 'drills' && <QuestionDrillsTab />}
      {tab === 'mock' && <MockInterviewTab />}
    </CareerSubLayout>
  );
}

function PracticeChatTab() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col items-center py-8">
      <div className="flex size-20 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
        <svg className="size-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">PlanIt</h2>
      <p className="mt-1 text-[var(--color-text-secondary)]">Get instant answers and practice questions</p>
      <div className="mt-8 w-full space-y-3">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder=""
            className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm"
            aria-label="Quick prompt"
          />
          <input
            type="text"
            placeholder=""
            className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm"
            aria-label="Quick prompt 2"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button variant="secondary" className="gap-2">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload PDF
          </Button>
          <Button className="gap-2">Send</Button>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {['General', 'M&A', 'Valuation', 'Capital Markets', 'Restructuring'].map((topic) => (
          <button
            key={topic}
            type="button"
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition',
              topic === 'General'
                ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]'
            )}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuestionDrillsTab() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Drills</h2>
        <p className="text-[var(--color-text-secondary)]">Practice technical questions and build your skills</p>
      </section>
      <section>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">Difficulty Level</p>
        <div className="mt-2 flex gap-2">
          {['Any', 'Easy', 'Medium', 'Hard'].map((d) => (
            <button
              key={d}
              type="button"
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                d === 'Any' ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]' : 'border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]'
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </section>
      <section>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">Bank Type</p>
        <div className="mt-2 flex gap-2">
          {['Any', 'Boutique', 'Bulge Bracket'].map((b) => (
            <button
              key={b}
              type="button"
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                b === 'Any' ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]' : 'border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]'
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { title: 'TOTAL QUESTIONS DONE', value: '0', desc: 'Across all drills' },
          { title: 'COMPLETED', value: '0', desc: '0% completion rate' },
          { title: 'AVERAGE SCORE', value: '0%', desc: 'Across all drills' },
          { title: 'ACTIVE STREAK', value: '0 days', desc: 'Keep it going!' },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{card.title}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{card.value}</p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{card.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          Number of Questions:
          <input
            type="number"
            className="w-20 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-2 py-1 text-[var(--color-text-primary)]"
          />
        </label>
      </div>
      <div className="flex gap-2">
        <Button className="gap-2">+ Start New Drill</Button>
        <Button variant="secondary" className="gap-2">Upload Custom PDF</Button>
        <Button variant="secondary" className="gap-2">View Progress</Button>
      </div>
    </div>
  );
}

function MockInterviewTab() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Mock Interview</h2>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Practice with HireVue-style video interviews and get AI-powered feedback.
        </p>
      </section>
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 text-center">
        <span className="flex mx-auto size-16 items-center justify-center rounded-full bg-[var(--color-danger)] text-[var(--color-text-on-brand)]">
          <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </span>
        <h3 className="mt-4 font-semibold text-[var(--color-text-primary)]">Video Interview Simulator</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Answer behavioral and technical questions on camera.
        </p>
      </div>
      <ul className="space-y-4">
        {[
          { step: 1, title: 'Select Interview Type', desc: 'Technical, Behavioral, or Mixed' },
          { step: 2, title: 'Record Your Responses', desc: "You'll have time to think and record each answer" },
          { step: 3, title: 'Get AI Feedback', desc: 'Receive detailed scoring and improvement tips' },
        ].map((item) => (
          <li
            key={item.step}
            className="flex gap-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-sm font-bold text-[var(--color-text-on-brand)]">
              {item.step}
            </span>
            <div>
              <p className="font-semibold text-[var(--color-text-primary)]">{item.title}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <Button className="gap-2" size="lg">
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          Start Mock Interview
        </Button>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          aria-label="Settings"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
