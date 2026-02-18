'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

function InterviewPrepPageInner() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') as 'practice' | 'drills' | 'mock') || 'practice';

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)] py-[15.4px]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 shrink-0">
              <svg className="size-4 text-[var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Interview Prep</h1>
            <span className="rounded-full bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 px-3 py-0.5 text-xs font-semibold text-[var(--color-brand-primary)]">
              PlanIt AI
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        {tab === 'practice' && <PracticeChatTab />}
        {tab === 'drills' && <QuestionDrillsTab />}
        {tab === 'mock' && <MockInterviewTab />}
      </main>
    </div>
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

// ─── Mock Interview Data ──────────────────────────────────────────────────────

const INTERVIEW_QUESTIONS: Record<string, string[]> = {
  behavioral: [
    "Tell me about a time you had to work under significant pressure to meet a deadline. How did you handle it?",
    "Describe a situation where you had to convince a skeptical stakeholder or teammate. What was your approach?",
    "Walk me through a time you made a mistake at work or school. What did you learn from it?",
    "Tell me about your greatest professional or academic achievement and what made it possible.",
    "Why this role and this company specifically — what drew you here over other paths?",
  ],
  technical: [
    "Walk me through how you'd approach a completely unfamiliar problem — what's your process from start to finish?",
    "How do you prioritize when you have multiple urgent tasks from different stakeholders competing for your time?",
    "Describe a time you had to learn a new skill or tool quickly to complete a project. What was your approach?",
    "How would you explain a complex concept in your field to someone with no background in it?",
    "Walk me through a project or deliverable you're particularly proud of — what was your process and what made it strong?",
  ],
  mixed: [
    "Tell me about yourself — walk me through your background and what brought you here.",
    "Walk me through how you'd approach solving a problem you've never encountered before.",
    "Describe a time you demonstrated strong analytical or critical thinking under pressure.",
    "How do you handle competing priorities when multiple stakeholders have urgent, conflicting needs?",
    "Why this role and company specifically — what excites you about this opportunity?",
  ],
};

const AI_FEEDBACK: Record<string, { score: number; strength: string; improve: string }[]> = {
  behavioral: [
    { score: 82, strength: "Good structure using STAR framework — the situation and action were clearly defined.", improve: "The 'result' was vague. Quantify the outcome: mention a specific metric, timeline, or measurable impact to make it concrete." },
    { score: 76, strength: "Strong opening hook and confident tone throughout your response.", improve: "Spend more time on 'why this approach' — interviewers want to see your reasoning process, not just the outcome." },
    { score: 88, strength: "Excellent self-awareness in acknowledging the mistake and taking clear ownership.", improve: "Your 'what I learned' section was brief. Expand on how you applied the lesson in a subsequent situation — that's what makes it memorable." },
    { score: 91, strength: "Compelling achievement with specific outcomes — this will stand out among candidates.", improve: "Tie the achievement more explicitly to skills relevant to the role you're applying for: communication, execution, or analytical thinking." },
    { score: 85, strength: "Genuine enthusiasm and specific knowledge about the company came through clearly.", improve: "Differentiate your 'why this role' from 'why this company' more clearly — they're separate questions and both deserve their own answer." },
  ],
  technical: [
    { score: 79, strength: "You correctly identified the core problem and started with a structured framework before jumping to solutions.", improve: "After scoping the problem, walk through how you'd validate your approach early — interviewers want to see you avoid sunk cost thinking." },
    { score: 88, strength: "Clear prioritization logic with a strong focus on impact and urgency — this shows mature judgment.", improve: "Explicitly mention how you'd communicate trade-offs to stakeholders. Managing expectations is as important as managing the work itself." },
    { score: 84, strength: "Good instinct to break the skill into smaller components and find credible, structured resources.", improve: "Add a concrete example of how you applied what you learned under real pressure — execution matters as much as the learning strategy." },
    { score: 91, strength: "Excellent use of analogy to make the concept accessible without oversimplifying.", improve: "Check for comprehension mid-explanation. Strong communicators pause and ask 'does that track?' rather than delivering a monologue." },
    { score: 87, strength: "Strong project walkthrough with clear ownership, process, and measurable outcomes.", improve: "Be more explicit about what you'd do differently in hindsight — self-reflection and a growth mindset signal readiness for senior responsibility." },
  ],
  mixed: [
    { score: 86, strength: "Concise and well-structured with a clear narrative arc from background to present goals.", improve: "End your 'tell me about yourself' with a direct bridge to the opportunity: 'which is why I'm excited about this role specifically.'" },
    { score: 81, strength: "Good high-level framework — you defined the problem space before proposing solutions.", improve: "Walk through how you'd validate your solution early and what signals would tell you if you were heading in the wrong direction." },
    { score: 77, strength: "Solid STAR structure with a relevant example grounded in real experience.", improve: "The analytical component was understated. Describe the actual reasoning or data you used — specificity is what separates memorable answers." },
    { score: 93, strength: "Clear prioritization framework with proactive communication to all stakeholders — strong answer.", improve: "Add how you'd follow up after resolving the immediate conflict to prevent it from recurring — that's systems thinking, not just firefighting." },
    { score: 89, strength: "Authentic motivation with specific company knowledge referenced — this separates you from generic candidates.", improve: "Name a specific recent initiative, product, or project at the company and explain what resonated with you. It shows genuine research." },
  ],
};

type InterviewType = 'behavioral' | 'technical' | 'mixed';
type InterviewState = 'setup' | 'active' | 'results';

interface InterviewConfig {
  type: InterviewType;
  role: string;
  questionCount: number;
  tier: string;
}

interface AnsweredQuestion {
  question: string;
  answer: string;
  timeSpent: number;
  feedback: { score: number; strength: string; improve: string };
}

// ─── Mock Interview Tab ────────────────────────────────────────────────────────

function MockInterviewTab() {
  const [state, setState] = useState<InterviewState>('setup');
  const [config, setConfig] = useState<InterviewConfig>({
    type: 'mixed',
    role: 'Software Engineering',
    questionCount: 5,
    tier: 'Large Enterprise',
  });
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isThinking, setIsThinking] = useState(false);
  const [expandedResult, setExpandedResult] = useState<number | null>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterview = () => {
    const qs = INTERVIEW_QUESTIONS[config.type].slice(0, config.questionCount);
    setQuestions(qs);
    setCurrentIndex(0);
    setCurrentAnswer('');
    setAnswers([]);
    setTimeLeft(120);
    setState('active');
    timerRef.current = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
  };

  const submitAnswer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const feedbackBank = AI_FEEDBACK[config.type];
    const answered: AnsweredQuestion = {
      question: questions[currentIndex],
      answer: currentAnswer,
      timeSpent: 120 - timeLeft,
      feedback: feedbackBank[currentIndex % feedbackBank.length],
    };

    const newAnswers = [...answers, answered];

    if (currentIndex + 1 >= questions.length) {
      setAnswers(newAnswers);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setState('results');
      }, 1800);
    } else {
      setAnswers(newAnswers);
      setCurrentIndex((i) => i + 1);
      setCurrentAnswer('');
      setTimeLeft(120);
      timerRef.current = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const timerColor = timeLeft > 60 ? 'var(--color-success)' : timeLeft > 20 ? 'var(--color-feature-orange)' : 'var(--color-danger)';
  const overallScore = answers.length
    ? Math.round(answers.reduce((s, a) => s + a.feedback.score, 0) / answers.length)
    : 0;
  const scoreColor = overallScore >= 85 ? 'var(--color-success)' : overallScore >= 70 ? 'var(--color-feature-orange)' : 'var(--color-danger)';

  // ── Setup ──────────────────────────────────────────────────────────────────

  if (state === 'setup') {
    const ROLES = ['Software Engineering', 'Product Management', 'Consulting', 'Finance & Banking', 'Marketing & Strategy', 'Operations'];
    const TIERS = ['Large Enterprise', 'Mid-Size Company', 'Startup / High Growth', 'Big 4 / Big Tech'];
    const TYPES: { id: InterviewType; label: string; desc: string; color: string }[] = [
      { id: 'behavioral', label: 'Behavioral', desc: 'STAR-format soft skill questions', color: 'var(--color-feature-blue)' },
      { id: 'technical', label: 'Technical', desc: 'Finance & accounting concepts', color: 'var(--color-feature-teal)' },
      { id: 'mixed', label: 'Mixed', desc: 'Balanced real-interview format', color: 'var(--color-brand-primary)' },
    ];

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">Mock Interview</h2>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            Answer real interview questions under time pressure, then get AI feedback on every response.
          </p>
        </div>

        {/* Interview type */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Interview Type</p>
          <div className="grid grid-cols-3 gap-3">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setConfig((c) => ({ ...c, type: t.id }))}
                className={cn(
                  'rounded-xl border-2 p-4 text-left transition-all',
                  config.type === t.id
                    ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/8'
                    : 'border-[var(--color-border-subtle)]/50 hover:border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]/40'
                )}
              >
                <div className="size-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `color-mix(in srgb, ${t.color} 15%, transparent)` }}>
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2">
                    {t.id === 'behavioral' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
                    {t.id === 'technical' && <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>}
                    {t.id === 'mixed' && <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>}
                  </svg>
                </div>
                <p className="text-[13px] font-bold text-[var(--color-text-primary)]">{t.label}</p>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Role + Firm tier */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Target Role</p>
            <div className="flex flex-col gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setConfig((c) => ({ ...c, role: r }))}
                  className={cn(
                    'text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-all',
                    config.role === r
                      ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-secondary)]'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Company Type</p>
            <div className="flex flex-col gap-1.5">
              {TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setConfig((c) => ({ ...c, tier: t }))}
                  className={cn(
                    'text-left px-3 py-2 rounded-lg text-[12px] font-medium transition-all',
                    config.tier === t
                      ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-secondary)]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question count */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Number of Questions</p>
          <div className="flex gap-2">
            {[3, 5].map((n) => (
              <button
                key={n}
                onClick={() => setConfig((c) => ({ ...c, questionCount: n }))}
                className={cn(
                  'px-5 py-2 rounded-lg text-[13px] font-semibold transition-all',
                  config.questionCount === n
                    ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                    : 'border border-[var(--color-border-subtle)]/60 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'
                )}
              >
                {n} questions <span className="opacity-60 text-[11px]">(~{n * 2} min)</span>
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-xl border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)]/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">How it works</p>
          <div className="flex gap-4">
            {[
              { n: '1', label: 'Read the question', sub: '30s prep time' },
              { n: '2', label: 'Type your answer', sub: '2 min per question' },
              { n: '3', label: 'Get AI feedback', sub: 'Score + tips per answer' },
            ].map((step) => (
              <div key={step.n} className="flex-1 flex items-start gap-2">
                <span className="size-5 rounded-full bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-[var(--color-text-primary)]">{step.label}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start */}
        <button
          onClick={startInterview}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[14px] font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start {config.questionCount}-Question {config.type.charAt(0).toUpperCase() + config.type.slice(1)} Interview
        </button>
      </div>
    );
  }

  // ── Active Interview ────────────────────────────────────────────────────────

  if (state === 'active') {
    const progress = ((currentIndex) / questions.length) * 100;

    if (isThinking) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-2.5 rounded-full bg-[var(--color-brand-primary)] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-[13px] text-[var(--color-text-muted)]">Analyzing your responses…</p>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Progress bar + meta */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-[11px] font-semibold" style={{ color: timerColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-brand-primary)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Interviewer persona */}
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-surface)]/40 px-4 py-3">
          <div className="size-9 rounded-full bg-[var(--color-brand-primary)]/15 flex items-center justify-center shrink-0">
            <svg className="size-4.5 text-[var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[var(--color-text-primary)]">Alex Chen · {config.tier}</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">{config.role} Interviewer · PlanIt AI</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span className="text-[11px] text-[var(--color-success)] font-medium">Live</span>
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)]/50 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
            {config.type === 'behavioral' ? 'Behavioral' : config.type === 'technical' ? 'Technical' : currentIndex % 2 === 0 ? 'Behavioral' : 'Technical'} Question
          </p>
          <p className="text-[16px] font-semibold text-[var(--color-text-primary)] leading-relaxed">
            {questions[currentIndex]}
          </p>
        </div>

        {/* Timer ring visual */}
        <div className="flex items-center gap-3 px-1">
          <div
            className="size-3 rounded-full shrink-0 transition-colors"
            style={{ backgroundColor: timerColor }}
          />
          <div className="flex-1 h-1 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 120) * 100}%`, backgroundColor: timerColor }}
            />
          </div>
          <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: timerColor }}>
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Answer input */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Your Response</p>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here… Use the STAR format: Situation → Task → Action → Result"
            rows={6}
            className="w-full rounded-xl border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)]/40 px-4 py-3 text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 resize-none focus:outline-none focus:border-[var(--color-brand-primary)]/50 transition-colors"
          />
          <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{currentAnswer.length} characters</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={submitAnswer}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            {currentIndex + 1 >= questions.length ? (
              <>
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Finish Interview
              </>
            ) : (
              <>
                Next Question
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            )}
          </button>
          <button
            onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setState('setup'); }}
            className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            Exit interview
          </button>
        </div>
      </div>
    );
  }

  // ── Results ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Score hero */}
      <div className="rounded-2xl border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)]/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Interview Score</p>
            <div className="mt-1 flex items-end gap-3">
              <span className="text-[52px] font-black leading-none" style={{ color: scoreColor }}>{overallScore}</span>
              <span className="text-[20px] font-bold text-[var(--color-text-muted)] mb-1">/100</span>
            </div>
          </div>
          <div className="text-right">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ color: scoreColor, backgroundColor: `color-mix(in srgb, ${scoreColor} 15%, transparent)` }}
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: scoreColor }} />
              {overallScore >= 85 ? 'Strong' : overallScore >= 70 ? 'Solid' : 'Needs Work'}
            </span>
            <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">{answers.length} questions · {config.tier}</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${overallScore}%`, backgroundColor: scoreColor }} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-border-subtle)]/30">
          {[
            { label: 'Avg Score', value: `${overallScore}/100` },
            { label: 'Type', value: config.type.charAt(0).toUpperCase() + config.type.slice(1) },
            { label: 'Role', value: config.role.split(' ').slice(-1)[0] },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{s.value}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-question breakdown */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Question-by-Question Feedback</p>
        <div className="space-y-2">
          {answers.map((a, i) => {
            const sc = a.feedback.score;
            const c = sc >= 85 ? 'var(--color-success)' : sc >= 70 ? 'var(--color-feature-orange)' : 'var(--color-danger)';
            const isOpen = expandedResult === i;
            return (
              <div key={i} className="rounded-xl border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)]/40 overflow-hidden">
                <button
                  onClick={() => setExpandedResult(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[var(--color-bg-elevated)]/30 transition-colors"
                >
                  <div
                    className="size-9 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-black"
                    style={{ backgroundColor: `color-mix(in srgb, ${c} 15%, transparent)`, color: c }}
                  >
                    {sc}
                  </div>
                  <p className="flex-1 text-[12px] font-semibold text-[var(--color-text-primary)] truncate">{a.question}</p>
                  <svg
                    className={cn('size-4 shrink-0 text-[var(--color-text-muted)] transition-transform', isOpen && 'rotate-180')}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-[var(--color-border-subtle)]/40 px-5 py-4 space-y-4 bg-[var(--color-bg-elevated)]/20">
                    {/* Score bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] mb-1">
                        <span>Score</span>
                        <span className="font-bold" style={{ color: c }}>{sc}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${sc}%`, backgroundColor: c }} />
                      </div>
                    </div>

                    {/* Your answer */}
                    {a.answer && (
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mb-1.5">Your answer</p>
                        <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">{a.answer}</p>
                      </div>
                    )}

                    {/* AI feedback */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-[var(--color-success)]/8 border border-[var(--color-success)]/20 p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <svg className="size-3 text-[var(--color-success)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-success)]">Strength</p>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{a.feedback.strength}</p>
                      </div>
                      <div className="rounded-lg bg-[var(--color-feature-orange)]/8 border border-[var(--color-feature-orange)]/20 p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <svg className="size-3 text-[var(--color-feature-orange)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-feature-orange)]">Improve</p>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{a.feedback.improve}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Retry */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={() => setState('setup')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Try Again
        </button>
        <button
          onClick={() => setState('setup')}
          className="px-5 py-2.5 rounded-xl border border-[var(--color-border-subtle)]/60 text-[13px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-all"
        >
          Change Settings
        </button>
      </div>
    </div>
  );
}

export default function InterviewPrepPage() {
  return (
    <Suspense fallback={<div className="flex h-full" />}>
      <InterviewPrepPageInner />
    </Suspense>
  );
}
