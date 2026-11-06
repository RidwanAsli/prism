import { BlurFade } from "@/components/magicui/blur-fade"
import { NumberTicker } from "@/components/magicui/number-ticker"

const STATS = [
  { value: 78, label: "Free components" },
  { value: 260, label: "Registry items" },
  { value: 19, label: "Choreographed keyframes" },
  { value: 100, label: "Lighthouse energy", suffix: "%" },
] as const

export function Stats() {
  return (
    <section aria-label="PRISM in numbers" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card/40 px-6 py-10 backdrop-blur-sm sm:px-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <BlurFade key={stat.label} delay={i * 0.08} inView direction="up">
                <div>
                  <div className="flex items-baseline font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    <NumberTicker
                      value={stat.value}
                      className="tracking-tight text-foreground"
                    />
                    {"suffix" in stat && (
                      <span className="ml-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
