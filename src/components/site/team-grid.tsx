import { SocialIcon } from "@/components/icons";
import { Card, CardBody } from "@/components/ui/card";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { team } from "@/content/site";

/** Team card grid, shared by the home page and /team. */
export function TeamGrid() {
  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((member, index) => (
        <Card as="li" key={`${member.name}-${index}`} tone="light">
          <PlaceholderImage ratio="1/1" />
          <CardBody className="gap-4">
            <div>
              <p className="type-small font-bold">{member.name}</p>
              <p className="type-small text-text-muted-on-light">
                {member.role}
              </p>
            </div>
            <p className="type-small text-text-muted-on-light">{member.blurb}</p>

            {/* Config-driven: renders nothing while a member has no socials. */}
            {member.socials.length > 0 ? (
              <ul className="mt-auto flex items-center gap-4 pt-1">
                {member.socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${member.name} on ${social.label}`}
                      className="inline-flex transition-opacity hover:opacity-70"
                    >
                      <SocialIcon platform={social.platform} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </CardBody>
        </Card>
      ))}
    </ul>
  );
}
