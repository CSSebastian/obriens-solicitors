"use client";

import { useCallback, useId, useState, type ReactNode } from "react";

import { Turnstile, turnstileSiteKey } from "@/components/contact/turnstile";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactFieldErrors } from "@/lib/contact-schema";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const errorCopy: Record<string, string> = {
  "rate-limit":
    "You've sent a few messages already. Please try again in an hour, or ring the office.",
  turnstile: "We couldn't verify that you're human. Please try again.",
  unavailable:
    "Our message system is temporarily unavailable. Please ring the office instead.",
  "send-failed":
    "Something went wrong sending your message. Please try again or ring the office.",
  validation: "Please check the highlighted fields and try again.",
  invalid: "Something went wrong. Please try again.",
};

/**
 * Shared contact form — rendered both on the /contact page and inside the
 * global contact modal. Native inputs only (so browser autofill and password
 * managers work), a real `<form>` with a submit button (Enter-to-submit), and
 * all validation / Resend / Turnstile / honeypot / rate-limit logic unchanged.
 */
export function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const baseId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);

  const handleToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      terms: formData.get("terms") === "on",
      company: String(formData.get("company") ?? ""),
      turnstileToken,
    };

    // Client-side validation with the same schema the server uses.
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in errors)) {
          errors[key as keyof ContactFieldErrors] = issue.message;
        }
      }
      setFieldErrors(errors);
      setFormError(null);
      setStatus("error");
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
          fields?: ContactFieldErrors;
        };
        if (body.fields) setFieldErrors(body.fields);
        setFormError(
          errorCopy[body.error ?? "invalid"] ?? errorCopy.invalid ?? null,
        );
        setStatus("error");
        setTurnstileReset((count) => count + 1);
        return;
      }

      // Don't clear input on error; only reset on genuine success.
      form.reset();
      setTurnstileToken("");
      setTurnstileReset((count) => count + 1);
      setStatus("success");
      onSuccess?.();
    } catch {
      setFormError(errorCopy["send-failed"] ?? null);
      setStatus("error");
      setTurnstileReset((count) => count + 1);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field
        id={`${baseId}-first-name`}
        name="firstName"
        label="First name"
        autoComplete="given-name"
        error={fieldErrors.firstName}
      />
      <Field
        id={`${baseId}-last-name`}
        name="lastName"
        label="Last name"
        autoComplete="family-name"
        error={fieldErrors.lastName}
      />
      <Field
        id={`${baseId}-email`}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        label="Email"
        error={fieldErrors.email}
      />
      <Field
        id={`${baseId}-phone`}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        label="Phone (optional)"
        error={fieldErrors.phone}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor={`${baseId}-message`} className="type-label">
          Message
        </label>
        <textarea
          id={`${baseId}-message`}
          name="message"
          rows={5}
          placeholder="Tell us what you need"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            fieldErrors.message ? `${baseId}-message-error` : undefined
          }
          className={cn(
            "contact-field w-full resize-y border bg-transparent px-4 py-3 text-base leading-normal text-text-on-dark placeholder:text-text-muted-on-dark focus:outline-none",
            fieldErrors.message
              ? "border-red-300"
              : "border-line-on-dark focus:border-text-on-dark",
          )}
        />
        {fieldErrors.message ? (
          <p id={`${baseId}-message-error`} className="type-xs text-red-300">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — visually hidden, never focusable. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={`${baseId}-company`}>Company</label>
        <input
          id={`${baseId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <input
            id={`${baseId}-terms`}
            name="terms"
            type="checkbox"
            className="size-5 shrink-0 appearance-none border border-text-on-dark bg-transparent checked:bg-text-on-dark checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path fill=%22none%22 stroke=%22%2314213d%22 stroke-width=%222%22 d=%22m3 8 3.5 3.5L13 5%22/></svg>')] checked:bg-center checked:bg-no-repeat"
          />
          <label htmlFor={`${baseId}-terms`} className="type-label">
            I agree to the terms
          </label>
        </div>
        {fieldErrors.terms ? (
          <p className="type-xs text-red-300">{fieldErrors.terms}</p>
        ) : null}
      </div>

      {turnstileSiteKey ? (
        <Turnstile onToken={handleToken} resetSignal={turnstileReset} />
      ) : null}

      <div>
        <Button
          type="submit"
          variant="primary-inverse"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </Button>
      </div>

      <div aria-live="polite" className="empty:hidden">
        {status === "success" ? (
          <p className="border border-line-on-dark bg-navy-deep px-4 py-3 type-small">
            Thank you — your message has been sent. We&rsquo;ll be in touch
            shortly.
          </p>
        ) : null}
        {status === "error" && formError ? (
          <p className="border border-red-300/60 bg-navy-deep px-4 py-3 type-small text-red-200">
            {formError}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  inputMode,
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  label: ReactNode;
  type?: string;
  inputMode?: "email" | "tel" | "text";
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        // text-base (16px) prevents iOS zoom-on-focus.
        className={cn(
          "contact-field h-12 w-full border bg-transparent px-4 text-base text-text-on-dark placeholder:text-text-muted-on-dark focus:outline-none",
          error
            ? "border-red-300"
            : "border-line-on-dark focus:border-text-on-dark",
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="type-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
