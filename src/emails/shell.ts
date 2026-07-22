import { site } from "@/content/site";

/** Everything both templates need about a single enquiry. */
export interface Enquiry {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  /** When the form was submitted (formatted to Adelaide time for display). */
  submittedAt: Date;
  /** Where it came from — the site URL or referring page. */
  source: string;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

export const fullName = (e: Pick<Enquiry, "firstName" | "lastName">): string =>
  `${e.firstName} ${e.lastName}`.trim();

/** Submission time in Australian Central Time (Adelaide). */
export function formatAdelaide(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Adelaide",
  }).format(date);
}

/**
 * Shared building blocks for the firm's transactional emails.
 *
 * HTML email is NOT web HTML: table-based layout, inline styles, no
 * flex/grid/positioning, bulletproof buttons, square corners (zero radius),
 * and a robust font fallback because web fonts don't load in Outlook & co.
 * Change branding in ONE place — here.
 */

/* ---- Brand tokens (sampled from the site) ---- */
export const brand = {
  navy: "#14213D",
  navyDeep: "#101A30",
  pageBg: "#F1F2F4",
  card: "#FFFFFF",
  block: "#F5F6F8",
  heading: "#14213D",
  body: "#3A4356",
  muted: "#6A707E",
  line: "#D7D9DD",
  onDark: "#F8F9FA",
  onDarkMuted: "#AEB6C6",
} as const;

/** Sans for headings, serif for body — with client-safe fallbacks. */
export const fontSans =
  "'DM Sans', Helvetica, Arial, -apple-system, BlinkMacSystemFont, sans-serif";
export const fontSerif =
  "'PT Serif', Georgia, 'Times New Roman', Times, serif";

/** Absolute base for email assets (logo). Never a relative path. */
export const emailAssetBase = (
  process.env.NEXT_PUBLIC_SITE_URL ?? site.url
).replace(/\/$/, "");

export const logoUrl = `${emailAssetBase}/email/logo.png`;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Escape, then preserve the enquirer's line breaks. */
export function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

/**
 * Bulletproof button — a styled table cell wrapping an anchor, not a bare <a>.
 * Square corners; ≥44px tall via generous padding.
 */
export function button({
  href,
  label,
  variant = "primary",
}: {
  href: string;
  label: string;
  /** primary = solid navy; light = off-white on navy contexts. */
  variant?: "primary" | "light";
}): string {
  const bg = variant === "primary" ? brand.navy : brand.onDark;
  const fg = variant === "primary" ? brand.onDark : brand.navy;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr>
        <td align="center" bgcolor="${bg}" style="background:${bg};border-radius:0;">
          <a href="${escapeHtml(href)}"
             style="display:inline-block;padding:14px 26px;font-family:${fontSerif};font-size:16px;line-height:20px;color:${fg};text-decoration:none;border:1px solid ${bg};min-height:20px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

/** A muted label/value block used for the "record" and detail tables. */
export function detailRows(
  rows: { label: string; valueHtml: string }[],
): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
      ${rows
        .map(
          (r) => `
        <tr>
          <td valign="top" style="padding:6px 16px 6px 0;font-family:${fontSans};font-size:14px;line-height:20px;color:${brand.muted};white-space:nowrap;">${escapeHtml(
            r.label,
          )}</td>
          <td valign="top" style="padding:6px 0;font-family:${fontSerif};font-size:16px;line-height:22px;color:${brand.body};">${r.valueHtml}</td>
        </tr>`,
        )
        .join("")}
    </table>`;
}

/** Shared muted footer: contact details + liability line + ABN. */
function footer(): string {
  return `
    <tr>
      <td align="center" style="padding:24px 32px 8px;font-family:${fontSans};font-size:13px;line-height:20px;color:${brand.muted};">
        <strong style="color:${brand.body};">${escapeHtml(site.name)}</strong><br />
        <a href="${site.mapsUrl}" style="color:${brand.muted};text-decoration:none;">${escapeHtml(
          site.address,
        )}</a><br />
        <a href="${site.phoneHref}" style="color:${brand.muted};text-decoration:underline;">${escapeHtml(
          site.phone,
        )}</a>
        &nbsp;&middot;&nbsp;
        <a href="${site.emailHref}" style="color:${brand.muted};text-decoration:underline;">${escapeHtml(
          site.email,
        )}</a>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:8px 32px 28px;font-family:${fontSans};font-size:12px;line-height:18px;color:${brand.muted};">
        ${escapeHtml(site.liabilityStatement)}<br />
        ABN ${escapeHtml(site.abn)}
      </td>
    </tr>`;
}

/**
 * Full email document. `contentHtml` is dropped into the white card;
 * `preFooterHtml` (e.g. legal wording) sits between the card and the footer.
 */
export function renderEmail({
  title,
  previewText,
  contentHtml,
  preFooterHtml = "",
}: {
  title: string;
  previewText: string;
  contentHtml: string;
  preFooterHtml?: string;
}): string {
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin:0; padding:0; width:100% !important; }
    img { border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
    a { color:${brand.navy}; }
    @media only screen and (max-width:600px) {
      .email-container { width:100% !important; }
      .px { padding-left:24px !important; padding-right:24px !important; }
      .band { padding-left:24px !important; padding-right:24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${brand.pageBg};">
  <!-- preheader: shown in the inbox preview, hidden in the body -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${brand.pageBg};opacity:0;">
    ${escapeHtml(previewText)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${brand.pageBg};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;border-collapse:collapse;">
          <!-- header band -->
          <tr>
            <td align="center" bgcolor="${brand.navy}" class="band" style="background:${brand.navy};padding:28px 32px;">
              <img src="${logoUrl}" width="200" height="58" alt="${escapeHtml(
                site.name,
              )}" style="display:block;width:200px;height:58px;font-family:${fontSans};font-size:20px;font-weight:700;color:${brand.onDark};" />
            </td>
          </tr>
          <!-- content card -->
          <tr>
            <td bgcolor="${brand.card}" class="px" style="background:${brand.card};border:1px solid ${brand.line};border-top:0;padding:32px;">
              ${contentHtml}
            </td>
          </tr>
          ${preFooterHtml}
          ${footer()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
