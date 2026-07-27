"use client";

import { ChevronRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { useTeamModal } from "@/components/overlay/overlay-context";
import { Card, CardBody } from "@/components/ui/card";
import { Headshot } from "@/components/ui/headshot";
import { Eyebrow } from "@/components/ui/section";
import { teamByTier, teamTiers, type TeamMember } from "@/content/site";

/**
 * Team card grid, shared by the home page and /team. People are grouped into
 * tiers (Directors / Solicitors / Support team). Each card opens a profile
 * modal via the shared overlay context. Cards show the firm's headshot, or an
 * initials monogram for anyone without one.
 */
export function TeamGrid() {
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {teamTiers.map(({ tier, label }) => {
        const members = teamByTier(tier);
        if (members.length === 0) return null;
        return (
          <section key={tier}>
            <Eyebrow>{label}</Eyebrow>
            <ul className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <Reveal as="li" key={member.id} delay={(index % 3) * 80}>
                  <TeamCard member={member} />
                </Reveal>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const { openMember } = useTeamModal();
  return (
    <Card tone="light" className="h-full">
      <Headshot
        id={member.id}
        name={member.name}
        role={member.role}
        // Three up at the 1440px frame, two at sm, one below.
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        tone="navy"
        className="w-full"
      />
      <CardBody className="gap-4">
        <div>
          <p className="type-h4">{member.name}</p>
          <p className="type-small mt-1 text-text-muted-on-light">
            {member.role}
          </p>
        </div>
        <p className="type-small text-text-muted-on-light">{member.blurb}</p>
        <button
          type="button"
          onClick={() => openMember(member.id)}
          aria-label={`View ${member.name}'s profile`}
          className="group mt-auto inline-flex items-center gap-2 self-start pt-1 type-small font-medium transition-opacity hover:opacity-70"
        >
          View profile
          <ChevronRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </button>
      </CardBody>
    </Card>
  );
}
