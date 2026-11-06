"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import type { Tweet } from "react-tweet/api";
import {
  AlertTriangle,
  ArrowUp,
  Atom,
  Check,
  Cpu,
  CreditCard,
  Crown,
  Flame,
  Gem,
  Heart,
  Home,
  Layers,
  Mail,
  Rainbow,
  Rocket,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { DemoEntry } from "./types";
import { MagicCard } from "@/components/magicui/magic-card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Globe } from "@/components/magicui/globe";
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedList } from "@/components/magicui/animated-list";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { IconCloud } from "@/components/magicui/icon-cloud";
import { File, Folder, Tree } from "@/components/magicui/file-tree";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { MagicTweet } from "@/components/magicui/tweet-card";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation as TerminalTyping,
} from "@/components/magicui/terminal";
import { Lens } from "@/components/magicui/lens";
import { Pointer } from "@/components/magicui/pointer";
import { SmoothCursor } from "@/components/magicui/smooth-cursor";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { Safari } from "@/components/magicui/safari";
import { Iphone } from "@/components/magicui/iphone";
import { Android } from "@/components/magicui/android";
import { CodeComparison } from "@/components/magicui/code-comparison";
import { GlareHover } from "@/components/magicui/glare-hover";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { HeroVideoDialog } from "@/components/magicui/hero-video-dialog";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

// react-tweet's enrichTweet slices text via display_text_range — it MUST be present.
function makeTweet(
  name: string,
  handle: string,
  avatar: string,
  text: string
): Tweet {
  return {
    id_str: "1790000000000000000",
    text,
    display_text_range: [0, text.length],
    entities: { hashtags: [], urls: [], symbols: [], user_mentions: [] },
    user: {
      name,
      screen_name: handle,
      profile_image_url_https: avatar,
      verified: false,
      is_blue_verified: true,
      url: `https://x.com/${handle}`,
    },
    url: `https://x.com/${handle}/status/1790000000000000000`,
  } as unknown as Tweet;
}

const FAKE_TWEET = makeTweet(
  "Rizky Pratama",
  "rizkybuilds",
  "/images/avatar-2.png",
  "Dropped Magic UI into our landing page and demo-to-signup rate literally doubled. Border Beam alone is worth it."
);

function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full max-w-[240px] items-center justify-between"
    >
      <div
        ref={fromRef}
        className="grid size-14 place-items-center rounded-lg border border-border/70 bg-card"
      >
        <Mail className="size-5 text-foreground/80" />
      </div>
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
        curvature={0}
        duration={3}
        gradientStartColor="#a78bfa"
        gradientStopColor="#67e8f9"
        pathColor="rgba(167,139,250,0.55)"
        pathWidth={2.5}
      />
      <div
        ref={toRef}
        className="grid size-14 place-items-center rounded-lg border border-primary/40 bg-primary/10"
      >
        <Sparkles className="size-5 text-primary" />
      </div>
    </div>
  );
}

function BlurFadeReplay() {
  const [nonce, setNonce] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div key={nonce}>
        <BlurFade delay={0.35} inView blur="10px" direction="up">
          <div className="flex items-center gap-2.5 rounded-full border border-border/70 bg-card px-5 py-2.5 shadow-sm">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              watch me appear
            </span>
          </div>
        </BlurFade>
      </div>
      <button
        type="button"
        onClick={() => setNonce((n) => n + 1)}
        className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
      >
        <RotateCcw className="size-3" />
        replay
      </button>
    </div>
  );
}

function ThemeTogglerDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  const [fallback, setFallback] = useState<"light" | "dark">("dark");
  const theme = (resolvedTheme ?? fallback) as "light" | "dark";

  return (
    <div className="flex flex-col items-center gap-3">
      <AnimatedThemeToggler
        theme={theme}
        onThemeChange={(next) => {
          setTheme?.(next);
          setFallback(next);
        }}
        variant="star"
        className="grid size-11 cursor-pointer place-items-center rounded-full border border-border/70 bg-card text-foreground transition-colors hover:bg-muted"
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        star wipe
      </span>
    </div>
  );
}

function SmoothCursorDemo() {
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={stageRef}
      className="grid h-32 w-56 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground"
    >
      your cursor, but smoother
      <SmoothCursor
        containerRef={stageRef}
        cursor={
          <div className="size-3 rounded-full bg-linear-to-br from-violet-400 to-fuchsia-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
        }
      />
    </div>
  );
}

const MARQUEE_TILES: { icon: LucideIcon; classes: string }[] = [
  { icon: Sparkles, classes: "from-violet-500 to-violet-600" },
  { icon: Zap, classes: "from-fuchsia-500 to-fuchsia-600" },
  { icon: Heart, classes: "from-cyan-400 to-cyan-500" },
  { icon: Star, classes: "from-emerald-400 to-emerald-500" },
  { icon: Wand2, classes: "from-amber-400 to-amber-500" },
  { icon: Rocket, classes: "from-violet-400 to-fuchsia-500" },
];

const NOTIFICATIONS: {
  icon: LucideIcon;
  iconClasses: string;
  title: string;
  body: string;
}[] = [
  {
    icon: Check,
    iconClasses: "bg-emerald-500/15 text-emerald-500",
    title: "Deployment succeeded",
    body: "prism.dev is live",
  },
  {
    icon: CreditCard,
    iconClasses: "bg-violet-500/15 text-violet-400",
    title: "Payment received",
    body: "$49.00 · pro plan",
  },
  {
    icon: Heart,
    iconClasses: "bg-fuchsia-500/15 text-fuchsia-400",
    title: "New follower",
    body: "@maker liked your page",
  },
  {
    icon: AlertTriangle,
    iconClasses: "bg-amber-500/15 text-amber-500",
    title: "Usage at 80%",
    body: "edge function quota",
  },
];

const AVATARS = [1, 2, 3, 4, 5, 6].map((n) => ({
  imageUrl: `/images/avatar-${n}.png`,
  profileUrl: "#",
}));

const CLOUD_COLORS = ["#a78bfa", "#e879f9", "#67e8f9", "#fbbf24", "#34d399"];
const CLOUD_ICONS = [
  Zap,
  Sparkles,
  Star,
  Heart,
  Wand2,
  Rocket,
  Flame,
  Crown,
  Gem,
  Atom,
  Rainbow,
  Cpu,
].map((Icon, i) => (
  <Icon
    key={i}
    width={96}
    height={96}
    color={CLOUD_COLORS[i % CLOUD_COLORS.length]}
    strokeWidth={1.5}
  />
));

const CODE_BEFORE = `.card {
  color: gray;
  border: 1px;
}`;

const CODE_AFTER = `.card {
  color: violet; /* [!code highlight] */
  border: 2px;
}`;

/* ── Entries ─────────────────────────────────────────────────────────────── */

export const COMPONENTS_DEMOS: DemoEntry[] = [
  {
    id: "magic-card",
    name: "Magic Card",
    description: "A spotlight gradient that follows your cursor across the card.",
    category: "components",
    install: "magic-card",
    hint: "hover",
    height: "sm",
    element: (
      <MagicCard
        className="w-48 rounded-xl border p-5 text-center"
        gradientColor="#8b5cf6"
        gradientOpacity={0.8}
      >
        <div className="flex flex-col items-center gap-2.5">
          <Sparkles className="size-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Hover me</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            spotlight
          </span>
        </div>
      </MagicCard>
    ),
  },
  {
    id: "border-beam",
    name: "Border Beam",
    description: "A comet of light endlessly tracing the card's edge.",
    category: "components",
    install: "border-beam",
    height: "sm",
    element: (
      <div className="relative grid h-28 w-48 place-items-center overflow-hidden rounded-xl border border-border/70 bg-card p-6">
        <span className="font-mono text-sm text-foreground">beam me up</span>
        <BorderBeam
          size={140}
          duration={5}
          colorFrom="#a78bfa"
          colorTo="#67e8f9"
        />
      </div>
    ),
  },
  {
    id: "animated-beam",
    name: "Animated Beam",
    description: "A gradient pulse traveling between any two elements.",
    category: "components",
    install: "animated-beam",
    height: "sm",
    element: <AnimatedBeamDemo />,
  },
  {
    id: "globe",
    name: "Globe",
    description: "A 3D WebGL earth with markers — grab it and spin.",
    category: "components",
    install: "globe",
    darkStage: true,
    hint: "drag",
    height: "lg",
    element: (
      <div className="relative aspect-square w-full max-w-[200px]">
        <Globe />
      </div>
    ),
  },
  {
    id: "marquee",
    name: "Marquee",
    description: "An infinite scroller that pauses politely on hover.",
    category: "components",
    install: "marquee",
    hint: "hover",
    height: "sm",
    element: (
      <Marquee pauseOnHover className="[--duration:20s]">
        {MARQUEE_TILES.map((tile, i) => (
          <div
            key={i}
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-lg bg-linear-to-br text-white shadow-md",
              tile.classes
            )}
          >
            <tile.icon className="size-6" />
          </div>
        ))}
      </Marquee>
    ),
  },
  {
    id: "animated-list",
    name: "Animated List",
    description: "Notifications stack in, age out, and cycle forever.",
    category: "components",
    install: "animated-list",
    height: "xl",
    element: (
      <AnimatedList delay={1200}>
        {NOTIFICATIONS.map((item, i) => (
          <div
            key={i}
            className="flex w-64 items-center gap-3 rounded-lg border border-border/70 bg-card p-3 shadow-sm"
          >
            <div
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-md",
                item.iconClasses
              )}
            >
              <item.icon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-medium text-foreground">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{item.body}</p>
            </div>
          </div>
        ))}
      </AnimatedList>
    ),
  },
  {
    id: "number-ticker",
    name: "Number Ticker",
    description: "Digits that spring to life when they enter the viewport.",
    category: "components",
    install: "number-ticker",
    height: "sm",
    element: (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-baseline font-display text-4xl font-bold tabular-nums text-foreground">
          <NumberTicker
            value={99.9}
            decimalPlaces={1}
            className="font-display text-4xl font-bold text-foreground"
          />
          <span className="text-2xl text-primary">%</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          uptime
        </span>
      </div>
    ),
  },
  {
    id: "orbiting-circles",
    name: "Orbiting Circles",
    description: "Icons on a slow keplerian orbit around a fixed core.",
    category: "components",
    install: "orbiting-circles",
    height: "md",
    element: (
      <div className="relative grid size-40 place-items-center">
        <OrbitingCircles radius={56} duration={16} iconSize={28}>
          <Wand2 className="size-5 text-primary" />
          <Zap className="size-5 text-amber-400" />
          <Star className="size-5 text-fuchsia-400" />
        </OrbitingCircles>
        <div className="grid size-10 place-items-center rounded-full border border-primary/30 bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </div>
      </div>
    ),
  },
  {
    id: "dock",
    name: "Dock",
    description: "A macOS dock that magnifies icons as the cursor sweeps by.",
    category: "components",
    install: "dock",
    hint: "hover",
    height: "sm",
    element: (
      <Dock direction="bottom" iconSize={32} iconMagnification={56} className="mt-0">
        <DockIcon>
          <Home className="size-full rounded-full bg-primary p-1.5 text-primary-foreground" />
        </DockIcon>
        <DockIcon>
          <Search className="size-full rounded-full bg-muted p-1.5 text-foreground/75" />
        </DockIcon>
        <DockIcon>
          <Layers className="size-full rounded-full bg-muted p-1.5 text-foreground/75" />
        </DockIcon>
        <DockIcon>
          <Star className="size-full rounded-full bg-muted p-1.5 text-foreground/75" />
        </DockIcon>
        <DockIcon>
          <Settings className="size-full rounded-full bg-muted p-1.5 text-foreground/75" />
        </DockIcon>
      </Dock>
    ),
  },
  {
    id: "avatar-circles",
    name: "Avatar Circles",
    description: "Overlapping faces with a count — social proof in one glance.",
    category: "components",
    install: "avatar-circles",
    height: "sm",
    element: (
      <div className="flex flex-col items-center gap-3">
        <AvatarCircles numPeople={3200} avatarUrls={AVATARS} />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          3,200 builders
        </span>
      </div>
    ),
  },
  {
    id: "icon-cloud",
    name: "Icon Cloud",
    description: "Your stack, arranged on an interactive 3D sphere.",
    category: "components",
    install: "icon-cloud",
    hint: "drag",
    height: "lg",
    element: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="scale-[0.55]">
          <IconCloud icons={CLOUD_ICONS} showControl={false} />
        </div>
      </div>
    ),
  },
  {
    id: "file-tree",
    name: "File Tree",
    description: "A collapsible directory with selection state and guides.",
    category: "components",
    install: "file-tree",
    hint: "click",
    height: "lg",
    element: (
      <Tree
        className="rounded-xl border border-border/70 bg-card/70 shadow-sm"
        initialSelectedId="hero.tsx"
        initialExpandedItems={["src", "components"]}
      >
        <Folder element="src" value="src">
          <Folder element="components" value="components">
            <File value="hero.tsx">
              <span className="pl-1">hero.tsx</span>
            </File>
            <File value="globe.tsx">
              <span className="pl-1">globe.tsx</span>
            </File>
          </Folder>
          <File value="utils.ts">
            <span className="pl-1">utils.ts</span>
          </File>
        </Folder>
        <File value="package.json">
          <span className="pl-1">package.json</span>
        </File>
      </Tree>
    ),
  },
  {
    id: "bento-grid",
    name: "Bento Grid",
    description: "The asymmetric grid that runs every modern feature section.",
    category: "components",
    install: "bento-grid",
    height: "lg",
    element: (
      <BentoGrid className="mx-auto max-w-[250px] grid-cols-2 auto-rows-[4rem] gap-2">
        <div className="col-span-2 flex items-end rounded-lg bg-linear-to-br from-violet-500 to-violet-600 p-3 text-white shadow-md">
          <Sparkles className="size-5" />
        </div>
        <div className="flex items-end rounded-lg bg-linear-to-br from-cyan-400 to-cyan-500 p-3 text-white shadow-md">
          <TrendingUp className="size-5" />
        </div>
        <div className="flex items-end rounded-lg bg-linear-to-br from-fuchsia-400 to-fuchsia-500 p-3 text-white shadow-md">
          <Heart className="size-5" />
        </div>
        <div className="col-span-2 flex items-end rounded-lg bg-linear-to-br from-emerald-400 to-emerald-500 p-3 text-white shadow-md">
          <Star className="size-5" />
        </div>
      </BentoGrid>
    ),
  },
  {
    id: "tweet-card",
    name: "Tweet Card",
    description: "A pixel-faithful embedded post — with zero API calls.",
    category: "components",
    install: "tweet-card",
    height: "xl",
    element: (
      <MagicTweet tweet={FAKE_TWEET} className="max-w-[280px] scale-[0.92]" />
    ),
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "A scripted shell that types, reports, and ships.",
    category: "components",
    install: "terminal",
    height: "lg",
    element: (
      <Terminal className="h-48 max-w-[260px]">
        <TerminalTyping className="text-foreground">
          $ prism deploy --prod
        </TerminalTyping>
        <AnimatedSpan className="text-emerald-500" delay={200}>
          ✓ build passed
        </AnimatedSpan>
        <AnimatedSpan className="text-emerald-500" delay={200}>
          ✓ live in 1.2s
        </AnimatedSpan>
        <AnimatedSpan className="text-violet-400" delay={200}>
          → deployed to prism.dev
        </AnimatedSpan>
      </Terminal>
    ),
  },
  {
    id: "lens",
    name: "Lens",
    description: "A circular magnifier that floats over any content.",
    category: "components",
    install: "lens",
    hint: "hover",
    height: "md",
    element: (
      <Lens zoomFactor={1.8} lensSize={110} lensColor="rgba(167,139,250,0.9)">
        <img
          src="/images/aurora-art.png"
          alt="Aurora artwork seen through a lens"
          width={176}
          height={176}
          className="rounded-xl"
        />
      </Lens>
    ),
  },
  {
    id: "pointer",
    name: "Pointer",
    description: "Replace the cursor with anything you can render.",
    category: "components",
    install: "pointer",
    hint: "move cursor",
    height: "md",
    element: (
      <div className="grid h-32 w-56 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        move your cursor in here
        <Pointer>
          <Sparkles className="size-4 text-primary" />
        </Pointer>
      </div>
    ),
  },
  {
    id: "smooth-cursor",
    name: "Smooth Cursor",
    description: "A physics-backed cursor that trails with spring and tilt.",
    category: "components",
    install: "smooth-cursor",
    hint: "move cursor",
    height: "md",
    element: <SmoothCursorDemo />,
  },
  {
    id: "blur-fade",
    name: "Blur Fade",
    description: "Content materializes from blur the moment it's in view.",
    category: "components",
    install: "blur-fade",
    hint: "scroll",
    height: "md",
    element: <BlurFadeReplay />,
  },
  {
    id: "animated-circular-progress-bar",
    name: "Animated Circular Progress Bar",
    description: "An SVG gauge that sweeps to its target value.",
    category: "components",
    install: "animated-circular-progress-bar",
    height: "md",
    element: (
      <div className="flex flex-col items-center gap-1">
        <AnimatedCircularProgressBar
          value={76}
          max={100}
          min={0}
          gaugePrimaryColor="#a78bfa"
          gaugeSecondaryColor="rgba(167,139,250,0.18)"
          className="size-36"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          render progress
        </span>
      </div>
    ),
  },
  {
    id: "animated-theme-toggler",
    name: "Animated Theme Toggler",
    description: "A view-transition wipe — circle, hexagon, star — between themes.",
    category: "components",
    install: "animated-theme-toggler",
    hint: "click",
    height: "sm",
    element: <ThemeTogglerDemo />,
  },
  {
    id: "safari",
    name: "Safari",
    description: "The browser chrome, drawn in pure SVG around your screenshot.",
    category: "components",
    install: "safari",
    height: "lg",
    element: (
      <div className="w-full max-w-[320px]">
        <Safari imageSrc="/images/dashboard.png" url="prism.dev" />
      </div>
    ),
  },
  {
    id: "iphone",
    name: "iPhone",
    description: "A device-accurate frame for app shots and video.",
    category: "components",
    install: "iphone",
    height: "xl",
    element: (
      <div className="w-32">
        <Iphone src="/images/app.png" />
      </div>
    ),
  },
  {
    id: "android",
    name: "Android",
    description: "The Android counterpart, same trick, different notch.",
    category: "components",
    install: "android",
    height: "xl",
    element: <Android src="/images/app.png" className="h-[256px] w-auto" />,
  },
  {
    id: "code-comparison",
    name: "Code Comparison",
    description: "Before and after, side by side, with shiki highlighting.",
    category: "components",
    install: "code-comparison",
    height: "xl",
    element: (
      <div className="absolute inset-0 flex items-center justify-center">
        <CodeComparison
          beforeCode={CODE_BEFORE}
          afterCode={CODE_AFTER}
          language="css"
          filename="hero.css"
          lightTheme="github-light"
          darkTheme="github-dark"
          highlightColor="rgba(167,139,250,0.25)"
        />
      </div>
    ),
  },
  {
    id: "glare-hover",
    name: "Glare Hover",
    description: "A diagonal light sweep that glides across on hover.",
    category: "components",
    install: "glare-hover",
    hint: "hover",
    height: "md",
    element: (
      <GlareHover
        width="100%"
        height="160px"
        background="#0b0a10"
        color="#a78bfa"
        opacity={0.6}
        duration={700}
      >
        <span className="font-display text-2xl font-bold tracking-tight text-white">
          glare
        </span>
      </GlareHover>
    ),
  },
  {
    id: "neon-gradient-card",
    name: "Neon Gradient Card",
    description: "A rotating neon border with a blurred glow halo.",
    category: "components",
    install: "neon-gradient-card",
    height: "md",
    element: (
      <NeonGradientCard
        className="flex h-36 w-52 items-center justify-center"
        borderRadius={16}
        neonColors={{ firstColor: "#a78bfa", secondColor: "#e879f9" }}
      >
        <span className="font-display text-2xl font-bold tracking-tight text-foreground">
          neon
        </span>
      </NeonGradientCard>
    ),
  },
  {
    id: "scroll-progress",
    name: "Scroll Progress",
    description: "A page-level progress bar pinned to the very top.",
    category: "components",
    install: "scroll-progress",
    height: "md",
    element: (
      <div className="flex max-w-[230px] flex-col items-center gap-3 text-center">
        <ArrowUp className="size-5 text-primary" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          You&rsquo;re using it right now —{" "}
          <span className="font-medium text-primary">
            the bar at the top of this page
          </span>
        </p>
        <motion.div
          className="h-1 rounded-full bg-linear-to-r from-violet-400 to-fuchsia-400"
          animate={{ width: ["0%", "100%"] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
          scroll progress
        </span>
      </div>
    ),
  },
  {
    id: "hero-video-dialog",
    name: "Hero Video Dialog",
    description: "A cinematic video modal that springs open from a thumbnail.",
    category: "components",
    install: "hero-video-dialog",
    hint: "click play",
    height: "md",
    element: (
      <div className="w-full max-w-[270px]">
        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="/images/dashboard.png"
          thumbnailAlt="PRISM dashboard tour video"
        />
      </div>
    ),
  },
];
