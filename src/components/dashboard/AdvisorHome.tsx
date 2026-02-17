'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Button, Card, Input } from '@/components/ui';
import type { AdvisorHomeProps } from './AdvisorHome.types';

const CARD_LINKS: ReadonlyArray<{
  readonly href: string;
  readonly label: string;
  readonly description: string;
  readonly icon: 'schedule' | 'degree' | 'study' | 'assignments' | 'career';
}> = [
  { href: '/schedule', label: 'Plan your classes', description: 'AI Schedule Builder', icon: 'schedule' },
  { href: '/degree-progress', label: 'Degree Progress', description: 'Track requirements', icon: 'degree' },
  { href: '/study', label: 'Study Portal', description: 'Practice tests & guides', icon: 'study' },
  { href: '/assignments', label: 'Assignment Grades', description: 'Pre-grade assignments', icon: 'assignments' },
  { href: '/career', label: 'Career Center', description: 'Jobs & networking', icon: 'career' },
] as const;

export function AdvisorHome({
  messages,
  savedChats,
  isTyping,
  onSendMessage,
  onNewChat,
  onNavigateToSchedule,
  onNavigateToDegreeProgress,
  onNavigateToStudy,
  onNavigateToAssignments,
  onNavigateToCareer,
  onOpenHowItWorks,
  queryValue,
  onQueryChange,
  messagesEndRef,
}: AdvisorHomeProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = queryValue.trim();
      if (trimmed) onSendMessage(trimmed);
    },
    [queryValue, onSendMessage]
  );

  const navHandlers: Record<string, () => void> = {
    '/schedule': onNavigateToSchedule,
    '/degree-progress': onNavigateToDegreeProgress,
    '/study': onNavigateToStudy,
    '/assignments': onNavigateToAssignments,
    '/career': onNavigateToCareer,
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-6 py-4">
        <h1 id="dashboard-title" className="text-xl font-semibold text-[var(--color-text-primary)]">
          Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onOpenHowItWorks}
          >
            How it works
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className="flex w-56 shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-3"
          aria-label="Advisor chats"
        >
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Advisor Chats
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              aria-label="Start new chat"
            >
              New
            </Button>
          </div>
          <ul className="space-y-1 overflow-y-auto" role="list">
            {savedChats.length === 0 ? (
              <li className="px-2 py-2 text-xs text-[var(--color-text-muted)]">No chats yet</li>
            ) : (
              savedChats.map((chat) => (
                <li key={chat.id}>
                  <button
                    type="button"
                    className="w-full rounded-lg px-2 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
                  >
                    <span className="block truncate">{chat.title}</span>
                    <span className="block text-xs text-[var(--color-text-muted)]">{chat.timestamp}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        <section
          className="flex flex-1 flex-col overflow-hidden bg-[var(--color-bg-base)]"
          aria-labelledby="dashboard-title"
        >
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CARD_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    const handler = navHandlers[item.href];
                    if (handler) handler();
                  }}
                  className="focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)] rounded-xl"
                  aria-label={`${item.label}: ${item.description}`}
                >
                  <Card variant="feature" padding="lg" as="div">
                    <p className="font-medium text-[var(--color-text-primary)]">{item.label}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{item.description}</p>
                  </Card>
                </Link>
              ))}
            </div>

            <Card variant="default" padding="lg" className="flex flex-1 flex-col min-h-[240px]">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Hoosier AI Advisor</h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Ask about course selection, degree requirements, or study tips.
              </p>
              <div className="mt-4 flex-1 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">No messages yet. Type below to start.</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm',
                        msg.sender === 'user'
                          ? 'ml-8 bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                          : 'mr-8 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                      )}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
                {isTyping ? (
                  <div className="mr-8 rounded-lg bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-muted)]">
                    Thinking…
                  </div>
                ) : null}
                <div ref={messagesEndRef} aria-hidden />
              </div>
              <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <Input
                  type="text"
                  value={queryValue}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Ask about courses, schedule, or degree..."
                  aria-label="Message the advisor"
                  className="flex-1"
                />
                <Button type="submit" disabled={!queryValue.trim() || isTyping}>
                  Send
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
