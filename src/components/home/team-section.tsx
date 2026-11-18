import { TeamGrid } from "@/components/site/team-grid";
import { Eyebrow, Section } from "@/components/ui/section";
import { getContent } from "@/sanity/content";

export async function TeamSection() {
  const copy = (await getContent()).home.team;
  return (
    <Section tone="surface" id="team" className="scroll-mt-38">
      <div className="flex flex-col items-center text-center">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h2 className="type-h2 mt-4">{copy.heading}</h2>
        <p className="type-small mt-5 max-w-xl text-text-muted-on-light">
          {copy.intro}
        </p>
      </div>

      <div className="mt-12 md:mt-16">
        <TeamGrid />
      </div>
    </Section>
  );
}
