"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "../refraction.module.css";

/* ------------------------------------------------------------------ */
/* Specimen data — eight letters, seven hues, one white                */
/* ------------------------------------------------------------------ */

const LETTERS = [
  { ch: "S", color: "#22d3ee", label: "CYAN" },
  { ch: "P", color: "#8b5cf6", label: "VIOLET" },
  { ch: "E", color: "#d946ef", label: "FUCHSIA" },
  { ch: "C", color: "#ec4899", label: "PINK" },
  { ch: "T", color: "#f43f5e", label: "ROSE" },
  { ch: "R", color: "#fb923c", label: "ORANGE" },
  { ch: "U", color: "#fbbf24", label: "AMBER" },
  { ch: "M", color: "#ffffff", label: "Σ WHITE" },
] as const;

/**
 * FIG. 02 — CHROMATIC ABERRATION
 * The word SPECTRUM set in a variable serif. Scroll scrubs each
 * letter’s weight from hairline to black in a sweeping wave, pulls
 * the tracking tight, and lets scroll velocity shear the whole word.
 * Every wavelength at once is white.
 */
export function Aberration() {
  const stageRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const stage = stageRef.current;
      if (!stage) return;
      const q = gsap.utils.selector(stageRef);

      const staticFinal = () => {
        gsap.set(q(".rr-word-wrap"), { autoAlpha: 1 });
        gsap.set(q(".rr-letter"), {
          autoAlpha: 1,
          yPercent: 0,
          "--w": 650,
        });
        gsap.set(q(".rr-letter-label"), { autoAlpha: 1 });
        gsap.set(captionRef.current, { autoAlpha: 1 });
        gsap.set(q(".rr-tape"), { autoAlpha: 1 });
      };

      const build = (isMobile: boolean) => {
        gsap.set(q(".rr-word-wrap"), { autoAlpha: 1 });

        const letters = q(".rr-letter");
        const labels = q(".rr-letter-label");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${isMobile ? 1400 : 1600}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        /* — the word surfaces — */
        tl.fromTo(
          letters,
          { yPercent: 62, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 7,
            stagger: 0.55,
            ease: "power3.out",
          },
          0,
        );

        /* — weight wave, hairline → black, sweeping left to right — */
        letters.forEach((el, i) => {
          tl.fromTo(
            el,
            { "--w": 100 },
            {
              "--w": 900,
              duration: 16,
              ease: "power2.inOut",
            },
            10 + i * 1.4,
          );
        });

        /* — tracking pulls tight as the letters gain mass — */
        tl.fromTo(
          wordRef.current,
          { letterSpacing: "0.1em" },
          { letterSpacing: "-0.015em", duration: 22, ease: "power1.inOut" },
          14,
        );

        /* — a slow float, out of phase per letter — */
        letters.forEach((el, i) => {
          tl.to(
            el,
            {
              yPercent: i % 2 === 0 ? -6 : -9,
              duration: 12,
              ease: "sine.inOut",
            },
            30 + i * 0.8,
          );
        });

        /* — the fuchsia letter shears, and holds — */
        tl.to(
          letters[2],
          { skewX: -10, duration: 9, ease: "power2.inOut" },
          38,
        );
        tl.to(letters[2], { skewX: -4, duration: 9, ease: "power2.inOut" }, 52);

        /* — hue labels surface beneath their letters — */
        tl.fromTo(
          labels,
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 4,
            stagger: 0.7,
            ease: "power2.out",
          },
          46,
        );

        /* — the measuring tapes run in opposite directions — */
        tl.fromTo(
          q(".rr-tape-top"),
          { xPercent: 0 },
          { xPercent: -9, duration: 78, ease: "none" },
          8,
        );
        tl.fromTo(
          q(".rr-tape-bottom"),
          { xPercent: 0 },
          { xPercent: 9, duration: 78, ease: "none" },
          8,
        );

        /* — caption + the white letter begins to glow — */
        tl.fromTo(
          captionRef.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 5, ease: "power2.out" },
          60,
        );
        tl.to(
          letters[7],
          {
            textShadow: "0 0 64px rgba(255,255,255,0.6)",
            duration: 10,
            ease: "sine.inOut",
          },
          64,
        );

        /* — the word settles, slightly larger than life — */
        tl.to(
          wordRef.current,
          { scale: 1.02, duration: 12, ease: "sine.inOut" },
          70,
        );
        tl.to({}, { duration: 4 }, 96);

        /* — background numeral drifts against the scroll — */
        gsap.fromTo(
          markRef.current,
          { xPercent: 8 },
          {
            xPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "+=1600",
              scrub: 1.2,
            },
          },
        );
      };

      const mm = gsap.matchMedia();
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
          build(!ctx.conditions?.isDesktop);
        },
      );

      /* — velocity shear: the word leans with the scroll — */
      const proxy = { skew: 0 };
      const clampSkew = gsap.utils.clamp(-5, 5);
      const skewTo = gsap.quickTo(wordRef.current, "skewX", {
        duration: 0.5,
        ease: "power3.out",
      });
      const velocityTrigger = ScrollTrigger.create({
        trigger: stage,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const skew = clampSkew(self.getVelocity() / -400);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.9,
              ease: "power3.out",
              overwrite: true,
              onUpdate: () => skewTo(proxy.skew),
            });
          }
        },
      });

      return () => {
        velocityTrigger.kill();
        mm.revert();
      };
    },
    { scope: stageRef },
  );

  return (
    <div
      ref={stageRef}
      data-scene="02 · ABERRATION"
      role="img"
      aria-label="Figure 02, Chromatic Aberration: the word SPECTRUM in seven hues with a white final letter, its type weight scrubbed from hairline to black by scroll."
      className="relative h-[100svh] overflow-hidden"
    >
      <p className={`${styles.figCaption} ${styles.mono}`}>
        FIG. 02 — CHROMATIC ABERRATION
      </p>
      <p className={`${styles.figCaptionRight} ${styles.mono}`}>
        SPECIMEN · VARIABLE WEIGHT
      </p>

      {/* background numeral */}
      <span
        ref={markRef}
        aria-hidden="true"
        className={`${styles.outline} ${styles.display} pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none text-[52vw] font-extrabold leading-none sm:text-[34vw]`}
      >
        02
      </span>

      <div className="rr-word-wrap absolute inset-0 flex items-center justify-center opacity-0">
        {/* measuring tape, above */}
        <div
          aria-hidden="true"
          className={`${styles.tape} rr-tape-top absolute left-[-20%] top-[16%] w-[140%] opacity-70`}
        />
        <div
          aria-hidden="true"
          className={`${styles.tape} rr-tape-bottom absolute bottom-[16%] left-[-20%] w-[140%] opacity-70`}
        />

        <div className="flex w-full flex-col items-center px-4">
          <h3
            ref={wordRef}
            className="flex select-none items-center justify-center whitespace-nowrap"
            aria-label="SPECTRUM"
          >
            {LETTERS.map((letter) => (
              <span
                key={letter.ch}
                className="flex flex-col items-center"
                aria-hidden="true"
              >
                <span
                  className={`${styles.letter} rr-letter text-[clamp(2.4rem,11vw,12.5rem)]`}
                  style={{ "--w": 100, color: letter.color } as React.CSSProperties}
                >
                  {letter.ch}
                </span>
                <span
                  className="rr-letter-label mt-4 hidden text-[8px] tracking-[0.3em] opacity-0 sm:block sm:text-[9px]"
                  style={{ color: letter.color }}
                >
                  {letter.label}
                </span>
              </span>
            ))}
          </h3>
        </div>
      </div>

      <div className={styles.vignette} aria-hidden="true" />

      <p
        ref={captionRef}
        className={`${styles.mono} absolute bottom-[10%] left-1/2 w-full -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.4em] text-[rgba(244,241,234,0.55)] opacity-0 sm:text-xs`}
      >
        Every wavelength at once is white
      </p>
    </div>
  );
}
