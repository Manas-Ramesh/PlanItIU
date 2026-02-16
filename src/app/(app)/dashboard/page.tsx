'use client';

import { useState, useCallback } from 'react';
import { HomeView } from '@/components/dashboard';
import { sendChatMessage } from '@/lib/api/chat';

export default function DashboardPage() {
  const [queryValue, setQueryValue] = useState('');

  const handleSendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setQueryValue('');
    sendChatMessage(trimmed);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQueryValue(value);
  }, []);

  return (
    <HomeView
      queryValue={queryValue}
      onQueryChange={handleQueryChange}
      onSendMessage={handleSendMessage}
    />
  );
}
