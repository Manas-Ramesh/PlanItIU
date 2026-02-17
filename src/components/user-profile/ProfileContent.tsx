'use client';

import { Button, Card, Progress } from '@/components/ui';
import type { ProfileContentProps } from './ProfileContent.types';

const XP_PER_LEVEL = 200;

export function ProfileContent({
  profile,
  onClose,
  showCloseButton = false,
}: ProfileContentProps) {
  const currentXP = profile?.xp ?? 0;
  const currentLevel = profile?.level ?? Math.floor(currentXP / XP_PER_LEVEL);
  const xpInLevel = currentXP % XP_PER_LEVEL;
  const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim() || 'Student'
    : 'Student';
  const email = profile?.email ?? '';

  return (
    <Card variant="default" padding="lg" as="div">
      {showCloseButton && onClose ? (
        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            Close
          </Button>
        </div>
      ) : null}
      <div className="text-center mt-2">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-semibold text-text-on-brand"
          aria-hidden
        >
          {displayName.slice(0, 2).toUpperCase()}
        </div>
        <h2 id="profile-title" className="mt-3 text-xl font-semibold text-text-primary">
          {displayName}
        </h2>
        <p className="text-sm text-text-secondary">{email || '—'}</p>
      </div>
      <div className="mt-6 rounded-lg border border-border-subtle bg-background p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-text-primary">Level {currentLevel}</span>
          <span className="text-sm text-text-secondary">{currentXP} XP</span>
        </div>
        <Progress value={xpProgress} className="mt-2" />
        <p className="mt-1 text-xs text-text-muted">
          {XP_PER_LEVEL - xpInLevel} XP to next level
        </p>
      </div>
      {profile?.major ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-text-primary">Major</h3>
          <p className="text-sm text-text-secondary">{profile.major}</p>
        </div>
      ) : null}
      {profile?.graduationYear ? (
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-text-primary">Graduation year</h3>
          <p className="text-sm text-text-secondary">{profile.graduationYear}</p>
        </div>
      ) : null}
    </Card>
  );
}
