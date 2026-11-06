"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  Atom,
  Braces,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  LineChart,
  Palette,
  Rocket,
  Server,
  Sparkles,
  Terminal as TerminalIcon,
  Wand2,
  Zap,
} from "lucide-react";
import type { COBEOptions } from "cobe";

import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { DottedMap } from "@/components/magicui/dotted-map";
import { Globe } from "@/components/magicui/globe";
import { IconCloud } from "@/components/magicui/icon-cloud";
import { KineticText } from "@/components/magicui/kinetic-text";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { SparklesText } from "@/components/magicui/sparkles-text";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
import { CopyButton } from "@/components/site/copy-button";
import { SectionHeading } from "@/components/site/section-heading";

/* ──────────────────────────────────────────────────────────────────────── */
/*  Constants (module scope: stable references keep canvas components      */
/*  from re-initializing on re-render)                                     */
/* ──────────────────────────────────────────────────────────────────────── */

const INSTALL_COMMAND =
  'bunx shadcn@latest add "https://magicui.design/r/border-beam.json"';

/** Custom globe config — violet markers, ten cities (module-level so the
 *  cobe instance is created once; an inline object would re-mount it). */
const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [167 / 255, 139 / 255, 250 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [37.77, -122.42], size: 0.06 },
    { location: [40.71, -74.0], size: 0.08 },
    { location: [-23.55, -46.63], size: 0.07 },
    { location: [51.5, -0.12], size: 0.05 },
    { location: [52.52, 13.4], size: 0.05 },
    { location: [30.04, 31.24], size: 0.05 },
    { location: [19.07, 72.88], size: 0.07 },
    { location: [1.35, 103.82], size: 0.06 },
    { location: [35.68, 139.69], size: 0.06 },
    { location: [-33.87, 151.21], size: 0.06 },
  ],
};

/** Dotted-map markers: { lat, lng } (see dotted-map.tsx for the shape). */
const MAP_MARKERS = [
  { lat: -6.2, lng: 106.816, size: 0.6 },
  { lat: 1.35, lng: 103.82, size: 0.6 },
  { lat: 35.68, lng: 139.69, size: 0.7 },
  { lat: -33.87, lng: 151.21, size: 0.6 },
  { lat: 52.52, lng: 13.4, size: 0.6 },
  { lat: 37.77, lng: -122.42, size: 0.7 },
  { lat: -23.55, lng: -46.63, size: 0.7 },
];

/**
 * IconCloud serializes each icon with renderToString into a standalone SVG
 * data URI — page CSS/Tailwind classes never apply there, so icons must be
 * sized/colored via lucide's `size`/`color` props (100px fills the 40px
 * sprite slot at the component's internal 0.4 canvas scale).
 */
const ICON_CLOUD_ICONS: ReactNode[] = [
  <Atom key="atom" size={100} color="#a78bfa" aria-hidden="true" />,
  <Braces key="braces" size={100} color="#e879f9" aria-hidden="true" />,
  <Code2 key="code2" size={100} color="#67e8f9" aria-hidden="true" />,
  <Cpu key="cpu" size={100} color="#fbbf24" aria-hidden="true" />,
  <Database key="database" size={100} color="#34d399" aria-hidden="true" />,
  <GitBranch key="git" size={100} color="#a78bfa" aria-hidden="true" />,
  <Layers key="layers" size={100} color="#e879f9" aria-hidden="true" />,
  <Palette key="palette" size={100} color="#67e8f9" aria-hidden="true" />,
  <Rocket key="rocket" size={100} color="#fbbf24" aria-hidden="true" />,
  <Server key="server" size={100} color="#34d399" aria-hidden="true" />,
  <Sparkles key="sparkles" size={100} color="#a78bfa" aria-hidden="true" />,
  <TerminalIcon key="terminal" size={100} color="#e879f9" aria-hidden="true" />,
  <Wand2 key="wand" size={100} color="#67e8f9" aria-hidden="true" />,
  <Zap key="zap" size={100} color="#fbbf24" aria-hidden="true" />,
];

/** RainbowButton's gradient reads --color-1..5, which are not defined in
 *  globals.css — provide the PRISM spectrum inline (scoped to the button). */
const RAINBOW_STYLE = {
  "--color-1": "#34d399",
  "--color-2": "#67e8f9",
  "--color-3": "#a78bfa",
  "--color-4": "#e879f9",
  "--color-5": "#fbbf24",
} as CSSProperties;

const CARD_CLASS =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_50px_-12px_rgba(139,92,246,0.25)]";

const NODE_CLASS =
  "flex size-24 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-border/70 bg-background/80 text-center sm:size-28";

const BEAM_CLASS_PROPS = {
  duration: 3.5,
  gradientStartColor: "#a78bfa",
  gradientStopColor: "#67e8f9",
  pathColor: "#a78bfa",
  pathWidth: 2.5,
} as const;

/* ──────────────────────────────────────────────────────────────────────── */
/*  Card scaffold                                                          */
/* ──────────────────────────────────────────────────────────────────────── */

interface BentoCardProps {
  index: number;
  className?: string;
  title: string;
  description: string;
  captions: string[];
  children: ReactNode;
}

function BentoCard({
  index,
  className,
  title,
  description,
  captions,
  children,
}: BentoCardProps) {
  return (
    <BlurFade delay={index * 0.07} inView className={className}>
      <article className={CARD_CLASS}>
        {children}
        <div className="mt-5 shrink-0">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {captions.map((caption) => (
              <span
                key={caption}
                className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
              >
                {caption}
              </span>
            ))}
          </div>
        </div>
      </article>
    </BlurFade>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  Section                                                                */
/* ──────────────────────────────────────────────────────────────────────── */

export function BentoSection() {
  const beamContainerRef = useRef<HTMLDivElement | null>(null);
  const nodeARef = useRef<HTMLDivElement | null>(null);
  const nodeBRef = useRef<HTMLDivElement | null>(null);
  const nodeCRef = useRef<HTMLDivElement | null>(null);

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="The Highlights"
          title={
            <>
              A constellation of{" "}
              <AuroraText colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}>
                showpieces
              </AuroraText>
              .
            </>
          }
          description="The heaviest hitters from the collection — data that beams, globes that spin, letters with gravity. Every card below is a live component, not a video."
        />

        <div className="mt-16 grid auto-rows-fr gap-4 md:grid-cols-6">
          {/* ── Card 1 — AnimatedBeam pipeline ─────────────────────────── */}
          <BentoCard
            index={0}
            className="md:col-span-4"
            title="Data that moves"
            description="Animated beams wire your components together — signals literally traveling between nodes."
            captions={["animated-beam"]}
          >
            <div
              ref={beamContainerRef}
              aria-hidden="true"
              className="relative min-h-52 grow sm:min-h-56"
            >
              <div className="flex h-full items-center justify-between px-6 sm:px-14">
                <div ref={nodeARef} className={NODE_CLASS}>
                  <Database
                    className="size-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    sources
                  </span>
                </div>
                <div
                  ref={nodeBRef}
                  className="flex size-24 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 text-center shadow-[0_0_36px_-10px_rgba(139,92,246,0.55)] sm:size-28"
                >
                  <Sparkles className="size-6 text-primary" aria-hidden="true" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-foreground">
                    prism engine
                  </span>
                </div>
                <div ref={nodeCRef} className={NODE_CLASS}>
                  <LineChart
                    className="size-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    insights
                  </span>
                </div>
              </div>
              {/* AnimatedBeam renders its own absolute <svg> overlay — it must
                  live inside the same relative container it measures. */}
              <AnimatedBeam
                containerRef={beamContainerRef}
                fromRef={nodeARef}
                toRef={nodeBRef}
                curvature={20}
                delay={0}
                pathOpacity={0.5}
                {...BEAM_CLASS_PROPS}
              />
              <AnimatedBeam
                containerRef={beamContainerRef}
                fromRef={nodeBRef}
                toRef={nodeCRef}
                curvature={20}
                delay={0.4}
                pathOpacity={0.5}
                {...BEAM_CLASS_PROPS}
              />
              <AnimatedBeam
                containerRef={beamContainerRef}
                fromRef={nodeARef}
                toRef={nodeBRef}
                curvature={-20}
                delay={0.8}
                reverse
                pathOpacity={0.2}
                gradientStartColor="#67e8f9"
                gradientStopColor="#a78bfa"
                pathColor="#8b5cf6"
                duration={3.5}
              />
              <AnimatedBeam
                containerRef={beamContainerRef}
                fromRef={nodeBRef}
                toRef={nodeCRef}
                curvature={-20}
                delay={1.2}
                reverse
                pathOpacity={0.2}
                gradientStartColor="#67e8f9"
                gradientStopColor="#a78bfa"
                pathColor="#8b5cf6"
                duration={3.5}
              />
            </div>
          </BentoCard>

          {/* ── Card 2 — Globe ─────────────────────────────────────────── */}
          <BentoCard
            index={1}
            className="md:col-span-2"
            title="Deployed everywhere"
            description="One globe, ten markers, zero dependencies on a maps API."
            captions={["globe", "cobe"]}
          >
            <div className="relative flex min-h-56 grow items-center justify-center">
              <div
                role="img"
                aria-label="Interactive globe with ten city markers"
                className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-xl border border-border/60 bg-[#0b0a10]"
              >
                <Globe config={GLOBE_CONFIG} />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(167,139,250,0.18),transparent_65%)]"
                />
              </div>
            </div>
          </BentoCard>

          {/* ── Card 3 — OrbitingCircles ───────────────────────────────── */}
          <BentoCard
            index={2}
            className="md:col-span-2"
            title="Your stack, in orbit"
            description="Icons circling a center of gravity — physics included."
            captions={["orbiting-circles"]}
          >
            <div className="relative flex min-h-56 grow items-center justify-center">
              <div
                aria-hidden="true"
                className="relative grid size-56 place-items-center"
              >
                <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30">
                  <Wand2 className="size-5" aria-hidden="true" />
                </div>
                <OrbitingCircles
                  radius={72}
                  duration={20}
                  className="border border-border/60 bg-card"
                >
                  <Zap className="size-5 text-muted-foreground" />
                  <Atom className="size-5 text-muted-foreground" />
                  <Layers className="size-5 text-muted-foreground" />
                </OrbitingCircles>
                <OrbitingCircles
                  radius={96}
                  duration={28}
                  reverse
                  path={false}
                  className="border border-border/60 bg-card"
                >
                  <Palette className="size-5 text-muted-foreground" />
                  <Code2 className="size-5 text-muted-foreground" />
                  <Braces className="size-5 text-muted-foreground" />
                </OrbitingCircles>
              </div>
            </div>
          </BentoCard>

          {/* ── Card 4 — IconCloud ─────────────────────────────────────── */}
          <BentoCard
            index={3}
            className="md:col-span-2"
            title="Built on your stack"
            description="A 3D tag cloud of your technology choices, spinning on canvas."
            captions={["icon-cloud"]}
          >
            <div className="relative flex min-h-52 grow items-center justify-center overflow-hidden">
              {/* The canvas is a fixed 400px square with roughly 240px of
                  content — scale it to fit the card without clipping icons. */}
              <div className="scale-[0.85]">
                <IconCloud icons={ICON_CLOUD_ICONS} showControl={false} />
              </div>
            </div>
          </BentoCard>

          {/* ── Card 5 — Terminal ──────────────────────────────────────── */}
          <BentoCard
            index={4}
            className="md:col-span-2"
            title="Terminal velocity"
            description="Sequence-typed install logs — the demo literally installs itself."
            captions={["terminal"]}
          >
            <div className="relative flex min-h-52 grow">
              <Terminal className="h-full w-full border-border/70">
                <TypingAnimation className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  `$ bunx shadcn@latest add "https://magicui.design/r/border-beam.json"`
                </TypingAnimation>
                <AnimatedSpan className="text-xs">
                  <span className="text-emerald-500">
                    ✓ border-beam installed
                  </span>
                </AnimatedSpan>
                <AnimatedSpan className="text-xs">
                  <span className="text-emerald-500">
                    ✓ 78 components available
                  </span>
                </AnimatedSpan>
                <TypingAnimation className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  `$ ready. ship something impossible.`
                </TypingAnimation>
              </Terminal>
            </div>
          </BentoCard>

          {/* ── Card 6 — DottedMap ─────────────────────────────────────── */}
          <BentoCard
            index={5}
            className="md:col-span-2"
            title="Everywhere on Earth"
            description="A dotted world map with pulsing markers — geo-flexing included."
            captions={["dotted-map"]}
          >
            <div className="relative min-h-52 grow overflow-hidden rounded-xl border border-border/60 bg-[#0b0a10]">
              <DottedMap
                role="img"
                aria-label="Dotted world map with seven pulsing city markers"
                className="size-full"
                markers={MAP_MARKERS}
                markerColor="#a78bfa"
                dotColor="rgba(255,255,255,0.2)"
                dotRadius={0.5}
                pulse
              />
            </div>
          </BentoCard>

          {/* ── Card 7 — KineticText + LineShadowText + RetroGrid ──────── */}
          <BentoCard
            index={6}
            className="md:col-span-4"
            title="Type with gravity"
            description="Letters that lift when you touch them — kinetic weight, animated shadows, a retro horizon."
            captions={["kinetic-text", "line-shadow-text", "retro-grid"]}
          >
            <div className="relative flex min-h-64 grow flex-col items-center justify-center gap-5 overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
              >
                <RetroGrid />
              </div>
              <KineticText
                as="h3"
                text="HOVER EVERY LETTER"
                className="justify-center font-display text-3xl font-bold tracking-tight sm:text-5xl"
              />
              <LineShadowText
                shadowColor="#a78bfa"
                className="font-display text-4xl font-bold tracking-tight"
              >
                PRISM
              </LineShadowText>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                hover the headline
              </span>
            </div>
          </BentoCard>

          {/* ── Card 8 — NeonGradientCard + SparklesText ───────────────── */}
          <BentoCard
            index={7}
            className="md:col-span-2"
            title="Neon everything"
            description="Gradient borders that hum at 60fps."
            captions={["neon-gradient-card", "sparkles-text"]}
          >
            <div className="relative min-h-52 grow p-4 sm:p-5">
              <NeonGradientCard
                borderSize={2}
                borderRadius={24}
                neonColors={{ firstColor: "#a78bfa", secondColor: "#67e8f9" }}
              >
                <div className="flex h-full items-center justify-center">
                  <SparklesText
                    sparklesCount={12}
                    colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
                    className="font-display text-2xl font-bold"
                  >
                    neon dreams
                  </SparklesText>
                </div>
              </NeonGradientCard>
            </div>
          </BentoCard>

          {/* ── Card 9 — install command + CopyButton + RainbowButton ──── */}
          <BentoCard
            index={8}
            className="md:col-span-4"
            title="Install anything"
            description="One command per component. The copy button on every gallery card does exactly this."
            captions={["copy-button", "rainbow-button"]}
          >
            <div className="relative flex min-h-52 grow flex-col">
              <div className="relative flex min-h-44 grow flex-col overflow-hidden rounded-xl bg-[#0b0a10] p-4 font-mono text-xs leading-relaxed sm:p-5">
                <CopyButton
                  value={INSTALL_COMMAND}
                  label="Copy install command"
                  className="absolute top-2.5 right-2.5 text-white/50 hover:bg-white/10 hover:text-white"
                />
                <div className="whitespace-pre-wrap break-words pr-10">
                  <span className="text-white/50">$ </span>
                  <span className="text-violet-400">
                    bunx shadcn@latest add{" "}
                  </span>
                  <span className="text-cyan-300">
                    &quot;https://magicui.design/r/
                  </span>
                  <span className="text-amber-400">&lt;component&gt;</span>
                  <span className="text-cyan-300">.json&quot;</span>
                </div>
                <p className="mt-1.5 text-white/40">
                  # drops the source right into your codebase — MIT, forever.
                </p>
                <div className="mt-auto pt-4" aria-hidden="true">
                  <span className="text-white/50">$ </span>
                  <span className="inline-block h-3.5 w-[7px] translate-y-[2px] animate-blink-cursor bg-violet-400/80" />
                </div>
              </div>
              <div className="mt-4 flex shrink-0 items-center gap-3">
                <RainbowButton asChild style={RAINBOW_STYLE}>
                  <a
                    href="https://magicui.design"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Browse the registry
                  </a>
                </RainbowButton>
                <span className="font-mono text-[10px] text-muted-foreground/70">
                  260 items and counting
                </span>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
