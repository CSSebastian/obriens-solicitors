import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, Section } from "@/components/ui/section";
import { communityIntro, communityOrgs } from "@/content/community";

/**
 * Community Support — a simple logo wall. Logos keep their original colours on
 * a white tile at a consistent size. Alt text: "<Organisation> logo".
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
            <div className="flex h-36 items-center justify-center border border-line-on-light bg-paper p-5 md:h-40">
              <Image
                src={org.logo}
                alt={`${org.name} logo`}
                width={org.width}
                height={org.height}
                sizes="(min-width: 1024px) 15vw, (min-width: 640px) 28vw, 44vw"
                className="max-h-full w-auto max-w-full object-contain"
              />
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
