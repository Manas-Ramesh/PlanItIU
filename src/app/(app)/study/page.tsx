'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui';

/* ─────────────────────────────────────────────
   Sample Data
───────────────────────────────────────────── */

interface Flashcard { id: string; front: string; back: string }
interface Deck { id: string; title: string; course: string; color: string; cards: Flashcard[] }

const DECKS: Deck[] = [
  {
    id: 'dcf',
    title: 'DCF Fundamentals',
    course: 'FIN 301',
    color: 'var(--color-brand-primary)',
    cards: [
      { id: 'd1', front: 'What is WACC?', back: 'Weighted Average Cost of Capital — the blended rate a company is expected to pay on all its capital sources. Used as the discount rate in DCF analysis.\n\nWACC = (E/V × Re) + (D/V × Rd × (1−T))' },
      { id: 'd2', front: 'What is Terminal Value?', back: 'The present value of all future cash flows beyond the explicit forecast period.\n\nGordon Growth: TV = FCF × (1+g) / (WACC − g)\nExit Multiple: TV = EBITDA × Multiple' },
      { id: 'd3', front: 'What is Free Cash Flow (FCF)?', back: 'FCF = EBIT(1−t) + D&A − CapEx − ΔNWC\n\nRepresents cash a company generates after maintaining and expanding its asset base — available to all capital providers.' },
      { id: 'd4', front: 'What is Enterprise Value?', back: 'EV = Equity Value + Net Debt + Preferred Stock + Minority Interest\n\nRepresents the total value of a firm independent of its capital structure. "Price to acquire the whole business."' },
      { id: 'd5', front: 'What is the Equity Risk Premium?', back: 'The excess return equity provides over the risk-free rate, compensating investors for taking on equity risk.\n\nTypically estimated at 4–6% in the US using historical data or implied market approaches.' },
    ],
  },
  {
    id: 'accounting',
    title: '3-Statement Model',
    course: 'ACCT 201',
    color: 'var(--color-feature-teal)',
    cards: [
      { id: 'a1', front: 'How does D&A flow through the 3 statements?', back: 'Income Statement: reduces EBIT (non-cash expense, lowers taxes)\nBalance Sheet: reduces PP&E (accumulated depreciation)\nCash Flow Statement: added back in operating activities (non-cash add-back)' },
      { id: 'a2', front: 'What is Net Working Capital (NWC)?', back: 'NWC = Current Assets − Current Liabilities\n(Excluding cash and interest-bearing debt)\n\nMeasures short-term operational liquidity. An increase in NWC is a use of cash.' },
      { id: 'a3', front: 'How does CapEx flow through the 3 statements?', back: 'Income Statement: no direct impact (only D&A hits IS)\nBalance Sheet: increases PP&E (gross)\nCash Flow Statement: investing outflow (negative)' },
      { id: 'a4', front: 'How does debt issuance flow through the 3 statements?', back: 'Income Statement: interest expense increases (reduces pre-tax income)\nBalance Sheet: debt increases on liabilities side, cash increases on assets side\nCash Flow Statement: financing inflow' },
    ],
  },
  {
    id: 'micro',
    title: 'Microeconomics Core',
    course: 'ECON 202',
    color: 'var(--color-feature-orange)',
    cards: [
      { id: 'm1', front: 'What is price elasticity of demand?', back: 'PED = % Change in Quantity Demanded / % Change in Price\n\n|PED| > 1 → Elastic (sensitive to price)\n|PED| < 1 → Inelastic\n|PED| = 1 → Unit elastic' },
      { id: 'm2', front: 'What is a Nash Equilibrium?', back: 'A set of strategies where no player can benefit by unilaterally changing their own strategy, given the strategies of other players.\n\nKey concept in game theory — each player\'s choice is a best response to others.' },
      { id: 'm3', front: 'What is deadweight loss?', back: 'The loss of economic efficiency when the equilibrium outcome is not achievable or not achieved.\n\nCommon causes: taxes, price controls, monopoly pricing, externalities.' },
    ],
  },
];

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */

type Tab = 'flashcards' | 'sets';

export default function StudyPage() {
  const [tab, setTab] = useState<Tab>('flashcards');

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      id: 'sets',
      label: 'My Sets',
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="shrink-0 border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)] px-6 py-[15.4px]">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--color-feature-teal)]/10 border border-[var(--color-feature-teal)]/20 shrink-0">
            <svg className="size-4 text-[var(--color-feature-teal)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Study Portal</h1>
          <span className="rounded-full bg-[var(--color-feature-teal)]/10 border border-[var(--color-feature-teal)]/20 px-3 py-0.5 text-xs font-semibold text-[var(--color-feature-teal)]">
            PlanIt AI
          </span>
        </div>
      </header>

      {/* Tab bar */}
      <div className="shrink-0 flex items-center gap-1 border-b border-[var(--color-border-subtle)]/30 px-5 bg-[var(--color-bg-base)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-3 text-[13px] font-medium border-b-2 transition-colors',
              tab === t.id
                ? 'border-[var(--color-brand-primary)] text-[var(--color-text-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            )}
          >
            <span className={tab === t.id ? 'text-[var(--color-brand-primary)]' : ''}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {tab === 'flashcards' && <FlashcardsTab />}
        {tab === 'sets' && <MySetsTab onStudy={() => setTab('flashcards')} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Flashcards Tab — full study mode
───────────────────────────────────────────── */

function FlashcardsTab() {
  const [selectedDeck, setSelectedDeck] = useState<Deck>(DECKS[0]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [unknown, setUnknown] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const card = selectedDeck.cards[index];
  const total = selectedDeck.cards.length;

  const flip = useCallback(() => setFlipped((f) => !f), []);

  const advance = useCallback((knew: boolean) => {
    if (knew) setKnown((s) => new Set([...s, card.id]));
    else setUnknown((s) => new Set([...s, card.id]));
    setFlipped(false);
    setTimeout(() => {
      if (index + 1 >= total) setDone(true);
      else setIndex((i) => i + 1);
    }, 200);
  }, [card.id, index, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); flip(); }
      if (e.key === 'ArrowRight' && flipped) advance(true);
      if (e.key === 'ArrowLeft' && flipped) advance(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flip, advance, flipped]);

  const restart = useCallback(() => {
    setIndex(0); setFlipped(false);
    setKnown(new Set()); setUnknown(new Set());
    setDone(false);
  }, []);

  const changeDeck = useCallback((deck: Deck) => {
    setSelectedDeck(deck); setIndex(0); setFlipped(false);
    setKnown(new Set()); setUnknown(new Set()); setDone(false);
  }, []);

  const knownPct = done ? Math.round((known.size / total) * 100) : 0;

  return (
    <div className="flex h-full">
      <DeckSidebar selected={selectedDeck} onSelect={changeDeck} />

      <div className="flex-1 flex flex-col min-w-0">
        {done ? (
          /* Results screen */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full space-y-6 text-center">
              <div className="text-5xl">{knownPct >= 80 ? '🎉' : knownPct >= 50 ? '💪' : '📚'}</div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Round Complete</h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{selectedDeck.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--color-feature-green)]/30 bg-[var(--color-feature-green)]/5 p-4">
                  <p className="text-3xl font-bold text-[var(--color-feature-green)]">{known.size}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Got it</p>
                </div>
                <div className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-4">
                  <p className="text-3xl font-bold text-[var(--color-danger)]">{unknown.size}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Still learning</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--color-feature-green)] transition-all" style={{ width: `${knownPct}%` }} />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">{knownPct}% mastered</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={restart}>Study Again</Button>
                {unknown.size > 0 && <Button variant="secondary" onClick={restart}>Retry Missed ({unknown.size})</Button>}
              </div>
            </div>
          </div>
        ) : (
          /* Study mode */
          <>
            {/* Progress bar */}
            <div className="shrink-0 h-1 bg-[var(--color-bg-elevated)]">
              <div className="h-full bg-[var(--color-brand-primary)] transition-all duration-500" style={{ width: `${(index / total) * 100}%` }} />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 gap-6">
              {/* Card progress dots */}
              <div className="flex items-center justify-between w-full max-w-xl">
                <div className="flex gap-1 flex-wrap">
                  {selectedDeck.cards.map((c, i) => (
                    <span key={c.id} className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i < index
                        ? (known.has(c.id) ? 'bg-[var(--color-feature-green)] w-5' : 'bg-[var(--color-danger)] w-5')
                        : i === index ? 'bg-[var(--color-brand-primary)] w-5' : 'bg-[var(--color-bg-elevated)] w-3'
                    )} />
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] shrink-0 ml-4">{index + 1} / {total}</p>
              </div>

              {/* Flip card */}
              <div
                className="relative w-full max-w-xl cursor-pointer [perspective:1200px] select-none"
                style={{ height: '260px' }}
                onClick={flip}
              >
                <div className={cn(
                  'absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]',
                  flipped && '[transform:rotateY(180deg)]'
                )}>
                  <div className="absolute inset-0 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] flex flex-col items-center justify-center px-10 [backface-visibility:hidden] shadow-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/50 mb-4">Term</span>
                    <p className="text-xl font-semibold text-[var(--color-text-primary)] text-center leading-snug">{card.front}</p>
                    <span className="mt-6 text-xs text-[var(--color-text-muted)]/40">Click or Space to flip</span>
                  </div>
                  <div className="absolute inset-0 rounded-2xl border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/4 flex flex-col items-center justify-center px-10 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-brand-primary)]/50 mb-4">Definition</span>
                    <p className="text-[14px] text-[var(--color-text-primary)] text-center leading-relaxed whitespace-pre-line">{card.back}</p>
                  </div>
                </div>
              </div>

              {/* Know / Don't Know */}
              {flipped ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => advance(false)}
                    className="flex items-center gap-2 rounded-xl border-2 border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 px-6 py-3 text-sm font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Still Learning
                    <span className="text-[10px] opacity-40">←</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => advance(true)}
                    className="flex items-center gap-2 rounded-xl border-2 border-[var(--color-feature-green)]/30 bg-[var(--color-feature-green)]/5 px-6 py-3 text-sm font-semibold text-[var(--color-feature-green)] hover:bg-[var(--color-feature-green)]/10 transition-colors"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                    Got It
                    <span className="text-[10px] opacity-40">→</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[var(--color-text-muted)]/50">Flip the card first, then mark whether you knew it</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DeckSidebar({ selected, onSelect }: { selected: Deck; onSelect: (d: Deck) => void }) {
  return (
    <aside className="w-[200px] shrink-0 border-r border-[var(--color-border-subtle)]/30 overflow-y-auto bg-[var(--color-bg-base)]">
      <div className="px-3 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/60 px-2">Decks</p>
      </div>
      <ul className="px-2 pb-3 space-y-1">
        {DECKS.map((deck) => (
          <li key={deck.id}>
            <button
              type="button"
              onClick={() => onSelect(deck)}
              className={cn(
                'w-full text-left rounded-lg px-2.5 py-2.5 transition-colors',
                selected.id === deck.id
                  ? 'bg-[var(--color-brand-primary)]/8 border border-[var(--color-brand-primary)]/20'
                  : 'hover:bg-[var(--color-bg-surface)]/60 border border-transparent'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full" style={{ background: deck.color }} />
                <span className={cn(
                  'text-[12px] font-medium truncate',
                  selected.id === deck.id ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                )}>
                  {deck.title}
                </span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 ml-4">{deck.course} · {deck.cards.length} cards</p>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   My Sets Tab
───────────────────────────────────────────── */

function MySetsTab({ onStudy }: { onStudy: () => void }) {
  return (
    <div className="overflow-y-auto h-full p-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Your Study Sets</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {DECKS.length} decks · {DECKS.reduce((a, d) => a + d.cards.length, 0)} cards total
            </p>
          </div>
          <Button className="gap-2">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Set
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DECKS.map((deck) => (
            <div key={deck.id} className="group flex flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] overflow-hidden hover:border-[var(--color-brand-primary)]/30 transition-colors">
              <div className="h-1.5" style={{ background: deck.color }} />
              <div className="flex-1 p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] leading-tight">{deck.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{deck.course}</p>
                </div>
                <div className="space-y-1.5">
                  {deck.cards.slice(0, 2).map((c) => (
                    <div key={c.id} className="rounded-lg bg-[var(--color-bg-elevated)] px-2.5 py-1.5">
                      <p className="text-[11px] text-[var(--color-text-secondary)] truncate">{c.front}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">{deck.cards.length} cards</p>
              </div>
              <div className="flex items-center gap-2 border-t border-[var(--color-border-subtle)]/50 px-4 py-2.5">
                <Button size="sm" onClick={onStudy}>Study</Button>
                <Button variant="secondary" size="sm">Edit</Button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border-subtle)] p-8 text-[var(--color-text-muted)] hover:border-[var(--color-brand-primary)]/40 hover:text-[var(--color-text-secondary)] transition-colors min-h-[200px]"
          >
            <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-sm font-medium">Create new set</span>
            <span className="text-xs text-center opacity-70">Import from PDF, paste text,<br />or build card by card</span>
          </button>
        </div>
      </div>
    </div>
  );
}
