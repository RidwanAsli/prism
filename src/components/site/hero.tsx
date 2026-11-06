"use client"

import { motion } from "motion/react"
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Star,
} from "lucide-react"

import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { AuroraText } from "@/components/magicui/aurora-text"
import { AvatarCircles } from "@/components/magicui/avatar-circles"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BorderBeam } from "@/components/magicui/border-beam"
import { FlickeringGrid } from "@/components/magicui/flickering-grid"
import { Iphone } from "@/components/magicui/iphone"
import { MagicCard } from "@/components/magicui/magic-card"
import { Meteors } from "@/components/magicui/meteors"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { Particles } from "@/components/magicui/particles"
import { Safari } from "@/components/magicui/safari"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { WordRotate } from "@/components/magicui/word-rotate"
import { cn } from "@/lib/utils"

const SPARKLINE_PATH =
  "M0 26 C6 25 9 20 14 21 C19 22 22 14 28 15 C34 16 36 22 42 20 C48 18 50 10 57 11 C64 12 66 17 72 14 C78 11 82 6 88 7 C93 8 96 5 100 4"

function Sparkline({
  gradientId,
  className,
}: {
  gradientId: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-8 w-full", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${SPARKLINE_PATH} L100 32 L0 32 Z`}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.6 }}
      />
      <motion.path
        d={SPARKLINE_PATH}
        fill="none"
        stroke="#a78bfa"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  )
}

function EngagementCard({
  gradientId,
  className,
}: {
  gradientId: string
  className?: string
}) {
  return (
    <MagicCard
      className={cn("w-full rounded-2xl p-5", className)}
      gradientColor="#8b5cf6"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Engagement
      </p>
      <div className="mt-2.5 flex items-baseline gap-1">
        <span className="font-display text-2xl font-semibold text-primary">
          +
        </span>
        <NumberTicker
          value={248.4}
          decimalPlaces={1}
          className="font-display text-3xl font-bold tracking-tight text-foreground"
        />
        <span className="font-display text-2xl font-semibold text-muted-foreground">
          %
        </span>
      </div>
      <Sparkline gradientId={gradientId} className="mt-3" />
      <span className="mt-3 inline-flex items-center rounded-full border border-border/70 bg-card/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        number-ticker · magic-card
      </span>
    </MagicCard>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
      {/* Cosmic backdrop */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="glow-orb -top-40 -left-40 size-[480px] bg-violet-600/20" />
        <div className="glow-orb top-1/3 -right-40 size-[420px] bg-fuchsia-600/15" />
        <div className="glow-orb bottom-0 left-1/3 size-[380px] bg-cyan-500/10" />
        <FlickeringGrid
          color="#8b5cf6"
          maxOpacity={0.22}
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,white,transparent)]"
        />
        <Particles quantity={90} color="#a78bfa" className="absolute inset-0" />
        <Meteors number={12} />
      </div>

      {/* Copy */}
      <div className="relative mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <BlurFade delay={0} inView direction="up">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/50 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            <AnimatedGradientText
              colorFrom="var(--brand-violet)"
              colorTo="var(--brand-fuchsia)"
              className="text-sm font-medium"
            >
              The complete Magic UI collection
            </AnimatedGradientText>
            <span
              className="size-1 rounded-full bg-muted-foreground/30"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              78 free
            </span>
          </div>
        </BlurFade>

        <BlurFade delay={0.1} inView direction="up">
          <h1 className="mt-8 font-display text-5xl font-bold leading-[1.02] tracking-tighter sm:text-7xl lg:text-[5.5rem]">
            <span className="block">Interfaces that feel</span>
            <span className="block">
              <AuroraText colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}>
                like magic.
              </AuroraText>
            </span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.15} inView direction="up">
          <div className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            PRISM is a living museum of all 78 free Magic UI components — every
            beam, every shimmer, every meteor — woven into one impossibly{" "}
            <span className="inline-flex [&>div]:-my-2">
              <WordRotate
                words={["cosmic", "weightless", "alive", "addictive"]}
                className="font-medium text-foreground"
              />
            </span>{" "}
            page.
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView direction="up">
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ShimmerButton
              background="rgba(139, 92, 246, 1)"
              onClick={() =>
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="h-12 px-8 text-base font-medium"
            >
              Explore the collection
              <ArrowDown className="ml-1.5 size-[18px]" aria-hidden="true" />
            </ShimmerButton>
            <a
              href="#cta"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border/80 bg-card/40 px-8 text-base font-medium backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-card/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Join the waitlist
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </a>
          </div>
        </BlurFade>

        <BlurFade delay={0.25} inView direction="up">
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <AvatarCircles
              numPeople={12400}
              avatarUrls={[
                { imageUrl: "/images/avatar-1.png", profileUrl: "#testimonials" },
                { imageUrl: "/images/avatar-2.png", profileUrl: "#testimonials" },
                { imageUrl: "/images/avatar-3.png", profileUrl: "#testimonials" },
                { imageUrl: "/images/avatar-4.png", profileUrl: "#testimonials" },
                { imageUrl: "/images/avatar-5.png", profileUrl: "#testimonials" },
              ]}
            />
            <div className="flex flex-col items-center gap-1.5 sm:items-start">
              <div
                className="flex items-center gap-0.5 text-amber-400"
                aria-hidden="true"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <span className="sr-only">Rated 5 out of 5</span>
              <p className="text-sm text-muted-foreground">
                5.0 from 2,300+ builders
              </p>
            </div>
          </div>
        </BlurFade>
      </div>

      {/* The stage */}
      <div className="relative mx-auto mt-20 max-w-6xl">
        <div
          aria-hidden="true"
          className="glow-orb -z-10 top-1/2 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 bg-violet-600/10"
        />

        <BlurFade delay={0.35} inView direction="up">
          <div className="relative mx-auto w-full max-w-3xl rounded-xl border border-border/60 bg-card shadow-2xl shadow-violet-950/40">
            <Safari url="prism.dev/overview" imageSrc="/images/dashboard.png" />
            <BorderBeam
              borderWidth={1.5}
              size={260}
              duration={9}
              colorFrom="#a78bfa"
              colorTo="#67e8f9"
            />
          </div>
        </BlurFade>

        <div className="absolute -right-4 -bottom-10 hidden w-44 lg:block xl:-right-14 xl:w-52">
          <BlurFade delay={0.5} inView direction="right">
            <div
              className="relative rotate-[8deg] drop-shadow-[0_25px_50px_rgba(88,28,135,0.35)] transition-transform duration-500 hover:rotate-0"
              style={{ borderRadius: "16.9% / 8.3%" }}
            >
              <Iphone src="/images/app.png" />
              <BorderBeam
                borderWidth={1.5}
                size={120}
                duration={7}
                colorFrom="#a78bfa"
                colorTo="#e879f9"
              />
            </div>
          </BlurFade>
        </div>

        <div className="absolute top-1/2 -left-6 hidden w-60 -translate-y-1/2 -rotate-3 transition-transform duration-500 hover:rotate-0 lg:flex xl:-left-16">
          <BlurFade delay={0.45} inView direction="left" className="w-full">
            <EngagementCard gradientId="engagement-stage" />
          </BlurFade>
        </div>

        <div className="mt-6 lg:hidden">
          <BlurFade delay={0.45} inView direction="up">
            <EngagementCard gradientId="engagement-mobile" />
          </BlurFade>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="mt-16 flex flex-col items-center gap-2 text-muted-foreground/60"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <ChevronDown className="size-4 animate-bounce" />
      </div>
    </section>
  )
}
