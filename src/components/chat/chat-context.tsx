"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ChatUiContextValue {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatUiContext = createContext<ChatUiContextValue | null>(null);

/**
 * Shared open/closed state for the assistant, so the floating launcher and the
 * "AI Chat Bot" button in the home FAQ section drive the same panel.
 */
export function ChatUiProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((open) => !open), []);

  const value = useMemo(
    () => ({ isOpen, openChat, closeChat, toggleChat }),
    [isOpen, openChat, closeChat, toggleChat],
  );

  return <ChatUiContext value={value}>{children}</ChatUiContext>;
}

export function useChatUi(): ChatUiContextValue {
  const context = useContext(ChatUiContext);
  if (!context) {
    throw new Error("useChatUi must be used within a ChatUiProvider");
  }
  return context;
}
