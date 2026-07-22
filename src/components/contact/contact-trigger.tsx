"use client";

import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { useContactModal } from "@/components/overlay/overlay-context";

/**
 * Button that opens the global contact modal. A thin client wrapper so Server
 * Components (Hero, CtaBand, …) can trigger the modal without becoming client
 * components themselves.
 */
export function ContactTrigger({
  children,
  variant = "primary",
  size = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { openContact } = useContactModal();
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={openContact}
    >
      {children}
    </Button>
  );
}
