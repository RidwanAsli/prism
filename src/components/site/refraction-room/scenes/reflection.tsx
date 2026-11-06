"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

import styles from "../refraction.module.css";

const HUES = [
  "#22d3ee",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#fb923c",
  "#fbbf24",
] as const;

/* Deterministic burst field — golden-angle spread, zero hydration drift.
   Velocities are tuned so the flight fills the scrub window instead
   of leaving the viewport in the first 30% of the tween. */
const PARTICLES = Array.from({ length: 112 }, (_, i) => ({
  angle: (i * 137.508) % 360,
  velocity: 180 + ((i * 53) % 260),
  size: 3 + (i % 4),
  shard: i % 7 === 0,
  color: i % 5 === 4 ? "#f4f1ea" : HUES[i % HUES.length],
  rotation: (i * 61) % 360,
}));

const RAY_ANGLES = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);

/**
 * FIG. 04 — TOTAL INTERNAL REFLECTION
 * The finale. Seven rays fire from the center, are pulled back in,
 * pressure accumulates in a single white point — and then the room
 * lets go: a fully scroll-scrubbed particle burst. Scroll back and
 * the explosion reverses into stillness. That is the point.
 */
export function Reflection() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const marqueeRowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(
        ScrollTrigger,
        ScrollToPlugin,
        ScrambleTextPlugin,
        SplitText,
        Physics2DPlugin,
      );

      const stage = stageRef.current;
      if (!stage) return;
      const q = gsap.utils.selector(stageRef);

      const staticFinal = () => {
        gsap.set(q(".rr-cv-ray"), { autoAlpha: 0 });
        gsap.set(dotRef.current, { autoAlpha: 1, scale: 1 });
        gsap.set(ringRef.current, { autoAlpha: 0 });
        gsap.set(burstRef.current, { autoAlpha: 0.2 });
        gsap.set(q(".rr-pt"), { autoAlpha: 1 });
        gsap.set(cardRef.current, { autoAlpha: 1 });
        gsap.set(kickerRef.current, { autoAlpha: 1 });
        gsap.set(q(".rr-card-line"), { autoAlpha: 1, y: 0 });
        gsap.set(q(".rr-card-fade"), { autoAlpha: 1, y: 0 });
        gsap.set(marqueeRowRef.current, { autoAlpha: 1 });
      };

      const build = (isMobile: boolean) => {
        /* Scatter particles to their final resting places so the
           static scrub position at progress 0 looks intentional. */
        gsap.set(q(".rr-cv-ray"), { scaleX: 0, transformOrigin: "left center" });

        const particles = q(".rr-pt");
        const rays = q(".rr-cv-ray");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${isMobile ? 1500 : 1900}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        /* — the rays fire outward — */
        tl.fromTo(
          rays,
          { scaleX: 0, autoAlpha: 0.95 },
          {
            scaleX: 1,
            duration: 8,
            stagger: 0.35,
            ease: "power3.out",
          },
          0,
        );

        /* — and are pulled back in — */
        tl.to(
          rays,
          {
            scaleX: 0.04,
            rotation: "+=9",
            duration: 11,
            stagger: 0.22,
            ease: "power2.in",
          },
          9,
        );
        tl.to(rays, { autoAlpha: 0, duration: 3, ease: "power1.in" }, 19);

        /* — pressure — */
        tl.fromTo(
          dotRef.current,
          { scale: 0, autoAlpha: 0 },
          {
            scale: 1.35,
            autoAlpha: 1,
            duration: 6,
            ease: "back.out(2.2)",
          },
          17,
        );
        tl.fromTo(
          ringRef.current,
          { scale: 0.2, autoAlpha: 0.85 },
          { scale: 3.4, autoAlpha: 0, duration: 6, ease: "expo.out" },
          23,
        );

        /* — release: the scrubbed burst — */
        particles.forEach((el, i) => {
          const p = PARTICLES[i];
          tl.to(el, { autoAlpha: 1, duration: 0.4 }, 27 + (i % 14) * 0.14);
          tl.to(
            el,
            {
              physics2D: {
                velocity: p.velocity,
                angle: p.angle,
                gravity: 220,
              },
              rotation: p.rotation,
              duration: 2.2 + (i % 5) * 0.28,
              ease: "none",
            },
            29 + (i % 14) * 0.14,
          );
        });

        /* — dim the debris and dissolve the point for the end card — */
        tl.to(burstRef.current, { autoAlpha: 0.2, duration: 7, ease: "power1.inOut" }, 60);
        tl.to(
          dotRef.current,
          { autoAlpha: 0, scale: 2.6, duration: 6, ease: "power2.in" },
          56,
        );

        /* — the end card — */
        const split = new SplitText(titleRef.current, { type: "chars" });
        tl.fromTo(
          kickerRef.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 3,
            scrambleText: {
              text: "FIG. 04 — TOTAL INTERNAL REFLECTION",
              chars: "01λμ·/—",
              speed: 0.45,
            },
          },
          64,
        );
        tl.from(
          split.chars,
          {
            yPercent: 72,
            autoAlpha: 0,
            duration: 5,
            stagger: 0.28,
            ease: "power3.out",
          },
          66,
        );
        tl.fromTo(
          q(".rr-card-fade"),
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 4,
            stagger: 1.1,
            ease: "power2.out",
          },
          72,
        );
        tl.to(cardRef.current, { y: -8, duration: 8, ease: "sine.inOut" }, 88);
        tl.to({}, { duration: 4 }, 96);

        return () => split.revert();
      };

      const mm = gsap.matchMedia();
      let splitRevert: (() => void) | undefined;

      mm.add(
        {
          isDesktop: "(min-width: 640px)",
          isMobile: "(max-width: 639px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            staticFinal();
            return;
          }
          splitRevert = build(!ctx.conditions?.isDesktop);
        },
      );

      /* — closing marquee, breathing with scroll velocity — */
      const row = marqueeRowRef.current;
      const strip = marqueeRef.current;
      let marqueeTween: gsap.core.Tween | null = null;
      let velocityTrigger: ScrollTrigger | null = null;
      if (row && strip) {
        marqueeTween = gsap.to(row, {
          xPercent: -50,
          repeat: -1,
          duration: 26,
          ease: "none",
        });
        velocityTrigger = ScrollTrigger.create({
          trigger: strip,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = Math.abs(self.getVelocity());
            marqueeTween?.timeScale(gsap.utils.clamp(0.6, 6, 0.6 + v / 1000));
          },
        });
      }

      /* — end-card navigation — */
      const scrollToTarget = (target: string) => {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 84 },
          duration: 1.7,
          ease: "power3.inOut",
        });
      };
      const buttons = q("[data-scroll-target]");
      const handlers = buttons.map((btn) => {
        const target = btn.getAttribute("data-scroll-target") ?? "#gallery";
        const handler = (event: Event) => {
          event.preventDefault();
          scrollToTarget(target);
        };
        btn.addEventListener("click", handler);
        return { btn, handler };
      });

      return () => {
        handlers.forEach(({ btn, handler }) =>
          btn.removeEventListener("click", handler),
        );
        velocityTrigger?.kill();
        marqueeTween?.kill();
        splitRevert?.();
        mm.revert();
      };
    },
    { scope: sceneRef },
  );

  return (
    <div ref={sceneRef} data-scene="04 · REFLECTION">
      <div
        ref={stageRef}
        role="img"
        aria-label="Figure 04, Total Internal Reflection: seven rays collapse into a single point of light and burst into a scroll-controlled spectrum of particles, closing with the words Light, Disciplined."
        className="relative h-[100svh] overflow-hidden"
      >
        <p className={`${styles.figCaption} ${styles.mono}`}>
          FIG. 04 — REFLECTION
        </p>
        <p className={`${styles.figCaptionRight} ${styles.mono}`}>FINAL PLATE</p>

        {/* converging rays */}
        {RAY_ANGLES.map((angle, i) => (
          <div
            key={`ray-${i}`}
            className="rr-cv-ray absolute left-1/2 top-1/2 h-px w-[46vmin]"
            style={{
              background: HUES[i % HUES.length],
              transform: `rotate(${angle}deg)`,
              opacity: 0,
            }}
            aria-hidden="true"
          />
        ))}

        {/* the point of pressure */}
        <div
          ref={dotRef}
          className="absolute left-1/2 top-1/2 -ml-1 -mt-1 size-2 rounded-full bg-white opacity-0 shadow-[0_0_24px_6px_rgba(255,255,255,0.65)]"
          aria-hidden="true"
        />
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 -ml-11 -mt-11 size-22 rounded-full border border-white/50 opacity-0"
          aria-hidden="true"
        />

        {/* the burst */}
        <div ref={burstRef} className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2">
            {PARTICLES.map((p, i) =>
              p.shard ? (
                <span
                  key={`pt-${i}`}
                  className="rr-pt absolute block h-[14px] w-px opacity-0"
                  style={{ background: p.color }}
                />
              ) : (
                <span
                  key={`pt-${i}`}
                  className="rr-pt absolute block rounded-full opacity-0"
                  style={{
                    width: p.size,
                    height: p.size,
                    background: p.color,
                  }}
                />
              ),
            )}
          </div>
        </div>

        {/* end card */}
        <div
          ref={cardRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <p
            ref={kickerRef}
            className={`${styles.mono} text-[10px] uppercase tracking-[0.4em] text-[rgba(244,241,234,0.55)] opacity-0 sm:text-xs`}
          >
            FIG. 04 — TOTAL INTERNAL REFLECTION
          </p>
          <h3
            ref={titleRef}
            className={`${styles.display} mt-6 text-[clamp(2.4rem,8vw,6.5rem)] font-extrabold leading-[0.98] tracking-tight`}
          >
            LIGHT,
            <span className="block text-[rgba(244,241,234,0.55)]">
              DISCIPLINED.
            </span>
          </h3>
          <p className="rr-card-fade mt-7 text-[13px] leading-relaxed text-[rgba(244,241,234,0.68)] opacity-0">
            78 components. One spectrum. Zero templates.
          </p>
          <div className="rr-card-fade mt-10 flex flex-col items-center gap-4 opacity-0 sm:flex-row">
            <a
              href="#gallery"
              data-scroll-target="#gallery"
              className={`${styles.mono} ${styles.rrFocus} border border-[rgba(244,241,234,0.35)] px-7 py-3.5 text-[11px] uppercase tracking-[0.3em] text-[#f4f1ea] transition-colors duration-300 hover:bg-[#f4f1ea] hover:text-[#050508]`}
            >
              Return to the collection
            </a>
            <a
              href="#cta"
              data-scroll-target="#cta"
              className={`${styles.mono} ${styles.rrFocus} border border-[#f4f1ea] bg-[#f4f1ea] px-7 py-3.5 text-[11px] uppercase tracking-[0.3em] text-[#050508] transition-colors duration-300 hover:bg-white`}
            >
              Join the waitlist
            </a>
          </div>
          <p className="rr-card-fade mt-12 text-[9px] uppercase tracking-[0.35em] text-[rgba(244,241,234,0.3)] opacity-0">
            PRISM — Refraction Study — MMXXVI
          </p>
        </div>

        <div className={styles.vignette} aria-hidden="true" />
      </div>

      {/* closing strip — velocity aware */}
      <div
        ref={marqueeRef}
        className={`relative overflow-hidden border-y border-[rgba(244,241,234,0.1)] py-4 ${styles.marqueeMask}`}
      >
        <div ref={marqueeRowRef} className={styles.marqueeRow}>
          {[0, 1].map((n) => (
            <span
              key={`mq-${n}`}
              className={`${styles.mono} ${styles.marqueeChunk} pr-2 text-[10px] uppercase tracking-[0.4em] text-[rgba(244,241,234,0.45)]`}
            >
              REFRACTION — DISPERSION — ABERRATION — SPECIMENS — REFLECTION —
              SCROLL BACK TO UN-EXPLODE —
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
