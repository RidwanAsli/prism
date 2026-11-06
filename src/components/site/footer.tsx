"use client";

import { ArrowUp, Dribbble, Github, Twitter } from "lucide-react";

import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { Marquee } from "@/components/magicui/marquee";
import { Logo } from "@/components/site/logo";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/magicuidesign/magicui", icon: Github },
  { label: "Twitter", href: "https://x.com/magicui", icon: Twitter },
  { label: "Dribbble", href: "https://magicui.design", icon: Dribbble },
];

const EXPLORE_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Collection", href: "#gallery" },
  { label: "Love", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const MAGICUI_LINKS = [
  { label: "Website", href: "https://magicui.design" },
  { label: "Documentation", href: "https://magicui.design/docs" },
  { label: "GitHub", href: "https://github.com/magicuidesign/magicui" },
  { label: "License", href: "https://magicui.design/license" },
];

const STACK_LINKS = [
  { label: "Next.js", href: "https://nextjs.org" },
  { label: "Tailwind CSS", href: "https://tailwindcss.com" },
  { label: "Motion", href: "https://motion.dev" },
  { label: "shadcn/ui", href: "https://ui.shadcn.com" },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
      {children}
    </h3>
  );
}

function InternalLinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={heading}>
      <ColumnHeading>{heading}</ColumnHeading>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function ExternalLinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={heading}>
      <ColumnHeading>{heading}</ColumnHeading>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/60 bg-card/20">
      <div className="absolute inset-0" aria-hidden="true">
        <InteractiveGridPattern
          width={40}
          height={40}
          squares={[48, 30]}
          className="border-none opacity-[0.4] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
          squaresClassName="stroke-violet-300/30"
        />
        <div className="glow-orb left-1/2 top-[-140px] h-72 w-[560px] -translate-x-1/2 bg-violet-500/15" />
      </div>

      <div className="relative">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                A living museum of every free Magic UI component. Built to
                flex, free to fork.
              </p>
              <div className="mt-6 flex items-center gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid size-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <social.icon className="size-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <InternalLinkColumn heading="Explore" links={EXPLORE_LINKS} />
            <ExternalLinkColumn heading="Magic UI" links={MAGICUI_LINKS} />
            <ExternalLinkColumn heading="Stack" links={STACK_LINKS} />
          </div>
        </div>
      </div>

      <div
        className="relative overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        aria-hidden="true"
      >
        <Marquee className="[--duration:40s]">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-[15vw] leading-[0.85] font-bold tracking-tighter text-transparent select-none"
              style={{
                WebkitTextStroke:
                  "1px color-mix(in oklch, var(--foreground) 22%, transparent)",
              }}
            >
              {"PRISM ✦ "}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            © 2026 Prism Labs — crafted with every free Magic UI component.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
              magicui · tailwind · motion
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="grid size-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
