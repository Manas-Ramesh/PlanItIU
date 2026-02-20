import { NavBar, HeroSection, StatsSection, FeatureGrid, HowItWorks, CTASection, Footer } from "@/components/landing";
import type { FeatureItem, NavLinkItem, StatItem, StepItem, FooterLinkGroup } from "@/components/landing";

import { cn } from "@/lib/utils/cn";

/* ─── Navigation ─── */

const NAV_LINKS: ReadonlyArray<NavLinkItem> = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
] as const;

/* ─── Stats ─── */

const STATS: ReadonlyArray<StatItem> = [
  { value: "6+", label: "Academic Tools" },
  { value: "24/7", label: "AI Advisor Access" },
  { value: "100%", label: "Free to Start" },
  { value: "1", label: "Unified Platform" },
];

/* ─── Features ─── */

const FEATURES: ReadonlyArray<FeatureItem> = [
  {
    id: "study-portal",
    accentGradient: "teal",
    title: "Study Portal",
    description: "Generate practice tests, flashcards, and study guides from your course materials. Premium users get unlimited access without file uploads.",
    imagePlaceholder: "Screenshot of flashcard deck and practice test interface",
  },
  {
    id: "ai-schedule-builder",
    accentGradient: "blue",
    title: "AI Schedule Builder",
    description: "Build your perfect schedule with AI recommendations, Rate My Professor insights, and optimal course combinations to maximize your GPA.",
    imagePlaceholder: "Screenshot of weekly calendar view with color-coded courses",
  },
  {
    id: "track-degree-progress",
    accentGradient: "green",
    title: "Track Degree Progress",
    description: "Upload your transcript manually or scan it with AI to see exactly what requirements you've completed and what's left for graduation.",
    imagePlaceholder: "Screenshot of degree audit with progress bars and checkmarks",
  },
  {
    id: "ai-advisor",
    accentGradient: "purple",
    title: "AI Academic Advisor",
    description: "Get instant academic advice 24/7. Ask about course selection, major requirements, or receive personalized study recommendations.",
    imagePlaceholder: "Screenshot of AI chat conversation giving course advice",
  },
  {
    id: "pre-grade-assignments",
    accentGradient: "orange",
    title: "Pre-Grade Assignments",
    description: "Submit your assignments before the deadline to get AI-powered feedback and estimated grades. Improve your work and boost your GPA.",
    imagePlaceholder: "Screenshot of assignment feedback with grade estimate and suggestions",
  },
  {
    id: "career-center",
    accentGradient: "pink",
    title: "Career Center",
    description: "Find job opportunities and internships based on your major and interests. Connect with alumni at top companies for networking and mentorship.",
    imagePlaceholder: "Screenshot of job listings with filters and alumni network cards",
  },
] as const;

/* ─── How It Works ─── */

const STEPS: ReadonlyArray<StepItem> = [
  {
    number: 1,
    title: "Create Your Account",
    description: "Sign up and tell us your university, major, and academic goals so our AI can personalize everything for you.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Set Up Your Profile",
    description: "Upload your transcript, add completed courses, and set your preferences. Takes less than 5 minutes.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Start Planning",
    description: "Access all tools instantly — build schedules, track your degree, pre-grade assignments, and explore career paths.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
    ),
  },
];

/* ─── Footer ─── */

const FOOTER_LINKS: ReadonlyArray<FooterLinkGroup> = [
  {
    title: "Platform",
    links: [
      { label: "Schedule Builder", href: "#features" },
      { label: "Degree Tracker", href: "#features" },
      { label: "Study Portal", href: "#features" },
      { label: "Career Center", href: "#features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Supported Schools", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const FOOTER_DISCLAIMER = "PlanitUni is an independent entity and is not affiliated with any university.";

/* ─── Page ─── */

export default function MarketingLandingPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavBar brandLabel="PlanitUni" navLinks={NAV_LINKS} ctaLabel="Get Started" ctaHref="/login" />

      {/* Scrollable content area — scrollbar lives under the navbar */}
      <div className="flex-1 overflow-y-auto">
        <main id="main-content">
          <HeroSection
            headline="Plan Your"
            highlight="Academic Success"
            subtitle="Your AI-powered companion for course planning, degree tracking, assignment grading, and career opportunities. Everything college students need to maximize their GPA and career  in one platform."
            ctaLabel="Get Started Free"
            ctaHref="/login"
          />

          <StatsSection stats={STATS} />

          <FeatureGrid
            id="features"
            title="Everything You Need to Succeed"
            subtitle="Six powerful tools designed for college students — from planning your first semester to landing your first job."
            features={FEATURES}
          />

          <HowItWorks id="how-it-works" title="Get Started in Minutes" subtitle="Three simple steps to take control of your academic journey." steps={STEPS} />

          <CTASection
            headline="Ready to Take Control of Your Academic Future?"
            subtitle="Join students who are using AI to plan smarter, study better, and build the career they want."
            ctaLabel="Get Started Free"
            ctaHref="/login"
          />
        </main>

        <Footer
          brandLabel="PlanitUni"
          brandDescription="AI-powered academic planning for college students. Plan smarter, study better, achieve more."
          linkGroups={FOOTER_LINKS}
        >
          {FOOTER_DISCLAIMER}
        </Footer>
      </div>
    </div>
  );
}
