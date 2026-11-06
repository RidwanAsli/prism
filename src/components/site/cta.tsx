"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Sparkles } from "lucide-react";

import { AuroraText } from "@/components/magicui/aurora-text";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ConfettiButton } from "@/components/magicui/confetti";
import { CoolMode } from "@/components/magicui/cool-mode";
import { Meteors } from "@/components/magicui/meteors";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "success" | "already" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COOL_MODE_OPTIONS = { particle: "✦" } as const;

const CONFETTI_OPTIONS = {
  particleCount: 120,
  spread: 80,
  startVelocity: 45,
  colors: ["#a78bfa", "#67e8f9", "#f0abfc"],
};

const AVATARS = [
  "/images/avatar-1.png",
  "/images/avatar-2.png",
  "/images/avatar-3.png",
  "/images/avatar-4.png",
  "/images/avatar-5.png",
  "/images/avatar-6.png",
].map((imageUrl) => ({ imageUrl, profileUrl: "#testimonials" }));

interface WaitlistResponse {
  alreadyExists?: boolean;
  message?: string;
  error?: string;
}

export function Cta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const locked =
    status === "loading" || status === "success" || status === "already";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;

    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      toast.error("That email looks off — try again?");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = (await res.json().catch(() => null)) as WaitlistResponse | null;

      if (!res.ok) {
        setStatus("error");
        toast.error(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus(data?.alreadyExists ? "already" : "success");
      toast.success(data?.message ?? "Welcome aboard.");
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="cta" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0" aria-hidden="true">
        <RetroGrid
          opacity={0.4}
          className="[mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
        />
        <Meteors number={10} />
        <div className="glow-orb -left-48 -top-48 size-[480px] bg-violet-500/25" />
        <div className="glow-orb -bottom-48 -right-48 size-[480px] bg-fuchsia-500/25" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <BlurFade delay={0.05} inView>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Final boarding call
            </p>
          </BlurFade>

          <BlurFade delay={0.12} inView>
            <h2 className="mt-5 font-display text-5xl font-bold tracking-tight sm:text-6xl">
              Ready to ship{" "}
              <AuroraText colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}>
                impossible UI?
              </AuroraText>
            </h2>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="mt-5 text-lg text-muted-foreground">
              Join the waitlist for the Prism component pack — curated layouts
              built entirely from the collection above.
            </p>
          </BlurFade>

          <BlurFade delay={0.28} inView>
            <CoolMode options={COOL_MODE_OPTIONS}>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  aria-label="Email address"
                  required
                  disabled={locked}
                  className="h-12 flex-1 rounded-full border-border/80 bg-card/70 px-5 backdrop-blur-sm"
                />
                <ConfettiButton
                  type="submit"
                  disabled={locked}
                  aria-live="polite"
                  onClick={(event) => {
                    // Suppress the confetti burst (and the submit) when the
                    // attempt is doomed anyway — errors shouldn't sparkle.
                    if (!EMAIL_RE.test(email.trim())) {
                      event.preventDefault();
                      toast.error("That email looks off — try again?");
                    }
                  }}
                  options={CONFETTI_OPTIONS}
                  className="h-12 shrink-0 rounded-full px-8 font-medium"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Joining…
                    </>
                  ) : status === "success" ? (
                    <>
                      <Check className="size-4" aria-hidden="true" />
                      Welcome aboard
                    </>
                  ) : status === "already" ? (
                    <>
                      <Check className="size-4" aria-hidden="true" />
                      Already on board
                    </>
                  ) : status === "error" ? (
                    "Try again"
                  ) : (
                    <>
                      <Sparkles className="size-4" aria-hidden="true" />
                      Join the waitlist
                    </>
                  )}
                </ConfettiButton>
              </form>
            </CoolMode>
          </BlurFade>

          <BlurFade delay={0.36} inView>
            <div className="mt-10 flex flex-col items-center gap-3">
              <AvatarCircles
                numPeople={2318}
                className="justify-center"
                avatarUrls={AVATARS}
              />
              <p className="text-sm text-muted-foreground">
                2,318 builders already aboard
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.42} inView>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              no spam. occasional magic only.
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
