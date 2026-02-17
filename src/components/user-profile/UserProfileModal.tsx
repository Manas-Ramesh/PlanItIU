'use client';

import { useEffect } from 'react';
import { ProfileContent } from './ProfileContent';
import type { UserProfileModalProps } from './UserProfileModal.types';

export function UserProfileModal({ profile, onClose }: UserProfileModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-overlay"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="fixed inset-x-4 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border-subtle bg-surface shadow-card md:inset-x-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2"
      >
        <ProfileContent profile={profile} onClose={onClose} showCloseButton />
      </div>
    </>
  );
}
