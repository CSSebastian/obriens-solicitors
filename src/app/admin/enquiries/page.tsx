import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { formatAdelaide } from "@/emails/shell";
import { hasUpstash } from "@/lib/redis";
import { listEnquiries, type EmailStatus } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Website enquiries",
  robots: { index: false, follow: false },
};

const statusLabel: Record<EmailStatus, string> = {
  sent: "Emailed",
  pending: "Sending…",
  failed: "Email failed",
};

/**
 * Every enquiry sent through the contact form, newest first. Protected by the
 * password in src/proxy.ts. Kept for 12 months.
 */
export default async function EnquiriesPage() {
  const enquiries = await listEnquiries();

  return (
    <section className="bg-surface text-text-on-light">
      <Container>
        <div className="py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="type-h2">Website enquiries</h1>
              <p className="type-small mt-3 text-text-muted-on-light">
                {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}, newest first.
                Kept for 12 months.
              </p>
            </div>
            {enquiries.length > 0 ? (
              <a
                href="/admin/enquiries/export"
                className="inline-flex min-h-11 items-center border border-current px-5 type-small font-bold transition-opacity hover:opacity-70"
              >
                Download CSV
              </a>
            ) : null}
          </div>

          {!hasUpstash ? (
            <p className="type-body mt-10">Enquiry storage isn&rsquo;t connected (Upstash).</p>
          ) : enquiries.length === 0 ? (
            <p className="type-body mt-10">No enquiries yet.</p>
          ) : (
            <ul className="mt-10 flex flex-col gap-6">
              {enquiries.map((e) => (
                <li key={e.id} className="border border-line-on-light bg-paper p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="type-h4">
                      {e.firstName} {e.lastName}
                    </p>
                    <p className="type-xs text-text-muted-on-light">
                      {formatAdelaide(new Date(e.submittedAt))} ·{" "}
                      <span className={e.emailStatus === "failed" ? "font-bold text-[#b42318]" : undefined}>
                        {statusLabel[e.emailStatus]}
                      </span>
                    </p>
                  </div>
                  <p className="type-small mt-2">
                    <a href={`mailto:${e.email}`} className="underline underline-offset-4">
                      {e.email}
                    </a>
                    {e.phone ? (
                      <>
                        {" · "}
                        <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="underline underline-offset-4">
                          {e.phone}
                        </a>
                      </>
                    ) : null}
                    {" · "}
                    {e.areaOfLaw}
                  </p>
                  <p className="type-small mt-4 whitespace-pre-wrap text-text-muted-on-light">{e.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
