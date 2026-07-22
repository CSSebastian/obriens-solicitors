"use client";

import { useId, useState } from "react";

import { useChatUi } from "@/components/overlay/overlay-context";
import { FaqsDesktop } from "@/components/home/faqs-desktop";
import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { faqs } from "@/content/site";

export function Faqs() {
  const { openChat } = useChatUi();
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section tone="surface" id="faqs" className="scroll-mt-24">
      <h2 className="type-h2">FAQs</h2>
      <p className="type-body mt-4">
        Answers to questions about our services and how we work.
      </p>

      {/* Desktop (lg+): sticky index with scroll-linked label/number swap. */}
      <FaqsDesktop faqs={faqs} sectionIdPrefix={`${baseId}-faq`} />

      {/* Mobile / tablet: accordion, one answer open at a time ----------- */}
      <div className="mt-10 border-t border-line-on-light lg:hidden">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${baseId}-trigger-${index}`;
          const panelId = `${baseId}-panel-${index}`;
          return (
            <div key={faq.question} className="border-b border-line-on-light">
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left type-small font-bold"
                >
                  {faq.question}
                  <ChevronDownIcon
                    className={`size-4 shrink-0 transition-transform duration-150 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="flex flex-col gap-3 pb-5"
              >
                {faq.answer.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="type-small text-text-muted-on-light"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Still have questions? ------------------------------------------- */}
      <div className="mt-14 md:mt-20">
        <h3 className="type-h3">Still have questions?</h3>
        <p className="type-small mt-5 max-w-lg text-text-muted-on-light">
          We&rsquo;re here to help. Find answers to frequently asked questions
          with our chat bot. If it can&rsquo;t help, we&rsquo;ll direct your
          enquiry to our team.
        </p>
        <Button variant="outline" className="mt-8" onClick={openChat}>
          AI Chat Bot
        </Button>
      </div>
    </Section>
  );
}
