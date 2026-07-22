import { site } from "@/content/site";
import {
  brand,
  detailRows,
  escapeHtml,
  escapeMultiline,
  fontSans,
  fontSerif,
  formatAdelaide,
  fullName,
  renderEmail,
  type BuiltEmail,
  type Enquiry,
} from "@/emails/shell";

/**
 * Internal notification — sent TO the firm, optimised for triage.
 * `reply_to` is set by the API route to the enquirer's email (unchanged).
 */
export function buildNotificationEmail(enquiry: Enquiry): BuiltEmail {
  const name = fullName(enquiry);
  const when = formatAdelaide(enquiry.submittedAt);

  const rows = [
    { label: "Name", valueHtml: escapeHtml(name) },
    {
      label: "Email",
      valueHtml: `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:${brand.navy};">${escapeHtml(
        enquiry.email,
      )}</a>`,
    },
  ];
  if (enquiry.phone) {
    rows.push({
      label: "Phone",
      valueHtml: `<a href="tel:${escapeHtml(
        enquiry.phone.replace(/[^0-9+]/g, ""),
      )}" style="color:${brand.navy};">${escapeHtml(enquiry.phone)}</a>`,
    });
  }

  const content = `
    <h1 style="margin:0 0 4px;font-family:${fontSans};font-size:24px;line-height:30px;font-weight:700;color:${brand.heading};">
      New website enquiry
    </h1>
    <p style="margin:0 0 24px;font-family:${fontSerif};font-size:16px;line-height:24px;color:${brand.muted};">
      A new message has come through the website contact form.
    </p>

    ${detailRows(rows)}

    <div style="margin:24px 0 0;border-top:1px solid ${brand.line};"></div>

    <p style="margin:20px 0 8px;font-family:${fontSans};font-size:14px;line-height:20px;color:${brand.muted};">
      Message
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
      <tr>
        <td bgcolor="${brand.block}" style="background:${brand.block};border:1px solid ${brand.line};padding:16px 18px;font-family:${fontSerif};font-size:16px;line-height:24px;color:${brand.body};">
          ${escapeMultiline(enquiry.message)}
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;font-family:${fontSans};font-size:12px;line-height:18px;color:${brand.muted};">
      Received ${escapeHtml(when)} (Adelaide) &middot; via
      <a href="${escapeHtml(enquiry.source)}" style="color:${brand.muted};">${escapeHtml(
        enquiry.source,
      )}</a>
    </p>`;

  const html = renderEmail({
    title: `New enquiry — ${name}`,
    previewText: `${name}: ${enquiry.message.slice(0, 90)}`,
    contentHtml: content,
  });

  const text = [
    "NEW WEBSITE ENQUIRY",
    "",
    `Name:  ${name}`,
    `Email: ${enquiry.email}`,
    ...(enquiry.phone ? [`Phone: ${enquiry.phone}`] : []),
    "",
    "Message:",
    enquiry.message,
    "",
    "----",
    `Received ${when} (Adelaide)`,
    `Via ${enquiry.source}`,
    site.name,
  ].join("\n");

  return { subject: `New enquiry — ${name}`, html, text };
}
