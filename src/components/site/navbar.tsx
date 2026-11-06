"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Menu } from "lucide-react"

import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { Logo } from "@/components/site/logo"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Chamber", href: "#chamber" },
  { label: "Collection", href: "#gallery" },
  { label: "Love", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const

const emptySubscribe = () => () => {}

function scrollToCta() {
  document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // Guard against hydration mismatch: the server renders with the default
  // theme, but the client may have a stored one. useSyncExternalStore keeps
  // the server/hydration snapshot at `false` and flips to `true` right after
  // hydration — no setState-in-effect, no cascading render.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const theme = (mounted ? resolvedTheme ?? "dark" : "dark") as "light" | "dark"

  return (
    <AnimatedThemeToggler
      aria-label="Toggle theme"
      variant="circle"
      theme={theme}
      onThemeChange={setTheme}
      className="grid size-9 place-items-center rounded-full border border-border/70 bg-card/60 text-foreground transition-colors hover:border-primary/40 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4"
    />
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto mt-4 flex h-14 w-[calc(100%-2rem)] max-w-5xl items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/70 px-4 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
          "shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)]",
          scrolled &&
            "border-border bg-background/90 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.55)]"
        )}
      >
        <a
          href="#top"
          className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="PRISM — back to top"
        >
          <Logo />
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative rounded-md py-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 scale-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-transform duration-300 group-hover:scale-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <ShimmerButton
            background="rgba(139, 92, 246, 1)"
            onClick={scrollToCta}
            className="hidden h-9 px-4 text-sm font-medium sm:flex"
          >
            Get Started
          </ShimmerButton>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="grid size-9 place-items-center rounded-full border border-border/70 bg-card/60 text-foreground transition-colors hover:border-primary/40 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
              >
                <Menu className="size-4" aria-hidden="true" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 gap-0 border-border/70 p-0"
            >
              <SheetHeader className="border-b border-border/70 p-5">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <Logo />
              </SheetHeader>

              <nav
                className="flex flex-col gap-1 p-4"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4 border-t border-border/70 p-5">
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 px-4 py-2">
                  <span className="text-sm text-muted-foreground">
                    Appearance
                  </span>
                  <ThemeToggle />
                </div>
                <ShimmerButton
                  background="rgba(139, 92, 246, 1)"
                  onClick={() => {
                    setOpen(false)
                    scrollToCta()
                  }}
                  className="h-11 w-full px-5 text-sm font-medium"
                >
                  Get Started
                </ShimmerButton>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
