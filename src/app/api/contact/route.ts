import { Resend } from "resend";

import { site } from "@/content/site";
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

  const name = `${data.firstName} ${data.lastName}`.trim();
  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #14213d; line-height: 1.5;">
      <h2 style="font-family: Helvetica, Arial, sans-serif; margin: 0 0 16px;">New website enquiry</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr><td style="padding: 4px 16px 4px 0;"><strong>Name</strong></td><td style="padding: 4px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 4px 16px 4px 0;"><strong>Email</strong></td><td style="padding: 4px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        ${
          data.phone
            ? `<tr><td style="padding: 4px 16px 4px 0;"><strong>Phone</strong></td><td style="padding: 4px 0;">${escapeHtml(data.phone)}</td></tr>`
            : ""
        }
      </table>
      <h3 style="font-family: Helvetica, Arial, sans-serif; margin: 24px 0 8px;">Message</h3>
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(data.message)}</p>
      <hr style="border: none; border-top: 1px solid #d7d9dd; margin: 24px 0;" />
      <p style="font-size: 13px; color: #4a4f5c; margin: 0;">
        Sent from the contact form at ${escapeHtml(site.url)}
      </p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // TODO: replace with a verified sending domain in Resend, e.g.
      // "O'Briens Solicitors <website@obriens-solicitors.com.au>".
      from:
        process.env.CONTACT_EMAIL_FROM ??
        "O'Briens Solicitors <onboarding@resend.dev>",
      to: [to],
      replyTo: data.email,
      subject: `Website enquiry from ${name}`,
      html,
      text: `New website enquiry\n\nName: ${name}\nEmail: ${data.email}${
        data.phone ? `\nPhone: ${data.phone}` : ""
      }\n\n${data.message}\n`,
    });

    if (error) {
      console.error("[contact] resend error", error);
      return jsonError("send-failed", 502);
    }
  } catch (error) {
    console.error("[contact] send failed", error);
    return jsonError("send-failed", 502);
  }

  return Response.json({ ok: true });
}
