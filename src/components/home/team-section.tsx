import { TeamGrid } from "@/components/site/team-grid";
import { Eyebrow, Section } from "@/components/ui/section";

export function TeamSection() {
  return (
    <Section tone="surface">
      <div className="flex flex-col items-center text-center">
        <Eyebrow>People</Eyebrow>
        <h2 className="type-h2 mt-4">The solicitors</h2>
        <p className="type-small mt-5">Meet the team who handles your case</p>
      </div>

      <div className="mt-12 md:mt-16">
        <TeamGrid />
      </div>
    </Section>
  );
}
