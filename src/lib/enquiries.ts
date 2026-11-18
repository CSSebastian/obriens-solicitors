import { randomUUID } from "node:crypto";

import type { Enquiry } from "@/emails/shell";
import { redis } from "@/lib/redis";

/**
 * Every contact-form enquiry is saved in Upstash before it is emailed, so
 * nothing is lost if an email fails, and O'Briens can review them at
 * /admin/enquiries. Records are kept for a year, then expire.
 */

const INDEX = "enquiries";
const RETENTION_SECONDS = 365 * 24 * 60 * 60;
const key = (id: string) => `enquiry:${id}`;

export type EmailStatus = "pending" | "sent" | "failed";

export interface StoredEnquiry extends Omit<Enquiry, "submittedAt"> {
  id: string;
  /** ISO timestamp. */
  submittedAt: string;
  emailStatus: EmailStatus;
}

/** Save an enquiry; returns its id, or null when Upstash isn't configured. */
export async function saveEnquiry(enquiry: Enquiry): Promise<string | null> {
  if (!redis) return null;
  const id = randomUUID();
  const record: StoredEnquiry = {
    ...enquiry,
    id,
    submittedAt: enquiry.submittedAt.toISOString(),
    emailStatus: "pending",
  };
  const now = enquiry.submittedAt.getTime();
  await redis
    .multi()
    .set(key(id), record, { ex: RETENTION_SECONDS })
    .zadd(INDEX, { score: now, member: id })
    // Drop index entries whose records have expired.
    .zremrangebyscore(INDEX, 0, now - RETENTION_SECONDS * 1000)
    .exec();
  return id;
}

/** Record whether the email to O'Briens went out. */
export async function setEmailStatus(id: string | null, status: EmailStatus): Promise<void> {
  if (!redis || !id) return;
  const record = await redis.get<StoredEnquiry>(key(id));
  if (record) await redis.set(key(id), { ...record, emailStatus: status }, { keepTtl: true });
}

/** Most recent enquiries first. */
export async function listEnquiries(limit = 500): Promise<StoredEnquiry[]> {
  if (!redis) return [];
  const ids = await redis.zrange<string[]>(INDEX, 0, limit - 1, { rev: true });
  if (!ids.length) return [];
  const records = await redis.mget<(StoredEnquiry | null)[]>(...ids.map(key));
  return records.filter((record): record is StoredEnquiry => Boolean(record));
}
