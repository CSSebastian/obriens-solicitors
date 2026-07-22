import { z } from "zod";

/** Shared by the client form and the API route so validation cannot drift. */
export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name").max(80),
  lastName: z.string().trim().min(1, "Enter your last name").max(80),
  email: z.email("Enter a valid email address").max(200),
  /** Optional — helps us call back, and lets the browser autofill it. */
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more")
    .max(4_000, "Please keep your message under 4,000 characters"),
  terms: z.literal(true, "Please agree to the terms"),
  /**
   * Honeypot — real people never see or fill this, so it must stay valid here
   * and be checked in the API route, which silently accepts anything non-empty
   * rather than telling a bot it was caught.
   */
  company: z.string().max(200).optional(),
  turnstileToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<
  Record<keyof ContactInput, string | undefined>
>;
