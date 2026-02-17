'use client';

import { useState, useCallback, useRef } from 'react';
import { HomeView } from '@/components/dashboard';
import { sendChatMessage } from '@/lib/api/chat';
import type { ChatMessage } from '@/lib/types';

export default function DashboardPage() {
  const [queryValue, setQueryValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: trimmed,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQueryValue('');
    setIsTyping(true);

    // Simulate AI response
    sendChatMessage(trimmed);
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        text: `I'd be happy to help with that! As your academic advisor, I can assist with course selection, degree requirements, study strategies, and more. Could you tell me more about what you're looking for?`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQueryValue(value);
  }, []);

  return (
    <HomeView
      queryValue={queryValue}
      onQueryChange={handleQueryChange}
      onSendMessage={handleSendMessage}
      messages={messages}
      isTyping={isTyping}
      messagesEndRef={messagesEndRef}
    />
  );
}
