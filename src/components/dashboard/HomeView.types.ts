import type { ChatMessage } from '@/lib/types';

export interface HomeViewProps {
  readonly queryValue: string;
  readonly onQueryChange: (value: string) => void;
  readonly onSendMessage: (text: string) => void;
  readonly messages: ReadonlyArray<ChatMessage>;
  readonly isTyping: boolean;
  readonly messagesEndRef: React.RefObject<HTMLDivElement | null>;
}
