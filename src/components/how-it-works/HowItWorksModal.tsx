'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button, Card } from '@/components/ui';
import type { HowItWorksModalProps } from './HowItWorksModal.types';

const FEATURES: ReadonlyArray<{ readonly title: string; readonly description: string }> = [
  {
    title: 'Study Portal',
    description:
      'Generate practice material for your courses by attaching a file. Premium users can generate without a file.',
  },
  {
    title: 'AI Schedule Builder',
    description:
      'Build your schedule with AI recommendations and optimal course combinations to maximize your GPA.',
  },
  {
    title: 'Track Degree Progress',
    description:
      "Upload your transcript to see what requirements you've completed and what's left for graduation.",
  },
  {
    title: 'Hoosier AI Advisor',
    description:
      'Get instant academic advice 24/7. Ask about course selection, major requirements, or study recommendations.',
  },
  {
    title: 'Pre-Grade Assignments',
    description:
      'Submit assignments before the deadline for AI-powered feedback and estimated grades.',
  },
  {
    title: 'Career Center',
    description:
      'Find jobs and internships. Connect with alumni for networking and mentorship.',
  },
] as const;

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[var(--color-overlay)]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
        className="fixed inset-x-4 top-4 z-50 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-card)] md:inset-x-auto md:left-1/2 md:top-1/2 md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2"
      >
        <header className="flex items-center justify-between border-b border-[var(--color-border-subtle)] p-4">
          <h2 id="how-it-works-title" className="text-xl font-semibold text-[var(--color-text-primary)]">
            How Planituni works
          </h2>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            Close
          </Button>
        </header>
        <div className="p-4 space-y-4">
          <p className="text-[var(--color-text-secondary)]">
            Planituni is your academic success platform. Here’s how to use it.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <Card key={f.title} variant="default" padding="md">
                <h3 className="font-semibold text-[var(--color-text-primary)]">{f.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{f.description}</p>
              </Card>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={onClose}>Get started</Button>
          </div>
        </div>
      </div>
    </>
  );
}
