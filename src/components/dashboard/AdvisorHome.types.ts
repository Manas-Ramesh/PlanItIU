import type { ChatMessage, SavedChat, Schedule, UserProfile } from '@/lib/types';

export interface AdvisorHomeProps {
  readonly messages: ReadonlyArray<ChatMessage>;
  readonly savedChats: ReadonlyArray<SavedChat>;
  readonly userProfile: UserProfile | null;
  readonly schedule: Schedule | null;
  readonly isTyping: boolean;
  readonly onSendMessage: (text: string) => void;
  readonly onNewChat: () => void;
  readonly onNavigateToSchedule: () => void;
  readonly onNavigateToDegreeProgress: () => void;
  readonly onNavigateToStudy: () => void;
  readonly onNavigateToAssignments: () => void;
  readonly onNavigateToCareer: () => void;
  readonly onOpenHowItWorks: () => void;
  readonly queryValue: string;
  readonly onQueryChange: (value: string) => void;
  readonly messagesEndRef: React.RefObject<HTMLDivElement | null>;
}
