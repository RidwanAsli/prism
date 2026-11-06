"use client";

import { Sparkles } from "lucide-react";

import type { DemoEntry } from "./types";
import { AuroraText } from "@/components/magicui/aurora-text";
import { MorphingText } from "@/components/magicui/morphing-text";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { TextReveal } from "@/components/magicui/text-reveal";
import { DiaTextReveal } from "@/components/magicui/dia-text-reveal";
import { HyperText } from "@/components/magicui/hyper-text";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { WordRotate } from "@/components/magicui/word-rotate";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { SpinningText } from "@/components/magicui/spinning-text";
import { ComicText } from "@/components/magicui/comic-text";
import { TextAnimate } from "@/components/magicui/text-animate";
import { KineticText } from "@/components/magicui/kinetic-text";
import Text3DFlip from "@/components/magicui/text-3d-flip";
import { Highlighter } from "@/components/magicui/highlighter";
import { GlyphMatrix } from "@/components/magicui/glyph-matrix";
import { VideoText } from "@/components/magicui/video-text";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity";

export const TEXT_DEMOS: DemoEntry[] = [
  {
    id: "aurora-text",
    name: "Aurora Text",
    description: "A drifting northern-lights gradient, clipped inside the glyphs.",
    category: "text",
    install: "aurora-text",
    height: "md",
    element: (
      <AuroraText
        className="font-display text-5xl font-bold tracking-tight"
        colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}
      >
        aurora
      </AuroraText>
    ),
  },
  {
    id: "morphing-text",
    name: "Morphing Text",
    description: "Words melt into one another through a blur-threshold filter.",
    category: "text",
    install: "morphing-text",
    height: "md",
    element: (
      <MorphingText
        className="text-[2.25rem] md:h-16 lg:text-[2.75rem]"
        texts={["design", "motion", "magic"]}
      />
    ),
  },
  {
    id: "line-shadow-text",
    name: "Line Shadow Text",
    description: "A hatched shadow crawls diagonally behind crisp letterforms.",
    category: "text",
    install: "line-shadow-text",
    height: "md",
    element: (
      <LineShadowText
        className="font-display text-6xl font-bold tracking-tight"
        shadowColor="#a78bfa"
      >
        PRISM
      </LineShadowText>
    ),
  },
  {
    id: "word-rotate",
    name: "Word Rotate",
    description: "Cycling vocabulary with a soft vertical crossfade.",
    category: "text",
    install: "word-rotate",
    height: "sm",
    element: (
      <WordRotate
        className="font-display text-3xl font-semibold text-foreground"
        words={["create", "animate", "ship"]}
      />
    ),
  },
  {
    id: "hyper-text",
    name: "Hyper Text",
    description: "Characters decode from random noise, then re-scramble on hover.",
    category: "text",
    install: "hyper-text",
    hint: "hover",
    height: "sm",
    element: (
      <HyperText
        className="font-mono text-3xl font-bold tracking-tight text-foreground"
        startOnView
        duration={900}
      >
        SCRAMBLE
      </HyperText>
    ),
  },
  {
    id: "animated-gradient-text",
    name: "Animated Gradient Text",
    description: "A slow hue drift across every character — badge ready.",
    category: "text",
    install: "animated-gradient-text",
    height: "sm",
    element: (
      <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-sm font-medium shadow-sm">
        <AnimatedGradientText colorFrom="#67e8f9" colorTo="#f0abfc" speed={3}>
          gradient text
        </AnimatedGradientText>
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
      </div>
    ),
  },
  {
    id: "sparkles-text",
    name: "Sparkles Text",
    description: "Four-pointed stars burst and fade around the word.",
    category: "text",
    install: "sparkles-text",
    height: "md",
    element: (
      <SparklesText
        className="font-display text-3xl font-bold text-foreground"
        colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
        sparklesCount={10}
      >
        sparkle
      </SparklesText>
    ),
  },
  {
    id: "text-reveal",
    name: "Text Reveal",
    description: "Words surface one by one, tied directly to page scroll.",
    category: "text",
    install: "text-reveal",
    hint: "scroll",
    height: "xl",
    element: (
      <div className="absolute inset-0">
        <TextReveal className="h-[640px] w-full">
          Words surface as you scroll
        </TextReveal>
      </div>
    ),
  },
  {
    id: "dia-text-reveal",
    name: "Dia Text Reveal",
    description: "A gradient band sweeps across and paints the letters.",
    category: "text",
    install: "dia-text-reveal",
    height: "sm",
    element: (
      <DiaTextReveal
        className="font-display text-4xl font-bold tracking-tight"
        colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}
        duration={1.5}
        text="reveal me"
      />
    ),
  },
  {
    id: "animated-shiny-text",
    name: "Animated Shiny Text",
    description: "A light sweep glides across muted type, endlessly patient.",
    category: "text",
    install: "animated-shiny-text",
    height: "sm",
    element: (
      <div className="flex items-center rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-sm">
        <AnimatedShinyText shimmerWidth={120} className="font-medium">
          ✦ shiny
        </AnimatedShinyText>
      </div>
    ),
  },
  {
    id: "typing-animation",
    name: "Typing Animation",
    description: "Types, pauses, deletes, retypes — with a blinking caret.",
    category: "text",
    install: "typing-animation",
    height: "sm",
    element: (
      <TypingAnimation
        className="font-mono text-2xl text-foreground"
        words={["ship it.", "make it shine."]}
        loop
      />
    ),
  },
  {
    id: "spinning-text",
    name: "Spinning Text",
    description: "Circular type on an orbit — badges, stickers, warnings.",
    category: "text",
    install: "spinning-text",
    height: "md",
    element: (
      <div className="relative grid size-40 place-items-center">
        <SpinningText
          className="absolute inset-0 font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground"
          radius={7}
          duration={12}
        >
          SCROLL FOR MORE •{" "}
        </SpinningText>
        <Sparkles className="size-5 text-primary" aria-hidden="true" />
      </div>
    ),
  },
  {
    id: "comic-text",
    name: "Comic Text",
    description: "Halftone dots, hard outlines and a punchy spring entrance.",
    category: "text",
    install: "comic-text",
    height: "md",
    element: <ComicText fontSize={4}>POW!</ComicText>,
  },
  {
    id: "text-animate",
    name: "Text Animate",
    description: "Ten stagger presets — blur, slide, scale — per word or char.",
    category: "text",
    install: "text-animate",
    hint: "scroll",
    height: "sm",
    element: (
      <TextAnimate
        animation="blurInUp"
        by="word"
        className="text-center font-display text-2xl font-semibold text-foreground"
      >
        animate everything
      </TextAnimate>
    ),
  },
  {
    id: "kinetic-text",
    name: "Kinetic Text",
    description: "Each letter thickens under the cursor, its neighbors follow.",
    category: "text",
    install: "kinetic-text",
    hint: "hover",
    height: "sm",
    element: (
      <KineticText
        text="HOVER ME"
        className="font-display text-3xl font-bold text-foreground"
      />
    ),
  },
  {
    id: "text-3d-flip",
    name: "Text 3D Flip",
    description: "Hover cascades every character through a 3D flip.",
    category: "text",
    install: "text-3d-flip",
    hint: "hover",
    height: "sm",
    element: (
      <Text3DFlip
        className="font-display text-4xl font-bold tracking-tight text-foreground"
        textClassName="text-foreground"
        flipTextClassName="text-primary"
      >
        FLIP
      </Text3DFlip>
    ),
  },
  {
    id: "highlighter",
    name: "Highlighter",
    description: "A hand-drawn marker stroke swept in by rough notation.",
    category: "text",
    install: "highlighter",
    height: "sm",
    element: (
      <p className="text-2xl font-medium text-foreground">
        please{" "}
        <Highlighter color="#f0abfc" animationDuration={700}>
          highlight me
        </Highlighter>
      </p>
    ),
  },
  {
    id: "glyph-matrix",
    name: "Glyph Matrix",
    description: "A canvas of subtly mutating glyphs — terminal static, weaponized.",
    category: "text",
    install: "glyph-matrix",
    darkStage: true,
    height: "md",
    element: (
      <div className="absolute inset-0">
        <GlyphMatrix color="#a78bfa" cellSize={13} />
      </div>
    ),
  },
  {
    id: "scroll-based-velocity",
    name: "Scroll Based Velocity",
    description: "Marquee rows that speed up, slow down and reverse with scroll.",
    category: "text",
    install: "scroll-based-velocity",
    hint: "scroll the page",
    height: "md",
    element: (
      <div className="absolute inset-0">
        <ScrollVelocityContainer className="flex h-full flex-col justify-center gap-3">
          <ScrollVelocityRow baseVelocity={4}>
            <span className="font-display text-3xl font-bold tracking-tight text-foreground">
              VELOCITY —{" "}
            </span>
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={3} direction={-1}>
            <span className="font-display text-3xl font-bold tracking-tight text-muted-foreground/50">
              VELOCITY —{" "}
            </span>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    ),
  },
  {
    id: "video-text",
    name: "Video Text",
    description: "Typography that masks a looping video — letters made of ocean.",
    category: "text",
    install: "video-text",
    darkStage: true,
    height: "lg",
    stageClassName: "p-0",
    element: (
      <div className="absolute inset-0">
        <VideoText src="/videos/ocean-small.webm" fontSize="64px">
          OCEAN
        </VideoText>
      </div>
    ),
  },
];
