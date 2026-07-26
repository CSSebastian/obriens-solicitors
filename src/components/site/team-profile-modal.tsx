"use client";

import { useState } from "react";

import { ChevronRightIcon } from "@/components/icons";
import {
  useContactModal,
  useTeamModal,
} from "@/components/overlay/overlay-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Monogram } from "@/components/ui/monogram";
import { teamMemberById, type TeamMember } from "@/content/site";

/**
 * Team-profile "read more" modal. Mounted once in the root layout; opened from
 * a team card via `useTeamModal().openMember(id)`. Built on the shared <Modal>
 * shell (the same one the contact modal uses).
 *
 * `shown` retains the last member through the exit animation, so the content
 * doesn't blank out while the panel is sliding away.
 */
export function TeamProfileModal() {
  const { activeMemberId, closeMember } = useTeamModal();
  const { openContact } = useContactModal();

  const member = activeMemberId ? teamMemberById(activeMemberId) : undefined;

  // Retain the last member through the exit animation (adjust state during
  // render, not in an effect — same pattern the Modal shell uses for `rendered`).
  const [shown, setShown] = useState<TeamMember | undefined>(member);
  if (member && member !== shown) setShown(member);

  return (
    <Modal
      open={Boolean(member)}
      onClose={closeMember}
      eyebrow="Profile"
      title={shown?.name ?? ""}
      size="profile"
      footer={
        <Button
          variant="primary-inverse"
          className="w-full justify-center"
          // Opening the contact modal switches the active overlay, which closes
          // this one automatically (they're mutually exclusive).
          onClick={openContact}
        >
          Get in touch
          <ChevronRightIcon className="size-4" />
        </Button>
      }
    >
      {shown ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <Monogram
              name={shown.name}
              tone="surface"
              size="badge"
              className="size-20 shrink-0 border border-line-on-dark"
            />
            <p className="type-small font-medium">{shown.role}</p>
          </div>

          <div className="flex flex-col gap-4 border-t border-line-on-dark pt-6">
            {shown.bio.map((paragraph) => (
              <p key={paragraph} className="type-body text-text-muted-on-dark">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
