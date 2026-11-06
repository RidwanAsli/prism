"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, SearchX } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/site/section-heading";
import { DemoCard } from "@/components/site/gallery/demo-card";
import {
  CATEGORY_META,
  type DemoCategory,
} from "@/components/site/gallery/types";
import { DEMOS } from "@/components/site/gallery/demos";

type Filter = "all" | DemoCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "text", label: "Text" },
  { value: "effects", label: "Effects" },
  { value: "buttons", label: "Buttons" },
  { value: "components", label: "Components" },
];

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMOS.filter((demo) => {
      const matchesCategory =
        filter === "all" || demo.category === filter;
      const matchesQuery =
        !q ||
        demo.name.toLowerCase().includes(q) ||
        demo.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [filter, query]);

  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="The Collection"
          title={
            <>
              Every component.{" "}
              <AuroraText colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}>
                Alive.
              </AuroraText>
            </>
          }
          description="The entire free Magic UI catalog — every effect, text animation, button and component — running live on this page. Search it, filter it, hover it, click it."
        />

        <BlurFade delay={0.25} inView>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div
              className="relative w-full max-w-xs"
              role="search"
              aria-label="Search components"
            >
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${DEMOS.length} components…`}
                className="h-10 rounded-full border-border/70 bg-card/60 pl-9 pr-4 text-sm backdrop-blur-sm"
                aria-label="Search components by name"
              />
            </div>

            <div
              className="flex flex-wrap items-center justify-center gap-1.5"
              role="tablist"
              aria-label="Filter components by category"
            >
              {FILTERS.map((f) => {
                const isActive = filter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setFilter(f.value)}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                      isActive
                        ? "text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="gallery-filter-pill"
                        className="absolute inset-0 rounded-full bg-foreground"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                      />
                    ) : null}
                    <span className="relative z-10">
                      {f.label}
                      {f.value !== "all" ? (
                        <span className="ml-1.5 opacity-60">
                          {DEMOS.filter((d) => d.category === f.value).length}
                        </span>
                      ) : (
                        <span className="ml-1.5 opacity-60">{DEMOS.length}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </BlurFade>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
          Showing {filtered.length} of {DEMOS.length} specimens
        </p>

        {filtered.length > 0 ? (
          <div
            key={`${filter}-${query}`}
            className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
          >
            {filtered.map((demo, index) => (
              <BlurFade
                key={demo.id}
                delay={Math.min(index * 0.035, 0.45)}
                inView
                className="mb-4 break-inside-avoid"
              >
                <DemoCard entry={demo} index={index} />
              </BlurFade>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/70 py-20 text-center">
            <SearchX className="size-8 text-muted-foreground/50" aria-hidden="true" />
            <p className="font-mono text-sm text-muted-foreground">
              No specimens match “{query}” — try another search.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
