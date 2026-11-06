import { Gem } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-fuchsia-500/25">
        <Gem className="size-4" strokeWidth={2.25} aria-hidden="true" />
        <span className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/30" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        PRISM
      </span>
    </span>
  );
}
