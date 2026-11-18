import type { CurrentUser, SchemaTypeDefinition } from "sanity";

/**
 * What the client can see but not change. Administrators (and Developers)
 * can still edit everything; everyone else sees these as read-only.
 * After changing this file, redeploy the Studio (`npm run deploy`).
 */

/** Whole sections: read-only, with no publish, delete or create options. */
export const LOCKED_TYPES: string[] = ["pageIntros"];

/**
 * Sections whose documents can be edited but not added, removed or
 * reordered (the list itself is fixed).
 */
export const FIXED_LIST_TYPES: string[] = ["teamMember"];

/** Fields locked wherever they appear (the small labels above headings). */
const LOCKED_FIELDS_EVERYWHERE = new Set(["eyebrow", "coverLabel"]);

/** Fields locked on particular document types. */
const LOCKED_FIELDS_BY_TYPE: Record<string, string[]> = {
  // The menu label of each practice area.
  practiceArea: ["navLabel"],
  // Staff names, titles and photos.
  teamMember: ["name", "slug", "role", "photo"],
};

const UNLOCKED_ROLES = new Set(["administrator", "developer"]);

type User = Omit<CurrentUser, "role"> | null | undefined;

export const canEditLocked = (user: User): boolean =>
  Boolean(user?.roles.some((role) => UNLOCKED_ROLES.has(role.name)));

export const isLocked = (type: string) => LOCKED_TYPES.includes(type);
export const isFixedList = (type: string) => FIXED_LIST_TYPES.includes(type);

const lockedReadOnly = ({ currentUser }: { currentUser: User }) => !canEditLocked(currentUser);

type FieldDef = { name: string; fields?: FieldDef[]; readOnly?: unknown; description?: unknown };

/** Lock matching fields, including those nested inside object fields. */
function lockFields(fields: FieldDef[], lockedHere: Set<string>): FieldDef[] {
  return fields.map((field) => {
    const nested = field.fields ? { fields: lockFields(field.fields, new Set()) } : {};
    const locked = LOCKED_FIELDS_EVERYWHERE.has(field.name) || lockedHere.has(field.name);
    return locked ? { ...field, ...nested, readOnly: lockedReadOnly } : { ...field, ...nested };
  });
}

/** Apply the locks above to the schema. */
export function withLocks<T extends SchemaTypeDefinition>(types: T[]): T[] {
  return types.map((type) => {
    if (isLocked(type.name)) return { ...type, readOnly: lockedReadOnly } as T;
    const def = type as unknown as { fields?: FieldDef[] };
    if (!def.fields) return type;
    const lockedHere = new Set(LOCKED_FIELDS_BY_TYPE[type.name] ?? []);
    return { ...type, fields: lockFields(def.fields, lockedHere) } as T;
  });
}
