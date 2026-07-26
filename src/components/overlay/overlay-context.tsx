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
 * A single source of truth for the mutually-exclusive overlays — the chat
 * assistant, the contact modal, and the team-profile modal. Only one can be
 * active at a time, so opening any one automatically closes the others.
 */
type Overlay = "none" | "chat" | "contact" | "team";

interface OverlayContextValue {
  active: Overlay;
  setActive: Dispatch<SetStateAction<Overlay>>;
  /** Which team member the profile modal is showing (id from site.ts). */
  memberId: string | null;
  setMemberId: Dispatch<SetStateAction<string | null>>;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Overlay>("none");
  const [memberId, setMemberId] = useState<string | null>(null);
  const value = useMemo(
    () => ({ active, setActive, memberId, setMemberId }),
    [active, memberId],
  );
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

/** Contact modal open/close. Opening it closes the other overlays. */
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

/** Team-profile modal. Opening a member closes the other overlays. */
export function useTeamModal() {
  const { active, setActive, memberId, setMemberId } = useOverlay();
  const activeMemberId = active === "team" ? memberId : null;
  const openMember = useCallback(
    (id: string) => {
      setMemberId(id);
      setActive("team");
    },
    [setActive, setMemberId],
  );
  const closeMember = useCallback(
    () => setActive((prev: Overlay) => (prev === "team" ? "none" : prev)),
    [setActive],
  );
  return { activeMemberId, openMember, closeMember };
}
