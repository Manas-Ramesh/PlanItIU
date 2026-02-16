import {
  NavBar,
  HeroSection,
  FeatureGrid,
  Footer,
  LandingSchoolSelect,
} from '@/components/landing';
import type { FeatureItem, NavLinkItem } from '@/components/landing';
import type { SelectOption } from '@/components/ui/Select';

const NAV_LINKS: ReadonlyArray<NavLinkItem> = [
  { href: '#overview', label: 'Overview' },
] as const;

const SCHOOL_OPTIONS: ReadonlyArray<SelectOption> = [
  { value: '', label: 'Select your school to get started' },
  { value: 'iu', label: 'Indiana University' },
];

const FEATURES: ReadonlyArray<FeatureItem> = [
  {
    id: 'study-portal',
    iconGradient: 'teal',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.18 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z" />
      </svg>
    ),
    title: 'Study Portal',
    description:
      'Generate practice tests, flashcards, and study guides from your course materials. Premium users get unlimited access without file uploads.',
  },
  {
    id: 'ai-schedule-builder',
    iconGradient: 'blue',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
      </svg>
    ),
    title: 'AI Schedule Builder',
    description:
      'Build your perfect schedule with AI recommendations, Rate My Professor insights, and optimal course combinations to maximize your GPA.',
  },
  {
    id: 'track-degree-progress',
    iconGradient: 'green',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: 'Track Degree Progress',
    description:
      "Upload your transcript manually or scan it with AI to see exactly what requirements you've completed and what's left for graduation.",
  },
  {
    id: 'hoosier-ai-advisor',
    iconGradient: 'purple',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
      </svg>
    ),
    title: 'Hoosier AI Advisor',
    description:
      'Get instant academic advice 24/7. Ask about course selection, major requirements, or receive personalized study recommendations.',
  },
  {
    id: 'pre-grade-assignments',
    iconGradient: 'orange',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    ),
    title: 'Pre-Grade Assignments',
    description:
      'Submit your assignments before the deadline to get AI-powered feedback and estimated grades. Improve your work and boost your GPA.',
  },
  {
    id: 'career-center',
    iconGradient: 'pink',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM10 4h4v2h-4V4zm10 15H4v-2h16v2zm0-5H4V8h16v6z" />
      </svg>
    ),
    title: 'Career Center',
    description:
      'Find job opportunities and internships based on your major and interests. Connect with alumni at top companies for networking and mentorship.',
  },
] as const;

const FOOTER_DISCLAIMER =
  'PlanitUni is an independent entity and is not affiliated with any university.';

export default function MarketingLandingPage() {
  return (
    <>
      <NavBar
        brandLabel="Planituni"
        brandHighlight="DEV SKIP"
        navLinks={NAV_LINKS}
        ctaLabel="Get started"
        ctaHref="/login"
      />

      <main id="main-content">
        <HeroSection
          headline="Plan Your"
          highlight="Academic Success"
          subtitle="Your AI-powered companion for course planning, degree tracking, assignment grading, and career opportunities. Built for college students who want to maximize their GPA and career prospects."
          ctaSlot={
            <LandingSchoolSelect
              options={SCHOOL_OPTIONS}
              label="Select your school to get started"
              placeholder="Select your school to get started"
            />
          }
        />

        <FeatureGrid
          title="Your All-in-One Academic Platform"
          subtitle="Everything you need to succeed in college, all in one place"
          features={FEATURES}
        />
      </main>

      <Footer>{FOOTER_DISCLAIMER}</Footer>
    </>
  );
}
