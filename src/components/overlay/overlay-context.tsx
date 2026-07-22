"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

/**
 * A single source of truth for the two mutually-exclusive full-screen overlays
 * — the chat assistant and the contact modal. Only one can be active at a time,
 * so opening either automatically closes the other.
 */
type Overlay = "none" | "chat" | "contact";

interface OverlayContextValue {
  active: Overlay;
  setActive: Dispatch<SetStateAction<Overlay>>;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Overlay>("none");
  const value = useMemo(() => ({ active, setActive }), [active]);
  return <OverlayContext value={value}>{children}</OverlayContext>;
}

function useOverlay(): OverlayContextValue {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("Overlay hooks must be used within an OverlayProvider");
  }
  return context;
}

/** Chat assistant open/close. Opening it closes the contact modal. */
export function useChatUi() {
  const { active, setActive } = useOverlay();
  const isOpen = active === "chat";
  const openChat = useCallback(() => setActive("chat"), [setActive]);
  const closeChat = useCallback(
    () => setActive((prev: Overlay) => (prev === "chat" ? "none" : prev)),
    [setActive],
  );
  const toggleChat = useCallback(
    () => setActive((prev: Overlay) => (prev === "chat" ? "none" : "chat")),
    [setActive],
  );
  return { isOpen, openChat, closeChat, toggleChat };
}

/** Contact modal open/close. Opening it closes the chat assistant. */
export function useContactModal() {
  const { active, setActive } = useOverlay();
  const isOpen = active === "contact";
  const openContact = useCallback(() => setActive("contact"), [setActive]);
  const closeContact = useCallback(
    () => setActive((prev: Overlay) => (prev === "contact" ? "none" : prev)),
    [setActive],
  );
  return { isOpen, openContact, closeContact };
}
