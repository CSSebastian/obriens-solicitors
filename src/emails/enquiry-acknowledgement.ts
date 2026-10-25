import { site } from "@/content/site";
import {
  brand,
  button,
  detailRows,
  escapeHtml,
  escapeMultiline,
  fontSans,
  fontSerif,
  fullName,
  renderEmail,
  type BuiltEmail,
  type Enquiry,
} from "@/emails/shell";

/**
 * Auto-reply — sent TO the enquirer as an acknowledgement of receipt.
 * `reply_to` is set by the API route to the firm's real inbox so replies
 * reach a human.
 *
 * TODO: firm to review and approve auto-reply legal wording
 * The principal must sign off the acknowledgement + disclaimer copy below
 * before launch.
 */
export function buildAcknowledgementEmail(enquiry: Enquiry): BuiltEmail {
  const name = fullName(enquiry);
  const first = enquiry.firstName || "there";

  const record = [
    { label: "Name", valueHtml: escapeHtml(name) },
    { label: "Email", valueHtml: escapeHtml(enquiry.email) },
    ...(enquiry.phone
      ? [{ label: "Phone", valueHtml: escapeHtml(enquiry.phone) }]
      : []),
    { label: "Area of law", valueHtml: escapeHtml(enquiry.areaOfLaw) },
  ];

  const content = `
    <h1 style="margin:0 0 12px;font-family:${fontSans};font-size:24px;line-height:30px;font-weight:700;color:${brand.heading};">
      Thank you for your enquiry
    </h1>
    <p style="margin:0 0 16px;font-family:${fontSerif};font-size:16px;line-height:24px;color:${brand.body};">
      Hi ${escapeHtml(first)},
    </p>
    <p style="margin:0 0 16px;font-family:${fontSerif};font-size:16px;line-height:24px;color:${brand.body};">
      Thank you for getting in touch with ${escapeHtml(
        site.name,
      )}. We&rsquo;ve received your message and someone from our team will be in
      touch with you soon.
    </p>
    <p style="margin:0 0 24px;font-family:${fontSerif};font-size:16px;line-height:24px;color:${brand.body};">
      Our office hours are <strong>${escapeHtml(
        site.hours,
      )}</strong>, so if you&rsquo;ve written to us outside those times we&rsquo;ll
      reply on the next business day.
    </p>

    <!-- Call button -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 28px;">
      <tr><td>${button({ href: site.phoneHref, label: "Call our office" })}</td></tr>
    </table>

    <div style="border-top:1px solid ${brand.line};"></div>

    <p style="margin:20px 0 8px;font-family:${fontSans};font-size:14px;line-height:20px;color:${brand.muted};">
      A copy of what you sent us
    </p>
    ${detailRows(record)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;margin-top:8px;">
      <tr>
        <td bgcolor="${brand.block}" style="background:${brand.block};border:1px solid ${brand.line};padding:16px 18px;font-family:${fontSerif};font-size:15px;line-height:23px;color:${brand.body};">
          ${escapeMultiline(enquiry.message)}
        </td>
      </tr>
    </table>`;

  // Required disclaimer, small muted, above the footer.
  const preFooter = `
    <tr>
      <td class="px" style="padding:20px 32px 4px;font-family:${fontSans};font-size:12px;line-height:18px;color:${brand.muted};">
        This is an automated acknowledgement that we have received your message.
        It does not create a lawyer&ndash;client relationship &mdash; no such
        relationship exists until ${escapeHtml(
          site.name,
        )} has formally accepted your matter in writing. Nothing in this email is
        legal advice. If your matter is urgent or you are facing an approaching
        deadline, please phone our office on
        <a href="${site.phoneHref}" style="color:${brand.muted};text-decoration:underline;">${escapeHtml(
          site.phone,
        )}</a>
        rather than waiting for a reply.
      </td>
    </tr>`;

  const html = renderEmail({
    title: `We've received your enquiry — ${site.name}`,
    previewText: `Thanks ${first} — we've received your message and will be in touch. Office hours: ${site.hours}.`,
    contentHtml: content,
    preFooterHtml: preFooter,
  });

  const text = [
    `Thank you for your enquiry`,
    "",
    `Hi ${first},`,
    "",
    `Thank you for getting in touch with ${site.name}. We've received your message and someone from our team will be in touch with you soon.`,
    "",
    `Our office hours are ${site.hours}, so if you've written outside those times we'll reply on the next business day.`,
    "",
    `Call our office: ${site.phone}`,
    "",
    "A COPY OF WHAT YOU SENT US",
    `Name:  ${name}`,
    `Email: ${enquiry.email}`,
    ...(enquiry.phone ? [`Phone: ${enquiry.phone}`] : []),
    `Area of law: ${enquiry.areaOfLaw}`,
    "",
    enquiry.message,
    "",
    "----",
    "This is an automated acknowledgement that we have received your message. It does not create a lawyer-client relationship - no such relationship exists until the firm has formally accepted your matter in writing. Nothing in this email is legal advice. If your matter is urgent or you are facing an approaching deadline, please phone our office rather than waiting for a reply.",
    "",
    site.name,
    site.address,
    `${site.phone} · ${site.email}`,
    site.liabilityStatement,
    `ABN ${site.abn}`,
  ].join("\n");

  return {
    subject: `We've received your enquiry — ${site.name}`,
    html,
    text,
  };
}
