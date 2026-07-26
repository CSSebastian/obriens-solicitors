"use client";

import { ContactForm } from "@/components/contact/contact-form";
import { useContactModal } from "@/components/overlay/overlay-context";
import { Modal } from "@/components/ui/modal";
import { site } from "@/content/site";

/**
 * Global contact modal. Mounted once in the root layout; opened from any
 * "get in touch" trigger via `useContactModal().openContact()`. Built on the
 * shared <Modal> shell — the same one the team-profile modal uses. The form is
 * the shared <ContactForm>, identical to the /contact page.
 */
export function ContactModal() {
  const { isOpen, closeContact } = useContactModal();

  return (
    <Modal
      open={isOpen}
      onClose={closeContact}
      eyebrow="Write"
      title="Send your message"
      size="form"
      footer={
        <div className="flex flex-col gap-1.5">
          <p className="type-xs text-text-muted-on-dark">
            Prefer to reach us directly?
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1 type-small">
            <a
              href={site.phoneHref}
              className="underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              {site.phone}
            </a>
            <a
              href={site.emailHref}
              className="break-all underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              {site.email}
            </a>
          </p>
        </div>
      }
    >
      <p className="type-small mb-6 text-text-muted-on-dark">
        Tell us a little about your matter and we&rsquo;ll be in touch. Please
        don&rsquo;t include confidential details here.
      </p>
      <ContactForm />
    </Modal>
  );
}
