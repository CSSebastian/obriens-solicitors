"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

/**
 * TODO: confirm content with client — the design's heading ("Proud Sponsors of
 * Local Sporting Club") does not match the subscribe copy beneath it. Both are
 * reproduced as designed.
 *
 * TODO: wire the signup to a real email service. This is UI only for now.
 */
export function Newsletter() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Section tone="paper">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="type-h2">Proud Sponsors of Local Sporting Club</h2>
          <p className="type-body mt-6 max-w-xl text-text-muted-on-light">
            Subscribe to our insights and receive practical guidance on the
            issues that affect your life and business. We send updates when
            there&rsquo;s something worth reading.
          </p>
        </div>

        <form
          className="flex flex-col justify-center gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <label htmlFor={inputId} className="type-small">
            Email
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={inputId}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-11 flex-1 border border-line-on-light bg-transparent px-4 type-small text-text-on-light placeholder:text-text-muted-on-light focus:border-text-on-light focus:outline-none"
            />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </div>
          <p aria-live="polite" className="type-xs text-text-muted-on-light">
            {submitted
              ? "Thanks — we'll be in touch when the next update goes out."
              : "We only send updates when there's something worth reading."}
          </p>
        </form>
      </div>
    </Section>
  );
}
