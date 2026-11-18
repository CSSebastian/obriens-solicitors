import { listEnquiries } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

const COLUMNS = [
  "submittedAt",
  "firstName",
  "lastName",
  "email",
  "phone",
  "areaOfLaw",
  "message",
  "emailStatus",
] as const;

const cell = (value: unknown) => {
  const text = String(value ?? "");
  // Quote every cell; neutralise spreadsheet formulas.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

/** All saved enquiries as a CSV download (protected by src/proxy.ts). */
export async function GET() {
  const rows = await listEnquiries(5000);
  const csv = [COLUMNS.join(","), ...rows.map((row) => COLUMNS.map((c) => cell(row[c])).join(","))].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="obriens-enquiries-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
