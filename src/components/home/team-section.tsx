import { TeamGrid } from "@/components/site/team-grid";
import { Eyebrow, Section } from "@/components/ui/section";

export function TeamSection() {
  return (
    <Section tone="surface" id="team" className="scroll-mt-24">
      <div className="flex flex-col items-center text-center">
        <Eyebrow>People</Eyebrow>
        <h2 className="type-h2 mt-4">Meet the team</h2>
        <p className="type-small mt-5 max-w-xl text-text-muted-on-light">
          Meet the local team who&rsquo;ll look after you.
        </p>
      </div>

      <div className="mt-12 md:mt-16">
        <TeamGrid />
      </div>
    </Section>
  );
}
