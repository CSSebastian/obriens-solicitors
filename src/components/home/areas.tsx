import { Reveal } from "@/components/motion/reveal";
import { ServiceAreaMap } from "@/components/home/service-area-map";
import { Eyebrow, Section } from "@/components/ui/section";
import { getContent } from "@/sanity/content";

/**
 * "Areas we service" — approved copy, the text list of locations (always
 * rendered, so nothing depends on the map) and the interactive Google map.
 */
export async function Areas() {
  const copy = (await getContent()).home.areas;
  return (
    <Section tone="navy-deep" id="areas" className="scroll-mt-38">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 className="type-h2 mt-4">{copy.heading}</h2>
          <p className="type-body mt-6 max-w-xl">{copy.intro}</p>

          <dl className="mt-8 flex max-w-xl flex-col gap-5">
            {copy.list.map((item) => (
              <div key={item.heading}>
                <dt className="type-small font-bold">{item.heading}</dt>
                <dd className="type-small mt-1 text-text-muted-on-dark">
                  {item.text}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <ServiceAreaMap variant="region" />
        </Reveal>
      </div>
    </Section>
  );
}
