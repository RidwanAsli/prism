"use client";

import type { CSSProperties } from "react";

import type { DemoEntry } from "./types";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { RippleButton } from "@/components/magicui/ripple-button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { ShineBorder } from "@/components/magicui/shine-border";
import { CoolMode } from "@/components/magicui/cool-mode";
import { ConfettiButton } from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";

export const BUTTONS_DEMOS: DemoEntry[] = [
  {
    id: "shimmer-button",
    name: "Shimmer Button",
    description: "A conic spark orbits the border of a dark, glassy pill.",
    category: "buttons",
    install: "shimmer-button",
    height: "sm",
    element: (
      <ShimmerButton
        background="#18171c"
        shimmerColor="#ffffff"
        className="text-sm font-medium"
      >
        Shimmer
      </ShimmerButton>
    ),
  },
  {
    id: "shiny-button",
    name: "Shiny Button",
    description: "A glint sweeps the border and the label, on loop.",
    category: "buttons",
    install: "shiny-button",
    height: "sm",
    element: <ShinyButton>Shiny</ShinyButton>,
  },
  {
    id: "rainbow-button",
    name: "Rainbow Button",
    description: "An animated rainbow border with a blurred glow beneath.",
    category: "buttons",
    install: "rainbow-button",
    height: "sm",
    element: (
      <RainbowButton
        size="lg"
        style={
          {
            "--color-1": "#a78bfa",
            "--color-2": "#67e8f9",
            "--color-3": "#f0abfc",
            "--color-4": "#fbbf24",
            "--color-5": "#34d399",
          } as CSSProperties
        }
      >
        Rainbow
      </RainbowButton>
    ),
  },
  {
    id: "pulsating-button",
    name: "Pulsating Button",
    description: "A heartbeat halo that makes the CTA impossible to miss.",
    category: "buttons",
    install: "pulsating-button",
    height: "sm",
    element: (
      <PulsatingButton
        pulseColor="rgba(139,92,246,0.35)"
        variant="pulse"
        className="text-sm font-medium"
      >
        Pulse
      </PulsatingButton>
    ),
  },
  {
    id: "ripple-button",
    name: "Ripple Button",
    description: "Material ripples bloom from the exact point you click.",
    category: "buttons",
    install: "ripple-button",
    hint: "click",
    height: "sm",
    element: (
      <RippleButton
        rippleColor="#a78bfa"
        duration="600ms"
        className="px-6 text-sm font-medium"
      >
        Ripple
      </RippleButton>
    ),
  },
  {
    id: "interactive-hover-button",
    name: "Interactive Hover Button",
    description: "The label slides away and returns with an arrow.",
    category: "buttons",
    install: "interactive-hover-button",
    hint: "hover",
    height: "sm",
    element: <InteractiveHoverButton>Hover Me</InteractiveHoverButton>,
  },
  {
    id: "shine-border",
    name: "Shine Border",
    description: "A multicolor gradient endlessly tracing the frame.",
    category: "buttons",
    install: "shine-border",
    height: "md",
    element: (
      <div className="relative grid h-24 w-48 place-items-center overflow-hidden rounded-lg border border-border/70 bg-card">
        <ShineBorder
          shineColor={["#a78bfa", "#67e8f9", "#f0abfc"]}
          duration={8}
          borderWidth={1}
        />
        <span className="relative z-10 font-mono text-sm text-foreground">
          shine border
        </span>
      </div>
    ),
  },
  {
    id: "cool-mode",
    name: "Cool Mode",
    description: "Clicks erupt into a burst of floating particles.",
    category: "buttons",
    install: "cool-mode",
    hint: "click",
    height: "md",
    element: (
      <CoolMode options={{ particle: "✦", size: 8 }}>
        <Button>Click me</Button>
      </CoolMode>
    ),
  },
  {
    id: "confetti",
    name: "Confetti",
    description: "A full canvas-confetti cannon wired to one button.",
    category: "buttons",
    install: "confetti",
    hint: "click",
    height: "md",
    element: (
      <ConfettiButton
        options={{
          particleCount: 90,
          spread: 100,
          startVelocity: 45,
          colors: ["#a78bfa", "#67e8f9", "#f0abfc"],
        }}
        className="h-10 rounded-full px-6"
      >
        Celebrate
      </ConfettiButton>
    ),
  },
];
