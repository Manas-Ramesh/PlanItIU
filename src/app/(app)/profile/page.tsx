'use client';

import Link from 'next/link';
import { ProfileContent } from '@/components/user-profile/ProfileContent';

export default function ProfilePage() {
  return (
    <main
      id="main-content"
      className="flex-1 p-6 bg-[var(--color-bg-base)] max-w-lg mx-auto"
      aria-labelledby="profile-title"
    >
      <Link
        href="/dashboard"
        className="inline-block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4"
      >
        ← Back to Dashboard
      </Link>
      <ProfileContent profile={null} />
    </main>
  );
}
