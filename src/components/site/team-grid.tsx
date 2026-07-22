import { SocialIcon } from "@/components/icons";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { team } from "@/content/site";

/** Team card grid, shared by the home page and /team. */
export function TeamGrid() {
  return (
    <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((member, index) => (
        <li
          key={`${member.name}-${index}`}
          className="flex flex-col items-center gap-5 text-center"
        >
          <PlaceholderImage ratio="1/1" />
          <div>
            <p className="type-small font-bold">{member.name}</p>
            <p className="type-small">{member.role}</p>
          </div>
          <p className="type-small text-text-muted-on-light">{member.blurb}</p>

          {/* Config-driven: renders nothing while a member has no socials. */}
          {member.socials.length > 0 ? (
            <ul className="flex items-center gap-4">
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
        </li>
      ))}
    </ul>
  );
}
