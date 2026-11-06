import { Sparkle } from "lucide-react"

import { Marquee } from "@/components/magicui/marquee"
import { cn } from "@/lib/utils"

const ROW_ONE = [
  "Aurora Text",
  "Border Beam",
  "Shimmer Button",
  "Meteors",
  "Particles",
  "Globe",
  "Icon Cloud",
  "Morphing Text",
  "Hyper Text",
  "Dock",
  "Terminal",
  "Confetti",
  "Retro Grid",
  "Number Ticker",
  "Orbiting Circles",
  "Animated Beam",
  "Bento Grid",
  "Flickering Grid",
] as const

const ROW_TWO = [
  "Rainbow Button",
  "Tweet Card",
  "Dotted Map",
  "Kinetic Text",
  "Lens",
  "Warp Background",
  "Dither Field",
  "Light Rays",
  "Neon Gradient Card",
  "File Tree",
  "Scroll Progress",
  "Typing Animation",
  "Word Rotate",
  "Avatar Circles",
  "Glare Hover",
  "Pixel Image",
  "Backlight",
  "Smooth Cursor",
] as const

const EDGE_FADE =
  "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"

function MarqueeRow({
  names,
  reverse = false,
  duration,
  itemClassName,
  className,
}: {
  names: readonly string[]
  reverse?: boolean
  duration: string
  itemClassName: string
  className?: string
}) {
  return (
    <Marquee
      reverse={reverse}
      pauseOnHover
      className={cn("items-center", duration, EDGE_FADE, className)}
    >
      {names.map((name) => (
        <span key={name} className="flex shrink-0 items-center">
          <span
            className={cn(
              "font-display font-semibold transition-colors hover:text-foreground",
              itemClassName
            )}
          >
            {name}
          </span>
          <Sparkle
            className="mx-6 size-3 shrink-0 text-primary/40"
            aria-hidden="true"
          />
        </span>
      ))}
    </Marquee>
  )
}

export function LogoMarquee() {
  return (
    <section
      aria-label="Every component in the registry"
      className="relative overflow-hidden border-y border-border/60 py-14"
    >
      <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70">
        Every component in the registry
      </p>

      <MarqueeRow
        names={ROW_ONE}
        duration="[--duration:40s]"
        itemClassName="text-2xl text-foreground/25"
      />

      <MarqueeRow
        names={ROW_TWO}
        reverse
        duration="[--duration:55s]"
        itemClassName="text-lg text-foreground/15"
        className="mt-6"
      />
    </section>
  )
}
