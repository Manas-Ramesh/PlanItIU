'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const SUBTABS = [
  {
    id: 'practice',
    label: 'Practice Chat',
    icon: (
      <svg className="size-[13px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'drills',
    label: 'Question Drills',
    icon: (
      <svg className="size-[13px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'mock',
    label: 'Mock Interview',
    icon: (
      <svg className="size-[13px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
] as const;

/* ─────────────────────────────────────────────
   Practice Chat Data
───────────────────────────────────────────── */

const PRACTICE_TOPICS = ['General', 'M&A', 'Valuation', 'Capital Markets', 'Restructuring', 'Behavioral'] as const;
type PracticeTopic = typeof PRACTICE_TOPICS[number];

interface PracticeChatMessage { id: string; role: 'user' | 'ai'; content: string }

const TOPIC_SUGGESTIONS: Record<PracticeTopic, string[]> = {
  General: [
    'What should I expect in a first-round IB interview?',
    'How do I structure my 2-minute pitch?',
    'What makes a strong candidate stand out?',
  ],
  'M&A': [
    'Walk me through an M&A deal from pitch to close',
    'What is accretion/dilution and why does it matter?',
    'What are the most common reasons M&A deals fail?',
  ],
  Valuation: [
    'Explain the three valuation methodologies',
    'When would you use EV/EBITDA vs P/E?',
    'Walk me through building a DCF from scratch',
  ],
  'Capital Markets': [
    'Walk me through the IPO process',
    "What's the difference between ECM and DCM?",
    'Explain the role of a bookrunner in a deal',
  ],
  Restructuring: [
    'What triggers a company to consider restructuring?',
    'Explain DIP financing and why it exists',
    'Walk me through the Chapter 11 process',
  ],
  Behavioral: [
    "Help me answer 'Tell me about yourself'",
    "How should I frame 'Why investment banking?'",
    'Practice a STAR-format leadership answer with me',
  ],
};

function getPracticeAIResponse(input: string, topic: PracticeTopic): string {
  const lower = input.toLowerCase();

  if (topic === 'Behavioral' || lower.includes('tell me about') || lower.includes('why banking') || lower.includes('star') || lower.includes('leadership')) {
    return "For behavioral rounds, structure is everything. The STAR framework is your baseline — but the strongest answers go further:\n\n**Situation** → Set context in 1–2 sentences. Don't over-explain.\n**Task** → What specifically were you responsible for?\n**Action** → This is 60% of your answer. Be specific about your individual contribution, not the team's.\n**Result** → Quantify wherever possible. Numbers win over adjectives every time.\n\nFor 'tell me about yourself': 2–3 sentences on background → 1–2 high-impact experiences → bridge to this specific role. End with forward momentum, not your resume.\n\nFor 'why banking': avoid clichés ('I love finance'). Cite the analytical rigor, the exposure to deals at scale, and the accelerated learning curve — then tie it to something specific about this firm.\n\nDraft your answer here and I'll give you line-by-line feedback.";
  }

  if (topic === 'M&A' || lower.includes('m&a') || lower.includes('merger') || lower.includes('acquisition') || lower.includes('accretion') || lower.includes('synerg')) {
    return "M&A is one of the most tested areas in technical rounds. Core framework:\n\n**Deal motivation:**\n• Revenue synergies — cross-sell, new markets, pricing power\n• Cost synergies — headcount reduction, overlapping functions, procurement scale\n• Strategic — acqui-hire, IP acquisition, market share consolidation\n\n**Accretion / Dilution:**\nA deal is accretive if the acquirer's EPS increases post-close. The key test: is the after-tax cost of financing lower than the target's earnings yield?\n• All-cash: compare after-tax cost of debt vs target Net Income / Purchase Price\n• All-stock: if acquirer P/E > target P/E → accretive (you're issuing expensive paper to buy cheaper earnings)\n• Synergies can flip a dilutive deal accretive\n\nWhat aspect do you want to drill deeper — the merger model math, deal process, or a specific question type?";
  }

  if (topic === 'Valuation' || lower.includes('dcf') || lower.includes('valuation') || lower.includes('ebitda') || lower.includes('comps') || lower.includes('lbo') || lower.includes('wacc')) {
    return "The three valuation methodologies and when to use them:\n\n**1. DCF (Intrinsic Value)**\n→ Best for stable, predictable cash flow businesses\n→ Most sensitive to assumptions: WACC and terminal growth rate dominate output\n→ Classic question: 'What happens to equity value if WACC increases?' (it falls — future cash flows are worth less today)\n\n**2. Comparable Company Analysis (Trading Comps)**\n→ Uses public market multiples — EV/EBITDA, EV/Revenue, P/E\n→ Reflects current market sentiment — can be distorted by cycles\n→ Requires truly comparable peers: same size, growth profile, margin structure\n\n**3. Precedent Transactions (Deal Comps)**\n→ Historical M&A deal multiples\n→ Typically highest — includes a control premium (20–40% over market price)\n→ Less liquid market + strategic value + synergy pricing = premium to trading comps\n\nWalk me through which methodology you want to practice.";
  }

  if (topic === 'Capital Markets' || lower.includes('ipo') || lower.includes('ecm') || lower.includes('dcm') || lower.includes('bookrunner') || lower.includes('bond') || lower.includes('equity offering')) {
    return "Capital markets questions test how companies raise capital. Core frameworks:\n\n**ECM (Equity Capital Markets):**\n• IPOs, follow-on offerings (FPOs), block trades, convertibles\n• Pricing tension: issuer wants high price, investors want discount for risk\n• Bookrunner builds the order book, prices the deal, provides aftermarket stabilization\n\n**DCM (Debt Capital Markets):**\n• Investment grade (BBB-/Baa3 and above) vs high yield (below IG)\n• Key terms: coupon, maturity, call provisions, covenants\n• Spread over Treasuries reflects the issuer's credit risk\n\n**IPO Process (simplified):**\n1. Mandate won → 2. Due diligence + S-1 registration filing → 3. SEC review + roadshow → 4. Pricing (night before) → 5. Trading begins\n\nWhat specific area do you want to practice — ECM, DCM, or the deal process?";
  }

  if (topic === 'Restructuring' || lower.includes('restructur') || lower.includes('bankruptcy') || lower.includes('chapter 11') || lower.includes('dip') || lower.includes('waterfall')) {
    return "Restructuring is one of the most analytically demanding verticals. Core concepts:\n\n**When does restructuring happen?**\n• Overleveraged balance sheet — often post-LBO or following a downturn\n• Liquidity crisis: inability to service near-term debt maturities\n• Operational decline that capital structure relief alone can't fix\n\n**Out-of-court vs Chapter 11:**\n• Out-of-court: faster, cheaper, but requires near-universal creditor consensus — hard to achieve\n• Chapter 11: automatic stay on all claims, DIP financing available, ability to cramdown holdouts\n\n**DIP Financing:**\nDebtor-in-possession financing — a senior secured credit facility provided during bankruptcy. It has priority over all pre-petition claims. It keeps the company operating while restructuring.\n\n**Waterfall Analysis:**\nThe core analytical tool. Trace enterprise value recovery down the capital structure — senior secured → junior secured → unsecured creditors → equity. Where value 'runs out' determines which class gets impaired.\n\nWant to walk through a recovery waterfall example with numbers?";
  }

  // General / fallback
  return "In a first-round interview, expect a mix of technical and behavioral questions:\n\n**Technical (60–70% of the round):**\n• Accounting: 3-statement linkages, working capital movements, D&A / CapEx impact\n• Valuation: walk me through a DCF, when to use comps vs precedents\n• M&A: accretion/dilution, deal rationale, synergy analysis\n• LBO: why PE firms use leverage, how returns are generated\n\n**Behavioral (30–40%):**\n• Why banking / why this firm (have 2–3 firm-specific reasons ready)\n• Walk me through your background\n• STAR-format: leadership, challenge, conflict, achievement examples\n\n**To stand out:**\n• Know every line of your resume cold — it's all fair game\n• Have specific deal knowledge about the firm: recent transactions, coverage focus, culture\n• Practice out loud — fluency signals confidence as much as content does\n\nWhat area would you like to drill?";
}

/* ─────────────────────────────────────────────
   Drill Packs Data
───────────────────────────────────────────── */

type Difficulty = 'easy' | 'medium' | 'hard';
interface DrillQuestion { id: string; difficulty: Difficulty; q: string; a: string }
interface DrillPack { id: string; title: string; category: string; color: string; questions: DrillQuestion[] }

const DRILL_PACKS: DrillPack[] = [
  {
    id: 'accounting',
    title: 'Accounting Fundamentals',
    category: 'Technical',
    color: 'var(--color-feature-teal)',
    questions: [
      { id: 'ac1', difficulty: 'easy', q: 'Walk me through the three financial statements.', a: 'Income Statement: revenue → expenses → net income over a period. Balance Sheet: snapshot of assets, liabilities, and equity at a point in time. Cash Flow Statement: reconciles net income to actual cash — starts with net income, adds back non-cash charges (D&A), adjusts for working capital changes, then captures investing (CapEx) and financing (debt/equity) activities. The three link: net income flows into retained earnings on the BS; ending cash on the CFS = cash line on the BS.' },
      { id: 'ac2', difficulty: 'medium', q: 'What happens to the three statements if D&A increases by $10?', a: 'IS: EBIT falls $10, taxes fall $3 (at 30% rate), net income falls $7. BS: PP&E falls $10 (accumulated depreciation); retained earnings fall $7; deferred tax liability falls $3. CFS: net income is -$7, but D&A is added back (+$10), so operating cash flow is actually +$3. Net cash effect: +$3. Key insight — D&A is non-cash, so it reduces tax (a real cash benefit) without being a real cash outflow.' },
      { id: 'ac3', difficulty: 'medium', q: 'How does CapEx flow through the three statements?', a: 'IS: No direct impact — only D&A hits the income statement (CapEx is capitalized, not expensed). BS: Gross PP&E increases by the CapEx amount. CFS: CapEx is a cash outflow in investing activities. Net effect: cash decreases and PP&E increases by the same amount. The CapEx eventually flows through the IS over time as depreciation.' },
      { id: 'ac4', difficulty: 'hard', q: 'How does an increase in accounts receivable affect the statements?', a: 'IS: No effect — revenue is recognized when earned, not when collected (accrual accounting). BS: Accounts receivable (current asset) increases. CFS: An increase in AR is a use of cash in working capital — it reduces operating cash flow. This represents the company having earned revenue but not yet received the cash. Important: rising AR relative to revenue can signal collection problems or aggressive revenue recognition.' },
      { id: 'ac5', difficulty: 'hard', q: 'A company takes on $100 of debt to buy equipment. Walk me through the impact.', a: 'BS at issuance: Cash +$100 (asset), Long-term Debt +$100 (liability) — balance sheet stays balanced. Then CapEx is spent: PP&E +$100, Cash -$100. Net BS impact: PP&E +$100, LT Debt +$100. IS: Interest expense begins accruing each period (reduces pre-tax income). CFS: Debt proceeds are a financing inflow (+$100); CapEx is an investing outflow (-$100). Future periods: D&A on the equipment flows through IS and CFS.' },
    ],
  },
  {
    id: 'valuation',
    title: 'Valuation Methods',
    category: 'Technical',
    color: 'var(--color-brand-primary)',
    questions: [
      { id: 'v1', difficulty: 'easy', q: 'What are the three main valuation methodologies?', a: '1. DCF (Discounted Cash Flow): intrinsic value — project FCFs and discount at WACC. Most sensitive to assumptions; stand-alone analysis. 2. Comparable Company Analysis: apply public market trading multiples (EV/EBITDA, P/E) to the target. Reflects real-time market sentiment but can be distorted by cycles. 3. Precedent Transaction Analysis: apply M&A deal multiples from historical transactions. Highest methodology — includes a control premium (20–40% above market) paid by acquirers.' },
      { id: 'v2', difficulty: 'medium', q: 'When would you use EV/EBITDA vs P/E?', a: 'EV/EBITDA is capital-structure neutral (debt affects EBITDA minimally), so it\'s ideal for comparing companies with different leverage levels or across industries. P/E is an equity metric — it\'s affected by capital structure (interest reduces net income), so comparing high-leverage vs low-leverage companies using P/E is misleading. Use EV/EBITDA in M&A and most sell-side analysis. P/E is common in equity research for stable, profitable businesses (consumer, financials). Also: EV/EBITDA works even when EPS is negative; P/E doesn\'t.' },
      { id: 'v3', difficulty: 'hard', q: 'Walk me through a DCF in 5 steps.', a: '1. Project unlevered free cash flows (5–10 years): EBIT(1-t) + D&A – CapEx – ΔNWC. 2. Calculate WACC: weighted blend of cost of equity (CAPM: Rf + β×ERP) and after-tax cost of debt (Rd×(1-t)), weighted by market-value capital structure. 3. Calculate terminal value: Gordon Growth [FCF×(1+g)/(WACC-g)] or exit multiple (EV/EBITDA × normalized EBITDA). 4. Discount all FCFs and terminal value to present value at WACC. 5. Sum to Enterprise Value → +cash –debt → Equity Value → ÷shares = intrinsic price per share. Run sensitivity on WACC and terminal growth to show the value range.' },
      { id: 'v4', difficulty: 'medium', q: 'Why do precedent transactions yield higher multiples than trading comps?', a: 'Two reasons: 1. Control premium — acquirers pay above market price (typically 20–40%) to gain control of a company. Trading comps reflect minority interest pricing — what you pay for a small, non-controlling stake. 2. Synergy pricing — strategic acquirers bake in the value of synergies (cost cuts, revenue uplift) when determining what they\'re willing to pay. This further inflates deal multiples above standalone public valuations. Combined: you\'re buying the whole company + paying for expected value creation = premium.' },
    ],
  },
  {
    id: 'ma',
    title: 'M&A Concepts',
    category: 'Technical',
    color: 'var(--color-feature-blue)',
    questions: [
      { id: 'ma1', difficulty: 'easy', q: 'What are the main motivations for an acquisition?', a: 'Strategic: enter new markets, acquire technology or IP, eliminate a competitor, talent acquisition (acqui-hire). Financial: deploy excess cash at returns above cost of capital, acquire undervalued assets, optimize capital structure. Synergies: Revenue synergies — cross-selling, pricing power, geographic expansion. Cost synergies — eliminate overlapping headcount, consolidate facilities, procurement leverage. Key: the acquirer must believe the combined entity is worth more than the standalone sum of parts — otherwise they\'re destroying value.' },
      { id: 'ma2', difficulty: 'medium', q: 'What is accretion/dilution and how do you determine it?', a: 'A deal is accretive if the acquirer\'s EPS increases post-acquisition; dilutive if EPS falls. The shortcut test: compare the after-tax cost of financing with the target\'s earnings yield (NI / Purchase Price). If financing cost < earnings yield → accretive. If financing cost > earnings yield → dilutive. For all-stock: if acquirer P/E > target P/E → accretive (issuing expensive paper for cheaper earnings). Synergies improve accretion; goodwill amortization (under IFRS) and financing cost hurt it. Always note: dilutive deals can still be strategically sound if they create long-term value.' },
      { id: 'ma3', difficulty: 'hard', q: 'What is a merger model and what does it output?', a: 'A merger model (or accretion/dilution model) combines the acquirer and target\'s financials to determine the impact on the acquirer\'s EPS. Key steps: 1. Determine purchase price and financing mix (cash / debt / stock). 2. Calculate financing costs (interest on debt, dilution from new shares). 3. Add target revenue/EBITDA/net income to acquirer. 4. Add synergies (net of integration costs). 5. Calculate pro-forma EPS vs. standalone EPS. Output: accretion/dilution in EPS ($ and %) and the breakeven synergies required to make the deal EPS-neutral. Also models the pro-forma balance sheet (goodwill, intangibles, debt levels).' },
    ],
  },
  {
    id: 'lbo',
    title: 'LBO Fundamentals',
    category: 'Technical',
    color: 'var(--color-feature-purple)',
    questions: [
      { id: 'l1', difficulty: 'easy', q: 'What is an LBO and why do PE firms use leverage?', a: 'A leveraged buyout is the acquisition of a company using a significant amount of borrowed capital, with the target\'s assets and cash flows as collateral. PE firms use leverage for three reasons: 1. Return amplification — the same absolute gain on a smaller equity check produces a higher IRR. 2. Tax shield — interest expense is tax-deductible, lowering the effective cost of debt. 3. Discipline — high debt payments force management to generate cash flow and eliminate waste. The equity check is typically 30–40% of total deal value; debt is 60–70%.' },
      { id: 'l2', difficulty: 'medium', q: 'What makes a good LBO candidate?', a: 'Strong, predictable free cash flow (to service debt). Low existing leverage (room to add more). Defensible market position — pricing power, switching costs, recurring revenue. Potential for operational improvement: margin expansion, cost reduction, add-on acquisitions. Asset-light model preferred — CapEx reduces cash available for debt paydown. Hard assets are useful as debt collateral. Non-cyclical business or recession-resistant demand. Willing, aligned management team. Classic targets: software with high retention, industrial services, consumer staples, healthcare services.' },
      { id: 'l3', difficulty: 'hard', q: 'Walk me through the basic LBO returns math.', a: 'LBO returns (IRR / MOIC) come from three sources: 1. EBITDA growth — if EBITDA grows, enterprise value grows proportionally at the same multiple. 2. Multiple expansion — buy at 7x, sell at 9x EBITDA → significant EV uplift. 3. Debt paydown — every dollar of principal repaid flows directly to equity value. Example: Buy at $500M EV (7× $70M EBITDA). Finance with $350M debt / $150M equity. Over 5 years: EBITDA grows to $100M, sell at 8× = $800M EV. Repaid $200M debt → $250M remains. Equity proceeds = $800M – $250M = $550M. MOIC = $550M / $150M = 3.7×, IRR ≈ 30%.' },
    ],
  },
  {
    id: 'behavioral',
    title: 'Behavioral STAR',
    category: 'Behavioral',
    color: 'var(--color-feature-pink)',
    questions: [
      { id: 'b1', difficulty: 'easy', q: "Tell me about yourself.", a: "Framework: background (2 sentences) → 2 high-impact experiences with results → bridge to this role. Keep under 90 seconds. End with a forward-looking hook: 'which is why I'm particularly excited about this opportunity.' Avoid: chronological resume recap, going back to high school, vague adjectives ('I'm hardworking'). Strong openers lead with an achievement or a specific passion, not 'I grew up in…' Interviewers want narrative, not biography." },
      { id: 'b2', difficulty: 'medium', q: "Describe a time you worked under significant pressure.", a: "STAR structure: Situation — set the stakes clearly (what was the deadline, what were the consequences of failure?). Task — what specifically were you accountable for? Action — be granular: what decisions did you make, what did you reprioritize, what did you sacrifice to hit the goal? Result — quantify: delivered X in Y days, saved Z hours. Key insight: interviewers want to see your judgment under pressure, not just that you worked hard. Show the trade-offs you made and why." },
      { id: 'b3', difficulty: 'medium', q: "Why investment banking? Why this firm?", a: "'Why banking' should be specific and personal: the analytical rigor + client advisory combination, exposure to consequential transactions, the learning curve compressed into 2 years. Avoid: 'I love finance' or 'I want to learn.' 'Why this firm' is the real differentiator — cite a specific deal they advised on, a person you met in coffee chats, the group's industry focus or culture. Banks are won by candidates who clearly want that specific firm over others. Generic answers are immediately spotted and kill candidacy." },
      { id: 'b4', difficulty: 'hard', q: "Tell me about a time you failed or made a significant mistake.", a: "This tests self-awareness and growth mindset. Structure: own the mistake clearly and early — don't deflect. Explain what went wrong and specifically what your role was. Describe what you learned — be precise, not generic ('I learned to communicate better'). Show how you applied the lesson in a subsequent situation. Key: the best answers treat failure as a teachable moment with a concrete behavioral change. Avoid mistakes that signal a core character flaw (dishonesty, lack of effort). Moderate stakes + genuine reflection + tangible growth = strong answer." },
    ],
  },
];

/* ─────────────────────────────────────────────
   Mock Interview Data (unchanged)
───────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────
   Page Shell
───────────────────────────────────────────── */

function InterviewPrepPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = (searchParams.get('tab') as 'practice' | 'drills' | 'mock') || 'practice';

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

      {/* Content — tabs manage their own scroll/padding */}
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {tab === 'practice' && <PracticeChatTab />}
        {tab === 'drills' && <QuestionDrillsTab />}
        {tab === 'mock' && (
          <div className="flex-1 overflow-y-auto p-6">
            <MockInterviewTab />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Practice Chat Tab
───────────────────────────────────────────── */

function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
                : <span key={j}>{part}</span>
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

function PracticeChatTab() {
  const [topic, setTopic] = useState<PracticeTopic>('General');
  const [messages, setMessages] = useState<PracticeChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(m => [...m, { id: Date.now().toString(), role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = getPracticeAIResponse(text, topic);
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: 'ai', content: response }]);
      setIsTyping(false);
    }, 700 + Math.random() * 500);
  }, [isTyping, topic]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Topic bar */}
      <div className="shrink-0 border-b border-[var(--color-border-subtle)]/30 px-5 py-2 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] shrink-0">Topic</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRACTICE_TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTopic(t); setMessages([]); }}
              className={cn(
                'rounded-full px-3 py-1 text-[11px] font-semibold transition-all',
                topic === t
                  ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="ml-auto shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)]/60 bg-[var(--color-bg-surface)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload PDF
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-6 max-w-lg mx-auto text-center">
            <div className="size-14 rounded-2xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center">
              <svg className="size-7 text-[var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[var(--color-text-primary)]">Practice with Alex</h3>
              <p className="mt-1 text-[12px] text-[var(--color-text-muted)] leading-relaxed">
                Ask anything about {topic} interviews — questions to expect, how to answer them, or get feedback on your pitch.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {TOPIC_SUGGESTIONS[topic].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="text-left rounded-xl border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)]/60 px-4 py-3 text-[12px] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-primary)]/30 hover:bg-[var(--color-brand-primary)]/5 hover:text-[var(--color-text-primary)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-5 py-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
                <div className={cn(
                  'size-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold',
                  msg.role === 'ai'
                    ? 'bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 text-[var(--color-brand-primary)]'
                    : 'bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]'
                )}>
                  {msg.role === 'ai' ? 'AI' : 'Me'}
                </div>
                <div className={cn(
                  'max-w-[78%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed',
                  msg.role === 'ai'
                    ? 'bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]/50 text-[var(--color-text-primary)] rounded-tl-sm'
                    : 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] rounded-tr-sm'
                )}>
                  {msg.role === 'ai' ? <FormattedText text={msg.content} /> : msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="size-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 text-[var(--color-brand-primary)]">AI</div>
                <div className="rounded-2xl rounded-tl-sm bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]/50 px-4 py-3.5">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="size-1.5 rounded-full bg-[var(--color-text-muted)]/50 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[var(--color-border-subtle)]/30 px-5 py-3 bg-[var(--color-bg-base)]">
        <div className="max-w-2xl mx-auto flex items-end gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-2.5 focus-within:border-[var(--color-brand-primary)]/40 transition-colors">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={`Ask about ${topic} interviews…`}
            className="flex-1 resize-none bg-transparent text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/60 outline-none max-h-32"
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={!input.trim() || isTyping}
            className="shrink-0 flex size-8 items-center justify-center rounded-lg bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Question Drills Tab
───────────────────────────────────────────── */

function DrillPackSidebar({ selected, onSelect }: { selected: DrillPack; onSelect: (d: DrillPack) => void }) {
  return (
    <aside className="w-[188px] shrink-0 border-r border-[var(--color-border-subtle)]/30 overflow-y-auto bg-[var(--color-bg-base)]">
      <div className="px-3 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/60 px-2">Drill Packs</p>
      </div>
      <ul className="px-2 pb-3 space-y-1">
        {DRILL_PACKS.map((pack) => (
          <li key={pack.id}>
            <button
              type="button"
              onClick={() => onSelect(pack)}
              className={cn(
                'w-full text-left rounded-lg px-2.5 py-2.5 transition-colors',
                selected.id === pack.id
                  ? 'bg-[var(--color-brand-primary)]/8 border border-[var(--color-brand-primary)]/20'
                  : 'hover:bg-[var(--color-bg-surface)]/60 border border-transparent'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full" style={{ background: pack.color }} />
                <span className={cn(
                  'text-[12px] font-medium truncate',
                  selected.id === pack.id ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                )}>
                  {pack.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 ml-4">
                <p className="text-[10px] text-[var(--color-text-muted)]">{pack.questions.length} questions</p>
                <span className={cn(
                  'text-[9px] font-semibold rounded-full px-1.5 py-px',
                  pack.category === 'Behavioral'
                    ? 'bg-[var(--color-feature-pink)]/15 text-[var(--color-feature-pink)]'
                    : 'bg-[var(--color-feature-blue)]/15 text-[var(--color-feature-blue)]'
                )}>
                  {pack.category}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'var(--color-feature-teal)',
  medium: 'var(--color-feature-orange)',
  hard: 'var(--color-danger)',
};

function QuestionDrillsTab() {
  const [selectedPack, setSelectedPack] = useState<DrillPack>(DRILL_PACKS[0]);
  const [diffFilter, setDiffFilter] = useState<'all' | Difficulty>('all');
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [review, setReview] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const filteredQuestions = selectedPack.questions.filter(
    q => diffFilter === 'all' || q.difficulty === diffFilter
  );

  const changePack = (pack: DrillPack) => {
    setSelectedPack(pack);
    setIndex(0);
    setRevealed(false);
    setKnown(new Set());
    setReview(new Set());
    setDone(false);
    setDiffFilter('all');
  };

  const changeDiff = (d: 'all' | Difficulty) => {
    setDiffFilter(d);
    setIndex(0);
    setRevealed(false);
    setKnown(new Set());
    setReview(new Set());
    setDone(false);
  };

  const advance = (gotIt: boolean) => {
    const q = filteredQuestions[index];
    if (gotIt) setKnown(s => new Set([...s, q.id]));
    else setReview(s => new Set([...s, q.id]));
    setRevealed(false);
    setTimeout(() => {
      if (index + 1 >= filteredQuestions.length) setDone(true);
      else setIndex(i => i + 1);
    }, 150);
  };

  const restart = () => {
    setIndex(0);
    setRevealed(false);
    setKnown(new Set());
    setReview(new Set());
    setDone(false);
  };

  const total = filteredQuestions.length;
  const card = filteredQuestions[index];
  const knownPct = total > 0 ? Math.round((known.size / total) * 100) : 0;

  return (
    <div className="flex h-full">
      <DrillPackSidebar selected={selectedPack} onSelect={changePack} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Pack header + difficulty filter */}
        <div className="shrink-0 border-b border-[var(--color-border-subtle)]/30 px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full shrink-0" style={{ background: selectedPack.color }} />
            <span className="text-[13px] font-bold text-[var(--color-text-primary)]">{selectedPack.title}</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => changeDiff(d)}
                className={cn(
                  'rounded-full px-3 py-1 text-[11px] font-semibold capitalize transition-all',
                  diffFilter === d
                    ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                    : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                )}
              >
                {d === 'all' ? 'All' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Drill area */}
        {total === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[13px] text-[var(--color-text-muted)]">No questions match this filter.</p>
          </div>
        ) : done ? (
          /* Results screen */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-sm w-full space-y-5 text-center">
              <div className="text-4xl">{knownPct >= 80 ? '🎉' : knownPct >= 50 ? '💪' : '📚'}</div>
              <div>
                <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">Drill Complete</h2>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">{selectedPack.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--color-feature-green)]/30 bg-[var(--color-feature-green)]/5 p-4">
                  <p className="text-2xl font-bold text-[var(--color-feature-green)]">{known.size}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Got it</p>
                </div>
                <div className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-4">
                  <p className="text-2xl font-bold text-[var(--color-danger)]">{review.size}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Review</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--color-feature-green)] transition-all" style={{ width: `${knownPct}%` }} />
                </div>
                <p className="text-[12px] text-[var(--color-text-secondary)]">{knownPct}% confident</p>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={restart}
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Drill Again
                </button>
                {review.size > 0 && (
                  <button
                    type="button"
                    onClick={restart}
                    className="px-5 py-2.5 rounded-xl border border-[var(--color-border-subtle)]/60 text-[13px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-all"
                  >
                    Retry Review ({review.size})
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Active drill */
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 gap-5">
            {/* Progress */}
            <div className="w-full max-w-xl flex items-center justify-between">
              <div className="flex gap-1">
                {filteredQuestions.map((q, i) => (
                  <span
                    key={q.id}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i < index
                        ? (known.has(q.id) ? 'bg-[var(--color-feature-green)] w-5' : 'bg-[var(--color-danger)]/70 w-5')
                        : i === index ? 'bg-[var(--color-brand-primary)] w-5' : 'bg-[var(--color-bg-elevated)] w-3'
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color: DIFFICULTY_COLORS[card.difficulty],
                    backgroundColor: `color-mix(in srgb, ${DIFFICULTY_COLORS[card.difficulty]} 12%, transparent)`,
                  }}
                >
                  {card.difficulty}
                </span>
                <p className="text-[11px] text-[var(--color-text-muted)]">{index + 1} / {total}</p>
              </div>
            </div>

            {/* Question card */}
            <div
              className="relative w-full max-w-xl cursor-pointer select-none [perspective:1200px]"
              style={{ height: revealed ? 'auto' : '220px' }}
              onClick={() => !revealed && setRevealed(true)}
            >
              {!revealed ? (
                <div className="h-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] flex flex-col items-center justify-center px-10 shadow-sm">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/50 mb-4">Question</span>
                  <p className="text-[16px] font-semibold text-[var(--color-text-primary)] text-center leading-snug">{card.q}</p>
                  <span className="mt-6 text-[11px] text-[var(--color-text-muted)]/40">Click to reveal model answer</span>
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/4 overflow-hidden shadow-sm">
                  <div className="border-b border-[var(--color-brand-primary)]/15 px-6 py-4">
                    <p className="text-[13px] font-semibold text-[var(--color-text-primary)] leading-snug">{card.q}</p>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-primary)]/60 mb-3">Model Answer</p>
                    <p className="text-[13px] text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">{card.a}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {revealed ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => advance(false)}
                  className="flex items-center gap-2 rounded-xl border-2 border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 px-6 py-3 text-[13px] font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Review Later
                </button>
                <button
                  type="button"
                  onClick={() => advance(true)}
                  className="flex items-center gap-2 rounded-xl border-2 border-[var(--color-feature-green)]/30 bg-[var(--color-feature-green)]/5 px-6 py-3 text-[13px] font-semibold text-[var(--color-feature-green)] hover:bg-[var(--color-feature-green)]/10 transition-colors"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Got It
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-[var(--color-text-muted)]/50">Attempt the answer in your head, then click the card to reveal</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mock Interview Tab (unchanged)
───────────────────────────────────────────── */

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
        <div>
          <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">Mock Interview</h2>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            Answer real interview questions under time pressure, then get AI feedback on every response.
          </p>
        </div>

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

        <div className="rounded-2xl border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)]/50 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
            {config.type === 'behavioral' ? 'Behavioral' : config.type === 'technical' ? 'Technical' : currentIndex % 2 === 0 ? 'Behavioral' : 'Technical'} Question
          </p>
          <p className="text-[16px] font-semibold text-[var(--color-text-primary)] leading-relaxed">
            {questions[currentIndex]}
          </p>
        </div>

        <div className="flex items-center gap-3 px-1">
          <div className="size-3 rounded-full shrink-0 transition-colors" style={{ backgroundColor: timerColor }} />
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

  return (
    <div className="mx-auto max-w-2xl space-y-5">
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
                    <div>
                      <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] mb-1">
                        <span>Score</span>
                        <span className="font-bold" style={{ color: c }}>{sc}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${sc}%`, backgroundColor: c }} />
                      </div>
                    </div>

                    {a.answer && (
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mb-1.5">Your answer</p>
                        <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">{a.answer}</p>
                      </div>
                    )}

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

/* ─────────────────────────────────────────────
   Export
───────────────────────────────────────────── */

export default function InterviewPrepPage() {
  return (
    <Suspense fallback={<div className="flex h-full" />}>
      <InterviewPrepPageInner />
    </Suspense>
  );
}
