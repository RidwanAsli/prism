"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/site/copy-button";
import {
  CATEGORY_META,
  HEIGHTS,
  type DemoEntry,
} from "@/components/site/gallery/types";

interface DemoCardProps {
  entry: DemoEntry;
  index: number;
}

export function DemoCard({ entry, index }: DemoCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mount the live demo only once it scrolls into view — keeps 78 demos feather-light.
  // (useInView with `once` latches true forever, so no extra state is needed.)
  const active = useInView(ref, {
    once: true,
    margin: "0px 0px -40px 0px",
  });

  const category = CATEGORY_META[entry.category];
  const height = HEIGHTS[entry.height ?? "md"];
  const installCommand = `bunx shadcn@latest add "https://magicui.design/r/${entry.install}.json"`;

  return (
    <article
      ref={ref}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_50px_-12px_rgba(139,92,246,0.25)]"
    >
      <header className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground/50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="truncate font-mono text-xs font-medium text-foreground/90">
          {entry.name}
        </h3>
        <span
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 px-2 py-0.5"
          title={category.label}
        >
          <span className={cn("size-1.5 rounded-full", category.dot)} />
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            {category.label}
          </span>
        </span>
        <CopyButton value={installCommand} label={`Copy install command for ${entry.name}`} />
      </header>

      <div
        className={cn(
          "relative grid place-items-center overflow-hidden p-4",
          height,
          entry.darkStage
            ? "bg-[#0b0a10]"
            : "bg-muted/25 dark:bg-background/40",
          entry.stageClassName
        )}
      >
        {active ? (
          entry.element
        ) : (
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">
            <span className="size-1.5 animate-pulse rounded-full bg-primary/60" />
            loading
          </div>
        )}
        {entry.hint && active ? (
          <span className="pointer-events-none absolute bottom-2.5 right-3 rounded-full bg-foreground/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 backdrop-blur-sm">
            {entry.hint}
          </span>
        ) : null}
      </div>

      <footer className="px-4 py-3">
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {entry.description}
        </p>
      </footer>
    </article>
  );
}
