"use client";

import { useTeamModal } from "@/components/overlay/overlay-context";
import { Headshot } from "@/components/ui/headshot";
import { teamForPracticeArea } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The people who work in a practice area: a row of headshots, each opening
 * that person's profile modal (the same one the team cards use). Renders
 * nothing until the firm has named anyone for the area, so a page never shows
 * an empty "Your lawyers" label.
 */
export function PracticeTeam({
  slug,
  onDark,
  className,
}: {
  /** Practice-area slug, matching `practiceAreas` on the team entries. */
  slug: string;
  onDark: boolean;
  className?: string;
}) {
  const { openMember } = useTeamModal();
  const members = teamForPracticeArea(slug);
  if (members.length === 0) return null;

  const muted = onDark ? "text-text-muted-on-dark" : "text-text-muted-on-light";

  return (
    <div className={className}>
      <p className={cn("type-label", muted)}>Who you&rsquo;ll deal with</p>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-5">
        {members.map((member) => (
          <li key={member.id}>
            <button
              type="button"
              onClick={() => openMember(member.id)}
              aria-label={`View ${member.name}'s profile`}
              className="group flex w-24 flex-col gap-2 text-left focus-visible:outline-none"
            >
              <Headshot
                id={member.id}
                name={member.name}
                role={member.role}
                sizes="96px"
                tone={onDark ? "surface" : "navy"}
                size="badge"
                className="w-24 border border-transparent transition-opacity duration-150 group-hover:opacity-80 group-focus-visible:border-current"
              />
              <span className="type-small font-medium leading-snug">
                {member.name}
              </span>
              <span className={cn("type-xs leading-snug", muted)}>
                {member.role}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
