"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Star } from "lucide-react";

import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Period = "monthly" | "annual";

interface Plan {
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  suffix: string;
  features: string[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    name: "Hobby",
    tagline: "For side projects and weekend experiments.",
    monthly: 0,
    annual: 0,
    suffix: "/forever",
    features: [
      "All 78 components",
      "MIT license",
      "Community support",
      "Copy-paste installs",
    ],
    cta: "Start building",
  },
  {
    name: "Pro",
    tagline: "For shipping products people screenshot.",
    monthly: 12,
    annual: 9,
    suffix: "/month",
    features: [
      "Everything in Hobby",
      "Priority registry access",
      "Figma kit of every component",
      "Discord office hours",
      "Early previews",
    ],
    cta: "Go Pro",
  },
  {
    name: "Team",
    tagline: "For teams who ship in public.",
    monthly: 49,
    annual: 39,
    suffix: "/month",
    features: [
      "Everything in Pro",
      "Unlimited seats",
      "Shared component kits",
      "SSO & audit logs",
      "Dedicated support",
    ],
    cta: "Contact sales",
  },
];

export function Pricing() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <section id="pricing" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Pricing"
          title={
            <>
              Free as in{" "}
              <AuroraText colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}>
                freedom
              </AuroraText>
              .
            </>
          }
          description="Magic UI itself is MIT-licensed and free forever. These plans are for Prism — the museum gift shop."
        />

        <BlurFade delay={0.1} inView className="mt-12 flex justify-center">
          <div
            className="inline-flex rounded-full border border-border/70 bg-card/60 p-1 backdrop-blur-sm"
            role="group"
            aria-label="Billing period"
          >
            {(["monthly", "annual"] as const).map((value) => {
              const active = period === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  aria-pressed={active}
                  className="relative flex h-10 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {active ? (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full bg-foreground shadow-sm"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.55 }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10 transition-colors",
                      active
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {value === "monthly" ? "Monthly" : "Annual"}
                  </span>
                  {value === "annual" ? (
                    <span className="relative z-10 rounded-full border border-amber-400/25 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                      -25%
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </BlurFade>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => {
            const featured = plan.name === "Pro";
            const price = period === "annual" ? plan.annual : plan.monthly;

            const card = (
              <MagicCard
                gradientColor="#8b5cf6"
                className="flex h-full flex-col rounded-2xl border border-border/70 p-8"
              >
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {plan.name}
                </span>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={period}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="font-display text-5xl font-bold tracking-tight"
                    >
                      ${price}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-sm text-muted-foreground">{plan.suffix}</span>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{plan.tagline}</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {featured ? (
                  <ShimmerButton
                    type="button"
                    background="rgba(139, 92, 246, 1)"
                    className="mt-8 h-11 w-full rounded-full px-8 text-sm font-semibold"
                  >
                    {plan.cta}
                  </ShimmerButton>
                ) : (
                  <Button
                    variant="outline"
                    type="button"
                    className="mt-8 h-11 w-full"
                  >
                    {plan.cta}
                  </Button>
                )}
              </MagicCard>
            );

            if (!featured) {
              return (
                <BlurFade key={plan.name} delay={0.14 + i * 0.08} inView className="h-full">
                  {card}
                </BlurFade>
              );
            }

            return (
              <BlurFade
                key={plan.name}
                delay={0.14 + i * 0.08}
                inView
                className="relative h-full rounded-2xl"
              >
                {card}
                <BorderBeam
                  borderWidth={1.5}
                  colorFrom="#a78bfa"
                  colorTo="#f0abfc"
                  duration={8}
                  size={80}
                />
                <div className="absolute -top-3.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/70 bg-card px-3.5 py-1">
                  <Star
                    className="size-3 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  <AnimatedGradientText
                    colorFrom="var(--brand-violet)"
                    colorTo="var(--brand-fuchsia)"
                    speed={2}
                    className="text-xs font-semibold"
                  >
                    Most popular
                  </AnimatedGradientText>
                </div>
              </BlurFade>
            );
          })}
        </div>

        <BlurFade delay={0.4} inView className="mt-10 text-center">
          <p className="font-mono text-[11px] text-muted-foreground/60">
            Magic UI is free &amp; open source. This pricing page exists purely
            to flex more components.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
