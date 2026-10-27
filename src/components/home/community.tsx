import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, Section } from "@/components/ui/section";
import { communityIntro, communityOrgs } from "@/content/community";
import { cn } from "@/lib/cn";

/**
 * Community Support — a simple logo wall. Logos keep their original colours on
 * a white tile at a consistent size. Alt text: "<Organisation> logo".
 *
 * Each logo fills the tile's content box (`h-full w-full object-contain`) rather
 * than sizing itself from the image's intrinsic width. With next/image's `sizes`
 * srcset, a `w-auto` image reports a density-corrected natural width that shrinks
 * on high-DPR screens whenever the source is smaller than the chosen candidate —
 * which made the small-source logos (Make-A-Wish, Hockey, Golf…) render tiny on
 * retina displays and phones.
 */
export function Community() {
  return (
    <Section tone="surface" id="community" className="scroll-mt-38">
      <Reveal className="flex flex-col items-center text-center">
        <Eyebrow>Community</Eyebrow>
        <h2 className="type-h2 mt-4">Community support</h2>
        <p className="type-body mt-5 max-w-2xl text-text-muted-on-light">
          {communityIntro}
        </p>
      </Reveal>

      {/* TODO CONFIRM: short descriptions and event photos per organisation. */}
      <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-16 lg:grid-cols-5">
        {communityOrgs.map((org, index) => (
          <Reveal as="li" key={org.name} delay={(index % 5) * 60}>
            <div
              className={cn(
                "flex h-36 items-center justify-center border border-line-on-light bg-paper md:h-40",
                org.tilePadding ?? "p-5",
              )}
            >
              <Image
                src={org.logo}
                alt={`${org.name} logo`}
                width={org.width}
                height={org.height}
                sizes="(min-width: 1024px) 15vw, (min-width: 640px) 28vw, 44vw"
                className="h-full w-full object-contain"
              />
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
