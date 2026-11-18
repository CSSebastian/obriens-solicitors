import type { CurrentUser, SchemaTypeDefinition } from "sanity";

/**
 * Sections the client can see but not change. Administrators (and
 * Developers) can still edit them; everyone else gets them read-only, with no
 * publish, delete or create options.
 *
 * Add or remove document type names here, then redeploy the Studio
 * (`npm run deploy`).
 */
export const LOCKED_TYPES: string[] = [];

const UNLOCKED_ROLES = new Set(["administrator", "developer"]);

export const canEditLocked = (user: Omit<CurrentUser, "role"> | null | undefined): boolean =>
  Boolean(user?.roles.some((role) => UNLOCKED_ROLES.has(role.name)));

export const isLocked = (type: string) => LOCKED_TYPES.includes(type);

/** Make locked document types read-only for everyone who can't edit them. */
export function withLocks<T extends SchemaTypeDefinition>(types: T[]): T[] {
  return types.map((type) =>
    isLocked(type.name)
      ? ({
          ...type,
          readOnly: ({ currentUser }: { currentUser: Omit<CurrentUser, "role"> | null }) =>
            !canEditLocked(currentUser),
        } as T)
      : type,
  );
}
