import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/magicui/blur-fade";

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "relative mx-auto max-w-3xl",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <BlurFade delay={0.05} inView>
        <div
          className={cn(
            "inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 backdrop-blur-sm",
            align === "center" ? "mx-auto" : ""
          )}
        >
          <span className="size-1.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {kicker}
          </span>
        </div>
      </BlurFade>
      <BlurFade delay={0.12} inView>
        <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
          {title}
        </h2>
      </BlurFade>
      {description ? (
        <BlurFade delay={0.2} inView>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            {description}
          </p>
        </BlurFade>
      ) : null}
    </div>
  );
}
