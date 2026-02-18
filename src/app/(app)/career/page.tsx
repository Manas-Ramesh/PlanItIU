'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CareerPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/career/interview-prep');
  }, [router]);
  return null;
}
