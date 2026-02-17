'use client';

import { useState } from 'react';
import { Button, Card, Progress } from '@/components/ui';
import type { AssignmentsViewProps } from './AssignmentsView.types';

export function AssignmentsView({
  submissions,
  onUpload,
}: AssignmentsViewProps) {
  const latest = submissions.length > 0 ? submissions[submissions.length - 1] : null;

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto p-6" aria-labelledby="assignments-title">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 id="assignments-title" className="text-2xl font-bold text-text-primary">
              Canvas Assignment Pre-Grader
            </h1>
            <p className="mt-1 text-text-secondary">
              Upload your assignment and submission (PDF, PowerPoint, Word, etc.) to receive detailed AI feedback.
            </p>
          </div>

          <div className="rounded-lg border border-brand/30 bg-brand/5 p-4 flex gap-3">
            <span className="text-brand shrink-0" aria-hidden>
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            <p className="text-sm text-text-secondary">
              This feature is designed for essays, presentations, and instruction heavy deliverables. Boost your prediction accuracy by submitting more assignments and syncing with canvas.
            </p>
          </div>

          <div className="flex gap-4">
            <Button className="bg-brand text-text-on-brand">4 Your Submissions</Button>
            <Button className="bg-brand text-text-on-brand">75% Your Accuracy</Button>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">Step 1: Upload Assignment Instructions.</h2>
            <span className="inline-block mt-1 rounded bg-[var(--color-success)] px-2 py-0.5 text-xs font-medium text-text-on-brand">Uploaded</span>
            <div className="mt-2 rounded-lg border border-border-subtle bg-surface p-4 flex items-center gap-3">
              <span className="text-text-muted">
                <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">Lessing--Sunrise on the Veld.pdf</p>
                <p className="text-xs text-text-muted">Click or drag to change</p>
              </div>
              <Button variant="secondary" size="sm" className="border-nav-active text-nav-active">Paste Text</Button>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary">Step 2: Upload Your Submission.</h2>
            <span className="inline-block mt-1 rounded bg-[var(--color-success)] px-2 py-0.5 text-xs font-medium text-text-on-brand">PDF Document</span>
            <div className="mt-2 rounded-lg border border-border-subtle bg-surface p-4 flex items-center gap-3">
              <span className="text-text-muted">
                <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">Manas_Ramesh_2026_Fellows_Program_Acceptance_Letter (1).pdf</p>
                <p className="text-xs text-text-muted">Click or drag to change</p>
              </div>
              <Button variant="secondary" size="sm" className="border-nav-active text-nav-active">Paste Text</Button>
            </div>
          </section>

          <div className="flex gap-2">
            <Button className="gap-2 bg-brand text-text-on-brand">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" />
              </svg>
              Get Pre-Grade & Feedback
            </Button>
            <Button variant="secondary" size="sm" className="gap-1">Reset</Button>
          </div>

          {latest ? (
            <>
              <section className="rounded-xl border border-border-subtle bg-surface p-5">
                <h2 className="text-lg font-semibold text-text-primary">Predicted Grade</h2>
                <p className="text-sm text-text-muted">Based on 1,247 similar submissions</p>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="text-4xl font-bold text-text-primary">{latest.predictedGrade}%</p>
                  <span className="rounded bg-[var(--color-success)]/20 text-[var(--color-success)] px-2 py-1 text-xs font-medium">
                    {latest.confidence}% Confidence
                  </span>
                </div>
                <Progress value={latest.predictedGrade} max={100} className="mt-3 h-2" />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="mt-4 rounded-lg border border-brand/20 bg-brand/5 p-3 flex gap-2">
                  <span className="text-brand shrink-0" aria-hidden>
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </span>
                  <p className="text-sm text-text-secondary">
                    This is a predicted grade based on our algorithm&apos;s analysis. Your actual professor may grade differently. Use this feedback to improve your work before final submission.
                  </p>
                </div>
              </section>

              {latest.feedback && latest.feedback.length > 0 ? (
                <section>
                  <h2 className="text-lg font-semibold text-text-primary">Detailed Feedback by Category</h2>
                  <ul className="mt-4 space-y-4" role="list">
                    {latest.feedback.map((fb, i) => (
                      <li key={i} className="rounded-lg border border-border-subtle bg-surface p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-text-primary">{fb.category}</span>
                          <span className="text-sm text-text-secondary">
                            {fb.score} / {fb.maxScore} points
                          </span>
                        </div>
                        <Progress
                          value={(fb.score / fb.maxScore) * 100}
                          max={100}
                          className="mt-2 h-2"
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="rounded-lg border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 p-4 flex gap-3">
                <span className="text-[var(--color-success)] shrink-0" aria-hidden>
                  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2C20 17.5 12 22 12 22z" />
                  </svg>
                </span>
                <p className="text-sm text-text-secondary">
                  Unlike ChatGPT or Gemini, we have access to actual Canvas assignment PDFs and real student submissions. Our algorithm learns from 1,247 real submissions and 878 students who shared their actual grades. Each submission and grade helps the next student get more accurate feedback.
                </p>
              </div>

              <details className="rounded-lg border border-border-subtle bg-surface p-4">
                <summary className="font-medium text-text-primary cursor-pointer">Your Pre-Grading History</summary>
              </details>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
