'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Progress } from '@/components/ui';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassItem {
  id: string;
  code: string;
  name: string;
  color: string;
  professor: string;
  assignments: AssignmentItem[];
}

interface AssignmentItem {
  id: string;
  name: string;
  dueDate: string;
  points: number;
  type: 'Essay' | 'Problem Set' | 'Project' | 'Presentation' | 'Lab Report';
  rubric: RubricCategory[];
  description: string;
}

interface RubricCategory {
  category: string;
  points: number;
  description: string;
}

interface GradeResult {
  predictedGrade: number;
  confidence: number;
  letterGrade: string;
  categories: GradedCategory[];
  overallFeedback: string;
}

interface GradedCategory {
  category: string;
  score: number;
  maxScore: number;
  comments: string;
  suggestions: string[];
}

interface SubmissionRecord {
  id: string;
  classCode: string;
  className: string;
  assignmentName: string;
  submittedAt: string;
  predictedGrade: number;
  letterGrade: string;
  confidence: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const CLASSES: ClassItem[] = [
  {
    id: 'fin301',
    code: 'FIN 301',
    name: 'Corporate Finance',
    color: 'var(--color-feature-blue)',
    professor: 'Dr. Katherine Holt',
    assignments: [
      {
        id: 'fin301-a1',
        name: 'DCF Valuation Case Study',
        dueDate: 'Feb 21, 2026',
        points: 100,
        type: 'Project',
        description: 'Perform a discounted cash flow valuation of a publicly traded company of your choice. Include 5-year projections, WACC calculation, and sensitivity analysis.',
        rubric: [
          { category: 'Financial Modeling Accuracy', points: 30, description: 'Correct DCF model with proper formulas and projections' },
          { category: 'WACC Calculation', points: 20, description: 'Accurate cost of equity, debt, and weighted average' },
          { category: 'Sensitivity Analysis', points: 20, description: 'Multiple scenarios with clear assumptions' },
          { category: 'Written Analysis', points: 20, description: 'Clear investment thesis and recommendation' },
          { category: 'Formatting & Presentation', points: 10, description: 'Professional layout, charts, and citations' },
        ],
      },
      {
        id: 'fin301-a2',
        name: 'Capital Structure Essay',
        dueDate: 'Mar 5, 2026',
        points: 75,
        type: 'Essay',
        description: "Analyze how a firm's optimal capital structure is determined. Reference Modigliani-Miller theorem and real-world examples (5\u20137 pages).",
        rubric: [
          { category: 'Theoretical Foundation', points: 25, description: 'Accurate explanation of M&M theorem and trade-off theory' },
          { category: 'Real-World Application', points: 20, description: 'At least two company examples with data' },
          { category: 'Argumentation & Logic', points: 20, description: 'Coherent argument with evidence' },
          { category: 'Writing Quality', points: 10, description: 'Grammar, style, and APA citations' },
        ],
      },
    ],
  },
  {
    id: 'acct201',
    code: 'ACCT 201',
    name: 'Financial Accounting',
    color: 'var(--color-feature-green)',
    professor: 'Prof. David Kim',
    assignments: [
      {
        id: 'acct201-a1',
        name: '3-Statement Model Analysis',
        dueDate: 'Feb 28, 2026',
        points: 80,
        type: 'Problem Set',
        description: 'Build a connected 3-statement model (Income Statement, Balance Sheet, Cash Flow Statement) from the provided trial balance data. Balance sheet must balance.',
        rubric: [
          { category: 'Income Statement Accuracy', points: 25, description: 'Revenue, COGS, operating expenses, and net income correct' },
          { category: 'Balance Sheet', points: 25, description: 'Assets = Liabilities + Equity, all line items correct' },
          { category: 'Cash Flow Statement', points: 20, description: 'Indirect method, operating/investing/financing activities' },
          { category: 'Linkages', points: 10, description: 'Net income feeds retained earnings, cash ties out' },
        ],
      },
      {
        id: 'acct201-a2',
        name: 'Revenue Recognition Memo',
        dueDate: 'Mar 12, 2026',
        points: 50,
        type: 'Essay',
        description: 'Write a professional memo analyzing a company\'s revenue recognition policy under ASC 606. Identify any gray areas or red flags (2–3 pages).',
        rubric: [
          { category: 'ASC 606 Application', points: 20, description: 'Correct application of the 5-step model' },
          { category: 'Analysis Quality', points: 15, description: 'Identifies specific issues and gray areas' },
          { category: 'Memo Format', points: 10, description: 'Professional memo structure with proper headers' },
          { category: 'Conclusion', points: 5, description: 'Clear recommendation or risk assessment' },
        ],
      },
    ],
  },
  {
    id: 'econ202',
    code: 'ECON 202',
    name: 'Microeconomics',
    color: 'var(--color-feature-teal)',
    professor: 'Dr. Maria Santos',
    assignments: [
      {
        id: 'econ202-a1',
        name: 'Market Structure Analysis',
        dueDate: 'Mar 3, 2026',
        points: 60,
        type: 'Essay',
        description: 'Compare and contrast perfect competition, monopolistic competition, oligopoly, and monopoly. Apply one structure to a real industry (4–6 pages).',
        rubric: [
          { category: 'Conceptual Accuracy', points: 20, description: 'Correct definitions and characteristics of each structure' },
          { category: 'Real-World Application', points: 20, description: 'Convincing industry analysis with data' },
          { category: 'Economic Analysis', points: 15, description: 'Use of graphs and quantitative reasoning' },
          { category: 'Writing & Citations', points: 5, description: 'Clear prose and proper references' },
        ],
      },
    ],
  },
  {
    id: 'bus101',
    code: 'BUS-X 101',
    name: 'Business Presentations',
    color: 'var(--color-feature-orange)',
    professor: 'Prof. James Wu',
    assignments: [
      {
        id: 'bus101-a1',
        name: 'Elevator Pitch Deck',
        dueDate: 'Feb 24, 2026',
        points: 100,
        type: 'Presentation',
        description: 'Create a 10-slide investor pitch deck for a startup idea. Present to the class for 5 minutes with Q&A.',
        rubric: [
          { category: 'Problem & Solution Clarity', points: 25, description: 'Clear problem statement and compelling solution' },
          { category: 'Market Opportunity', points: 20, description: 'TAM/SAM/SOM with data sources' },
          { category: 'Business Model', points: 20, description: 'Revenue streams and unit economics' },
          { category: 'Slide Design', points: 20, description: 'Visual clarity, consistency, no text walls' },
          { category: 'Delivery & Q&A', points: 15, description: 'Confident delivery and thoughtful answers' },
        ],
      },
    ],
  },
];

const SAMPLE_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 's1',
    classCode: 'FIN 301',
    className: 'Corporate Finance',
    assignmentName: 'DCF Valuation Case Study',
    submittedAt: 'Feb 10, 2026 · 11:47 PM',
    predictedGrade: 94,
    letterGrade: 'A',
    confidence: 98.2,
  },
  {
    id: 's2',
    classCode: 'ACCT 201',
    className: 'Financial Accounting',
    assignmentName: '3-Statement Model Analysis',
    submittedAt: 'Feb 5, 2026 · 2:13 PM',
    predictedGrade: 87,
    letterGrade: 'B+',
    confidence: 94.1,
  },
  {
    id: 's3',
    classCode: 'ECON 202',
    className: 'Microeconomics',
    assignmentName: 'Market Structure Analysis',
    submittedAt: 'Jan 28, 2026 · 9:32 AM',
    predictedGrade: 91,
    letterGrade: 'A-',
    confidence: 96.7,
  },
];

// ─── AI Grading Simulation ─────────────────────────────────────────────────────

function simulateGrading(assignment: AssignmentItem): GradeResult {
  const categories: GradedCategory[] = assignment.rubric.map((r) => {
    const pct = 0.78 + Math.random() * 0.20;
    const score = Math.round(r.points * pct);
    const isStrong = pct > 0.9;
    return {
      category: r.category,
      score,
      maxScore: r.points,
      comments: isStrong
        ? `Strong work here. Your ${r.category.toLowerCase()} demonstrates solid understanding and meets the rubric criteria effectively.`
        : `Your ${r.category.toLowerCase()} shows effort but could be strengthened. The core concepts are present but execution could be more precise.`,
      suggestions: isStrong
        ? [`Consider adding more specific data points to further strengthen your argument.`]
        : [
            `Review the rubric criteria for ${r.category.toLowerCase()} and ensure each point is addressed explicitly.`,
            `Add more quantitative support or examples to back up your claims.`,
          ],
    };
  });

  const totalEarned = categories.reduce((s, c) => s + c.score, 0);
  const totalMax = categories.reduce((s, c) => s + c.maxScore, 0);
  const pct = (totalEarned / totalMax) * 100;
  const letter = pct >= 93 ? 'A' : pct >= 90 ? 'A-' : pct >= 87 ? 'B+' : pct >= 83 ? 'B' : pct >= 80 ? 'B-' : 'C+';

  return {
    predictedGrade: Math.round(pct),
    confidence: 94 + Math.random() * 5,
    letterGrade: letter,
    categories,
    overallFeedback: `Your submission demonstrates a solid grasp of the core concepts. Focus on the lower-scoring categories below for the biggest grade improvement before final submission. Overall this is competitive work within your class.`,
  };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: AssignmentItem['type'] }) {
  const colors: Record<AssignmentItem['type'], string> = {
    Essay: 'bg-[var(--color-feature-blue)]/10 text-[var(--color-feature-blue)]',
    'Problem Set': 'bg-[var(--color-feature-teal)]/10 text-[var(--color-feature-teal)]',
    Project: 'bg-[var(--color-feature-orange)]/10 text-[var(--color-feature-orange)]',
    Presentation: 'bg-[var(--color-feature-pink)]/10 text-[var(--color-feature-pink)]',
    'Lab Report': 'bg-[var(--color-feature-green)]/10 text-[var(--color-feature-green)]',
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[type]}`}>
      {type}
    </span>
  );
}

// ─── Grade Assignment Tab ──────────────────────────────────────────────────────

function GradeAssignmentTab() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);

  const selectedClass = CLASSES.find((c) => c.id === selectedClassId) ?? null;
  const selectedAssignment = selectedClass?.assignments.find((a) => a.id === selectedAssignmentId) ?? null;

  const handleClassSelect = (id: string) => {
    setSelectedClassId(id);
    setSelectedAssignmentId(null);
    setResult(null);
  };

  const handleAssignmentSelect = (id: string) => {
    setSelectedAssignmentId(id);
    setResult(null);
  };

  const handleGrade = () => {
    if (!selectedAssignment) return;
    setIsGrading(true);
    setResult(null);
    setTimeout(() => {
      setResult(simulateGrading(selectedAssignment));
      setIsGrading(false);
    }, 2200);
  };

  const gradeColor = (pct: number) =>
    pct >= 90 ? 'var(--color-success)' : pct >= 75 ? 'var(--color-feature-orange)' : 'var(--color-danger)';

  return (
    <div className="flex h-full min-h-0">
      {/* Far-left: Class + Assignment picker */}
      <aside className="w-[210px] shrink-0 border-r border-[var(--color-border-subtle)]/40 flex flex-col overflow-y-auto">
        <div className="px-3 pt-4 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Your Classes</p>
        </div>
        <nav className="flex-1 px-2 pb-4 space-y-0.5">
          {CLASSES.map((cls) => (
            <div key={cls.id}>
              <button
                onClick={() => handleClassSelect(cls.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-all ${
                  selectedClassId === cls.id
                    ? 'bg-[var(--color-bg-elevated)]'
                    : 'hover:bg-[var(--color-bg-elevated)]/60'
                }`}
              >
                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cls.color }} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold text-[var(--color-text-primary)] truncate">{cls.code}</span>
                  <span className="block text-[11px] text-[var(--color-text-muted)] truncate">{cls.name}</span>
                </span>
                <svg
                  className={`size-3 shrink-0 text-[var(--color-text-muted)] transition-transform ${selectedClassId === cls.id ? 'rotate-90' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              {selectedClassId === cls.id && (
                <div className="ml-5 mt-0.5 space-y-0.5">
                  {cls.assignments.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleAssignmentSelect(a.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedAssignmentId === a.id
                          ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]/60'
                      }`}
                    >
                      <span className="block text-[11px] font-medium truncate">{a.name}</span>
                      <span className="block text-[10px] mt-0.5 opacity-70">Due {a.dueDate}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border-subtle)]/40 px-3 py-3">
          <button className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]/60 hover:text-[var(--color-text-secondary)] transition-all">
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-[12px] font-medium">Custom Rubric</span>
          </button>
        </div>
      </aside>

      {/* Nothing selected state */}
      {!selectedAssignment && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="size-16 rounded-2xl bg-[var(--color-feature-orange)]/10 flex items-center justify-center">
            <svg className="size-8 text-[var(--color-feature-orange)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="9" y1="16" x2="13" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">Select an assignment</p>
            <p className="mt-1 text-[13px] text-[var(--color-text-muted)] max-w-xs">
              Choose a class and assignment from the left to get AI grading and feedback.
            </p>
          </div>
        </div>
      )}

      {/* Assignment selected: two-column split */}
      {selectedAssignment && (
        <div className="flex-1 min-w-0 flex overflow-hidden">

          {/* Left panel: assignment info + rubric */}
          <div className="w-[300px] shrink-0 border-r border-[var(--color-border-subtle)]/40 overflow-y-auto">
            <div className="p-5 space-y-4">
              {/* Assignment header */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${selectedClass?.color ?? 'var(--color-brand-primary)'} 15%, transparent)`,
                      color: selectedClass?.color ?? 'var(--color-brand-primary)',
                    }}
                  >
                    {selectedClass?.code}
                  </span>
                  <TypeBadge type={selectedAssignment.type} />
                </div>
                <h2 className="text-[15px] font-bold text-[var(--color-text-primary)] leading-snug">{selectedAssignment.name}</h2>
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                  Due {selectedAssignment.dueDate} · Prof. {selectedClass?.professor}
                </p>
                <p className="mt-3 text-[12px] text-[var(--color-text-secondary)] leading-relaxed">{selectedAssignment.description}</p>
              </div>

              {/* Rubric */}
              <div className="rounded-xl border border-[var(--color-border-subtle)]/60 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[var(--color-border-subtle)]/40 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Rubric</p>
                  <p className="text-[11px] font-bold text-[var(--color-brand-primary)]">{selectedAssignment.points} pts total</p>
                </div>
                <div className="divide-y divide-[var(--color-border-subtle)]/30">
                  {selectedAssignment.rubric.map((r, i) => {
                    const gradedCat = result?.categories[i];
                    const scorePct = gradedCat ? (gradedCat.score / gradedCat.maxScore) * 100 : null;
                    return (
                      <div key={i} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[12px] font-semibold text-[var(--color-text-primary)] leading-snug">{r.category}</p>
                          <span className="shrink-0 text-[11px] font-bold tabular-nums" style={{ color: scorePct !== null ? gradeColor(scorePct) : 'var(--color-text-muted)' }}>
                            {gradedCat ? `${gradedCat.score}/` : ''}{r.points}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)] leading-relaxed">{r.description}</p>
                        {scorePct !== null && (
                          <div className="mt-2 h-1 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${scorePct}%`, backgroundColor: gradeColor(scorePct) }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {result && (
                  <div className="px-4 py-3 border-t border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-elevated)]/40 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[var(--color-text-primary)]">Total</span>
                    <span className="text-[13px] font-black tabular-nums" style={{ color: gradeColor(result.predictedGrade) }}>
                      {result.predictedGrade}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: upload + AI feedback */}
          <div className="flex flex-1 min-w-0 overflow-y-auto p-5 space-y-5">

            {/* Upload area — always visible, boilerplate when no result */}
            <div className={`rounded-2xl border-2 border-dashed transition-colors ${result ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/5' : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]/30'}`}>
              <div className="flex flex-col items-center gap-3 py-8 text-center px-6">
                {result ? (
                  <>
                    <div className="size-12 rounded-full bg-[var(--color-success)]/15 flex items-center justify-center">
                      <svg className="size-6 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--color-success)]">Submission analyzed</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Graded against {selectedAssignment.rubric.length} rubric categories</p>
                    </div>
                    <button
                      onClick={() => setResult(null)}
                      className="text-[11px] text-[var(--color-text-muted)] underline underline-offset-2 hover:text-[var(--color-text-secondary)] transition-colors"
                    >
                      Re-grade submission
                    </button>
                  </>
                ) : (
                  <>
                    {/* Upload icon composed of document + spark */}
                    <div className="relative">
                      <div className="size-14 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]/60 flex items-center justify-center">
                        <svg className="size-7 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-[var(--color-feature-orange)] flex items-center justify-center">
                        <svg className="size-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">Upload your submission</p>
                      <p className="mt-1 text-[12px] text-[var(--color-text-muted)] max-w-[240px]">
                        PDF, Word, PowerPoint, or plain text — our AI will grade it against the rubric on the left.
                      </p>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)]/60 italic">
                      Canvas sync coming soon · File upload available in full release
                    </p>
                    {/* Grade button */}
                    <button
                      onClick={handleGrade}
                      disabled={isGrading}
                      className={`mt-1 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                        isGrading
                          ? 'opacity-60 cursor-not-allowed bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                          : 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] hover:opacity-90 shadow-sm'
                      }`}
                    >
                      {isGrading ? (
                        <>
                          <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Analyzing…
                        </>
                      ) : (
                        <>
                          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" />
                          </svg>
                          Get AI Grade & Feedback
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* AI Feedback — appears after grading */}
            {result && (
              <>
                {/* Grade summary strip */}
                <div className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/40 px-5 py-4 flex items-center gap-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Predicted Grade</p>
                    <div className="flex items-end gap-2 mt-0.5">
                      <span className="text-[40px] font-black leading-none" style={{ color: gradeColor(result.predictedGrade) }}>
                        {result.letterGrade}
                      </span>
                      <span className="text-[20px] font-bold text-[var(--color-text-primary)] mb-0.5">{result.predictedGrade}%</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${result.predictedGrade}%`, backgroundColor: gradeColor(result.predictedGrade) }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-1">
                      <span>0%</span><span>100%</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-[var(--color-success)]/15 text-[var(--color-success)] shrink-0">
                    <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
                    {result.confidence.toFixed(1)}% confidence
                  </span>
                </div>

                {/* Per-category feedback */}
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">AI Feedback by Section</p>
                  <div className="space-y-0 rounded-xl border border-[var(--color-border-subtle)]/60 overflow-hidden divide-y divide-[var(--color-border-subtle)]/40">
                    {result.categories.map((cat, i) => {
                      const pct = (cat.score / cat.maxScore) * 100;
                      return (
                        <div key={i} className="px-5 py-4 bg-[var(--color-bg-surface)]/30">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">{cat.category}</p>
                            <span
                              className="shrink-0 text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full"
                              style={{
                                color: gradeColor(pct),
                                backgroundColor: `color-mix(in srgb, ${gradeColor(pct)} 12%, transparent)`,
                              }}
                            >
                              {cat.score}/{cat.maxScore} pts
                            </span>
                          </div>
                          {/* 1–2 sentence feedback */}
                          <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">{cat.comments}</p>
                          {cat.suggestions.length > 0 && (
                            <div className="mt-2 flex flex-col gap-1">
                              {cat.suggestions.map((s, j) => (
                                <div key={j} className="flex items-start gap-1.5">
                                  <svg className="size-3 mt-[3px] shrink-0 text-[var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                  <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">{s}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Overall summary */}
                <div className="rounded-xl border border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-primary)]/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="size-4 text-[var(--color-brand-primary)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" />
                    </svg>
                    <p className="text-[12px] font-semibold text-[var(--color-brand-primary)] uppercase tracking-wider">Overall Summary</p>
                  </div>
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{result.overallFeedback}</p>
                  <p className="mt-3 text-[11px] text-[var(--color-text-muted)] italic">
                    Based on 1,247 similar submissions · Your professor may grade differently
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── My Submissions Tab ────────────────────────────────────────────────────────

function MySubmissionsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const gradeColor = (pct: number) =>
    pct >= 90 ? 'var(--color-success)' : pct >= 75 ? 'var(--color-feature-orange)' : 'var(--color-danger)';

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Submissions', value: '3', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2', color: 'var(--color-feature-blue)' },
            { label: 'Avg. Predicted', value: '91%', icon: 'M18 20V10M12 20V4M6 20v-6', color: 'var(--color-success)' },
            { label: 'Avg. Confidence', value: '96.3%', icon: 'M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2C20 17.5 12 22 12 22z', color: 'var(--color-feature-teal)' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/40 p-4 flex items-center gap-3">
              <div className="size-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 15%, transparent)` }}>
                <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2">
                  <path d={s.icon} />
                </svg>
              </div>
              <div>
                <p className="text-[18px] font-bold text-[var(--color-text-primary)]">{s.value}</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Submission list */}
        <div className="space-y-2">
          {SAMPLE_SUBMISSIONS.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/40 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-[var(--color-bg-elevated)]/30 transition-colors"
              >
                <div
                  className="size-10 rounded-xl flex items-center justify-center shrink-0 text-[14px] font-black"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${gradeColor(sub.predictedGrade)} 15%, transparent)`,
                    color: gradeColor(sub.predictedGrade),
                  }}
                >
                  {sub.letterGrade}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">{sub.assignmentName}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{sub.classCode} · {sub.className}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold tabular-nums" style={{ color: gradeColor(sub.predictedGrade) }}>{sub.predictedGrade}%</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{sub.submittedAt}</p>
                </div>
                <svg
                  className={`size-4 shrink-0 text-[var(--color-text-muted)] transition-transform ${expanded === sub.id ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {expanded === sub.id && (
                <div className="border-t border-[var(--color-border-subtle)]/40 px-5 py-4 space-y-3 bg-[var(--color-bg-elevated)]/20">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold text-[var(--color-text-secondary)]">Prediction Details</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[var(--color-success)]/15 text-[var(--color-success)]">
                      <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
                      {sub.confidence.toFixed(1)}% confidence
                    </span>
                  </div>
                  <Progress value={sub.predictedGrade} max={100} className="h-2" />
                  <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]">
                    <span>0%</span><span>100%</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">Submitted {sub.submittedAt}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {SAMPLE_SUBMISSIONS.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">No submissions yet</p>
            <p className="text-[13px] text-[var(--color-text-muted)]">Grade an assignment to see your history here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── My Classes Tab ────────────────────────────────────────────────────────────

function MyClassesTab() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {CLASSES.map((cls) => (
            <div
              key={cls.id}
              className="rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/40 overflow-hidden"
            >
              <div className="h-1.5" style={{ backgroundColor: cls.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--color-text-muted)]">{cls.code}</p>
                    <p className="mt-0.5 text-[15px] font-bold text-[var(--color-text-primary)]">{cls.name}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{cls.professor}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${cls.color} 15%, transparent)`,
                      color: cls.color,
                    }}
                  >
                    {cls.assignments.length} assignments
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {cls.assignments.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 rounded-lg bg-[var(--color-bg-elevated)]/40 px-3 py-2">
                      <svg className="size-3.5 shrink-0 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">{a.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-[var(--color-text-muted)]">Due {a.dueDate}</p>
                        <p className="text-[10px] font-semibold text-[var(--color-text-secondary)]">{a.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'grade', label: 'Grade Assignment' },
  { id: 'submissions', label: 'My Submissions' },
  { id: 'classes', label: 'My Classes' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AssignmentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get('tab') as TabId) ?? 'grade';

  const setTab = (id: TabId) => {
    router.push(`?tab=${id}`, { scroll: false });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-[var(--color-border-subtle)]/30 px-6 py-[10px] flex items-center gap-4">
        <div className="size-9 rounded-xl flex items-center justify-center bg-[var(--color-feature-orange)]/15 shrink-0">
          <svg className="size-4.5 text-[var(--color-feature-orange)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="13" y2="16" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-bold text-[var(--color-text-primary)]">Assignment Grader</h1>
            <span className="hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[var(--color-feature-orange)]/15 text-[var(--color-feature-orange)] uppercase tracking-wider">
              AI-Powered
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)]">Upload your submission for instant AI feedback and grade prediction</p>
        </div>

        {/* Stats pills */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
            </svg>
            3 Submissions
          </span>
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-[var(--color-success)]/10 text-[var(--color-success)]">
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            75% Accuracy
          </span>
        </div>
      </header>

      {/* Tab bar */}
      <div className="shrink-0 flex gap-0 border-b border-[var(--color-border-subtle)]/30 px-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`px-4 py-2.5 text-[12px] font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'grade' && <GradeAssignmentTab />}
        {activeTab === 'submissions' && (
          <div className="h-full overflow-y-auto">
            <MySubmissionsTab />
          </div>
        )}
        {activeTab === 'classes' && (
          <div className="h-full overflow-y-auto">
            <MyClassesTab />
          </div>
        )}
      </div>
    </div>
  );
}
