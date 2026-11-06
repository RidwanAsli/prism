import { Plus } from "lucide-react";

import { AuroraText } from "@/components/magicui/aurora-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { SectionHeading } from "@/components/site/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Is everything here really free?",
    answer:
      "Yes. All 78 components are MIT-licensed, pulled straight from the official Magic UI registry. Hit the copy icon on any gallery card — that install command is the real deal.",
  },
  {
    question: "How do I add these to my project?",
    answer:
      "Copy the command from any card and run it in your terminal. The component's source drops directly into your codebase — yours to keep, fork, and break.",
  },
  {
    question: "Why does this page exist?",
    answer:
      "Flexing, mostly. PRISM is a love letter to Magic UI — a museum where every free component runs live instead of living in screenshots.",
  },
  {
    question: "Which frameworks are supported?",
    answer:
      "Anything React: Next.js, Vite, Remix, you name it. The components are plain React + Tailwind CSS + Motion with zero other runtime dependencies.",
  },
  {
    question: "Who built Magic UI?",
    answer:
      "Magic UI is an open-source project maintained by its community. PRISM is an independent showcase built on top — all credit for the components goes to the original authors.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Questions"
          title={
            <>
              Asked,{" "}
              <AuroraText colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}>
                answered
              </AuroraText>
              .
            </>
          }
        />

        <Accordion type="single" collapsible className="mx-auto mt-12 max-w-3xl">
          {FAQS.map((item, i) => (
            <BlurFade key={item.question} delay={i * 0.07} inView>
              <div className="mb-3 rounded-2xl border border-border/70 bg-card px-6 transition-colors hover:border-primary/30">
                <AccordionItem value={`faq-${i}`} className="border-b-0">
                  <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]>svg]:rotate-45">
                    {item.question}
                    <Plus
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-300"
                      aria-hidden="true"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            </BlurFade>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
