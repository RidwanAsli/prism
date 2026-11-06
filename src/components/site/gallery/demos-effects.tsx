"use client";

import type { DemoEntry } from "./types";
import { Meteors } from "@/components/magicui/meteors";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { HexagonPattern } from "@/components/magicui/hexagon-pattern";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Particles } from "@/components/magicui/particles";
import { Ripple } from "@/components/magicui/ripple";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { LightRays } from "@/components/magicui/light-rays";
import { DitherField } from "@/components/magicui/dither-field";
import { WarpBackground } from "@/components/magicui/warp-background";
import { ProgressiveBlur } from "@/components/magicui/progressive-blur";
import { NoiseTexture } from "@/components/magicui/noise-texture";
import { Backlight } from "@/components/magicui/backlight";
import { PixelImage } from "@/components/magicui/pixel-image";
import { Floating3DParticles } from "@/components/magicui/floating-3d-particles";
import { DottedMap } from "@/components/magicui/dotted-map";

export const EFFECTS_DEMOS: DemoEntry[] = [
  {
    id: "meteors",
    name: "Meteors",
    description: "Shooting stars streaking diagonally across a night sky.",
    category: "effects",
    install: "meteors",
    darkStage: true,
    height: "md",
    element: <Meteors number={18} />,
  },
  {
    id: "grid-pattern",
    name: "Grid Pattern",
    description: "Blueprint squares with any cell promoted to a highlight.",
    category: "effects",
    install: "grid-pattern",
    height: "md",
    element: (
      <GridPattern
        width={40}
        height={40}
        squares={[
          [1, 1],
          [4, 1],
          [2, 2],
          [5, 2],
          [3, 3],
        ]}
        className="fill-violet-400/50 stroke-gray-400/40 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_78%)]"
      />
    ),
  },
  {
    id: "hexagon-pattern",
    name: "Hexagon Pattern",
    description: "A honeycomb lattice with filled cells of your choosing.",
    category: "effects",
    install: "hexagon-pattern",
    height: "md",
    element: (
      <HexagonPattern
        radius={30}
        gap={4}
        hexagons={[
          [2, 0],
          [4, 1],
          [1, 2],
          [3, 2],
        ]}
        className="fill-violet-400/50 stroke-gray-400/40 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_78%)]"
      />
    ),
  },
  {
    id: "dot-pattern",
    name: "Dot Pattern",
    description: "A field of breathing dots with an optional glow mode.",
    category: "effects",
    install: "dot-pattern",
    height: "md",
    element: (
      <DotPattern
        glow
        cr={1.2}
        className="text-violet-400/80 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]"
      />
    ),
  },
  {
    id: "ripple",
    name: "Ripple",
    description: "Concentric rings pulsing outward from a single point.",
    category: "effects",
    install: "ripple",
    height: "md",
    element: <Ripple mainCircleSize={60} numCircles={5} />,
  },
  {
    id: "retro-grid",
    name: "Retro Grid",
    description: "An infinite synthwave floor scrolling toward the horizon.",
    category: "effects",
    install: "retro-grid",
    height: "md",
    element: (
      <RetroGrid className="[mask-image:linear-gradient(to_top,black_35%,transparent)]" />
    ),
  },
  {
    id: "animated-grid-pattern",
    name: "Animated Grid Pattern",
    description: "Random cells light up, fade out, and teleport elsewhere.",
    category: "effects",
    install: "animated-grid-pattern",
    height: "md",
    element: (
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={4}
        className="text-violet-400 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
      />
    ),
  },
  {
    id: "light-rays",
    name: "Light Rays",
    description: "Volumetric beams swinging down through a dark frame.",
    category: "effects",
    install: "light-rays",
    darkStage: true,
    height: "lg",
    element: (
      <LightRays count={8} color="#a78bfa" blur={40} speed={12} length="320px" />
    ),
  },
  {
    id: "particles",
    name: "Particles",
    description: "A drifting dust field that leans toward your cursor.",
    category: "effects",
    install: "particles",
    darkStage: true,
    hint: "move cursor",
    height: "lg",
    element: (
      <Particles
        className="absolute inset-0"
        quantity={60}
        color="#a78bfa"
        size={0.5}
        ease={40}
      />
    ),
  },
  {
    id: "flickering-grid",
    name: "Flickering Grid",
    description: "Hundreds of tiny squares flickering like a dying signal.",
    category: "effects",
    install: "flickering-grid",
    height: "md",
    element: (
      <FlickeringGrid
        className="absolute inset-0"
        color="#8b5cf6"
        maxOpacity={0.4}
        squareSize={4}
        gridGap={6}
      />
    ),
  },
  {
    id: "dither-field",
    name: "Dither Field",
    description: "Aurora curtains rendered as pure dithered dots — 1-bit light.",
    category: "effects",
    install: "dither-field",
    darkStage: true,
    hint: "move cursor",
    height: "lg",
    element: (
      <div className="absolute inset-0">
        <DitherField
          className="size-full"
          pattern="aurora"
          color="#a78bfa"
          interactive
        />
      </div>
    ),
  },
  {
    id: "warp-background",
    name: "Warp Background",
    description: "A perspective tunnel of light beams warping past the edges.",
    category: "effects",
    install: "warp-background",
    darkStage: true,
    height: "md",
    element: (
      <WarpBackground
        className="size-full rounded-xl border-border/50 p-8"
        gridColor="rgba(167,139,250,0.4)"
      >
        <div className="grid h-full place-items-center">
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.35em] text-white/70 backdrop-blur">
            warp
          </span>
        </div>
      </WarpBackground>
    ),
  },
  {
    id: "striped-pattern",
    name: "Striped Pattern",
    description: "Diagonal hazard stripes in any direction and color.",
    category: "effects",
    install: "striped-pattern",
    height: "md",
    element: (
      <StripedPattern
        direction="right"
        className="text-foreground/40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
    ),
  },
  {
    id: "interactive-grid-pattern",
    name: "Interactive Grid Pattern",
    description: "Every cell is a hover target that fills as you sweep across.",
    category: "effects",
    install: "interactive-grid-pattern",
    hint: "hover",
    height: "md",
    element: (
      <InteractiveGridPattern
        className="border-none"
        width={36}
        squares={[8, 5]}
        squaresClassName="stroke-violet-400/40 hover:fill-violet-400/30"
      />
    ),
  },
  {
    id: "progressive-blur",
    name: "Progressive Blur",
    description: "Content melts into frosted glass toward the list's edge.",
    category: "effects",
    install: "progressive-blur",
    hint: "scroll",
    height: "md",
    element: (
      <div className="relative h-44 w-56 overflow-hidden rounded-lg border border-border/70 bg-card">
        <div className="h-full space-y-2 overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border border-border/50 bg-muted/40 px-2.5 py-2 font-mono text-xs text-muted-foreground"
            >
              <span>item-{String(i + 1).padStart(2, "0")}</span>
              <span className="text-foreground/30">✦</span>
            </div>
          ))}
        </div>
        <ProgressiveBlur position="bottom" height="64px" />
      </div>
    ),
  },
  {
    id: "noise-texture",
    name: "Noise Texture",
    description: "Tunable film grain to break up flat digital surfaces.",
    category: "effects",
    install: "noise-texture",
    height: "md",
    element: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-violet-400/30 via-fuchsia-400/20 to-cyan-300/30" />
        <NoiseTexture className="opacity-70" />
        <div className="relative grid h-full place-items-center">
          <span className="font-display text-4xl font-bold tracking-tight text-foreground/85">
            grain
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "backlight",
    name: "Backlight",
    description: "An SVG glow that saturates and bleeds behind any element.",
    category: "effects",
    install: "backlight",
    darkStage: true,
    height: "md",
    element: (
      <Backlight blur={24}>
        <img
          src="/images/aurora-art.png"
          alt="Aurora artwork with a glowing backlight"
          width={180}
          height={180}
          className="rounded-xl"
        />
      </Backlight>
    ),
  },
  {
    id: "pixel-image",
    name: "Pixel Image",
    description: "An image that assembles itself from a grid of pixels.",
    category: "effects",
    install: "pixel-image",
    height: "xl",
    element: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="scale-[0.6]">
          <PixelImage src="/images/aurora-art.png" grid="6x4" />
        </div>
      </div>
    ),
  },
  {
    id: "floating-3d-particles",
    name: "Floating 3D Particles",
    description: "Buoyant orbs drifting through a rotating 3D volume.",
    category: "effects",
    install: "floating-3d-particles",
    darkStage: true,
    height: "lg",
    element: (
      <Floating3DParticles
        quantity={140}
        color="#8B5CF6"
        size={4}
        opacity={0.35}
        drift={0.7}
        depth={0.6}
      />
    ),
  },
  {
    id: "dotted-map",
    name: "Dotted Map",
    description: "The world in dots, with pulsing markers where it matters.",
    category: "effects",
    install: "dotted-map",
    darkStage: true,
    height: "lg",
    element: (
      <div className="relative aspect-[2/1] w-full max-w-[270px]">
        <DottedMap
          dotColor="#ffffff42"
          markerColor="#a78bfa"
          dotRadius={0.22}
          mapSamples={4000}
          pulse
          markers={[
            { lat: 35.68, lng: 139.69, size: 0.6 },
            { lat: 51.5, lng: -0.12, size: 0.6 },
            { lat: 40.71, lng: -74.0, size: 0.6 },
            { lat: -6.2, lng: 106.82, size: 0.6 },
            { lat: -23.55, lng: -46.63, size: 0.6 },
          ]}
        />
      </div>
    ),
  },
];
