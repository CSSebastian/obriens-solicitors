import { Resend } from "resend";

import { site } from "@/content/site";
import { buildAcknowledgementEmail } from "@/emails/enquiry-acknowledgement";
import { buildNotificationEmail } from "@/emails/enquiry-notification";
import { type Enquiry } from "@/emails/shell";
import { contactSchema } from "@/lib/contact-schema";
import { checkContactLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function jsonError(error: string, status: number, fields?: unknown) {
  return Response.json({ error, fields }, { status });
}

async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Skip gracefully in development when keys are not configured.
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("[contact] turnstile verification failed", error);
    return false;
  }
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid", 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
    }
    return jsonError("validation", 400, fields);
  }

  const data = parsed.data;

  // Honeypot: silently accept so a bot cannot learn it was caught.
  if (data.company) return Response.json({ ok: true });

  const ip = clientIp(request);

  if (!(await checkContactLimit(ip))) {
    return jsonError("rate-limit", 429);
  }

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return jsonError("turnstile", 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  if (!apiKey || !to) {
    // In development, skip sending gracefully so the success flow is testable
    // without credentials. In production, missing keys are a real outage.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[contact] RESEND_API_KEY/CONTACT_EMAIL_TO not set — dev skip, not sending.",
      );
      return Response.json({ ok: true, skipped: true });
    }
    console.error("[contact] RESEND_API_KEY or CONTACT_EMAIL_TO is not set");
    return jsonError("unavailable", 503);
  }

  // TODO: replace with a verified sending domain in Resend, e.g.
  // "O'Briens Solicitors <website@obriens-solicitors.com.au>".
  const from =
    process.env.CONTACT_EMAIL_FROM ??
    "O'Briens Solicitors <onboarding@resend.dev>";

  const enquiry: Enquiry = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || undefined,
    areaOfLaw: data.areaOfLaw,
    message: data.message,
    submittedAt: new Date(),
    source: site.url,
  };

  const resend = new Resend(apiKey);

  // 1. Internal notification to the firm — this MUST succeed. If it fails, the
  //    enquiry is lost, so we surface an error and the user can retry.
  const notification = buildNotificationEmail(enquiry);
  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });
    if (error) {
      console.error("[contact] notification send error", error);
      return jsonError("send-failed", 502);
    }
  } catch (error) {
    console.error("[contact] notification send failed", error);
    return jsonError("send-failed", 502);
  }

  // 2. Auto-reply acknowledgement to the enquirer — best effort. Their enquiry
  //    already reached the firm, so a failure here must NEVER surface as a form
  //    error; we just log it.
  try {
    const acknowledgement = buildAcknowledgementEmail(enquiry);
    const { error } = await resend.emails.send({
      from,
      to: [data.email],
      replyTo: site.email,
      subject: acknowledgement.subject,
      html: acknowledgement.html,
      text: acknowledgement.text,
    });
    if (error) {
      console.error("[contact] acknowledgement send error (ignored)", error);
    }
  } catch (error) {
    console.error("[contact] acknowledgement send failed (ignored)", error);
  }

  return Response.json({ ok: true });
}
