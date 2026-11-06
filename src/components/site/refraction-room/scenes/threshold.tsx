"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";

import styles from "../refraction.module.css";

/**
 * FIG. 00 — THRESHOLD
 * The chamber door. A beam of white light sweeps the room, the title
 * surfaces letter by letter, and the study begins.
 */
export function Threshold() {
  const sceneRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const spectrumRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const hintLineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

      const q = gsap.utils.selector(sceneRef);
      const split = new SplitText(titleRef.current, { type: "chars" });

      if (reduce) {
        gsap.set(split.chars, { yPercent: 0, autoAlpha: 1 });
        gsap.set(
          [spectrumRef.current, subRef.current, hintRef.current, beamRef.current],
          { autoAlpha: 1, scaleX: 1 },
        );
        gsap.set(kickerRef.current, { autoAlpha: 1 });
        return () => split.revert();
      }

      /* Entrance — plays once when the room enters the viewport. */
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sceneRef.current,
          start: "top 68%",
          once: true,
        },
      });

      intro
        .fromTo(
          beamRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power2.inOut" },
          0,
        )
        .fromTo(
          sweepRef.current,
          { xPercent: -120 },
          { xPercent: 520, duration: 1.5, ease: "power2.inOut" },
          0.35,
        )
        .fromTo(
          kickerRef.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.9,
            scrambleText: {
              text: "THE REFRACTION ROOM — A SCROLL STUDY IN FIVE FIGURES",
              chars: "01λμ·/—",
              speed: 0.45,
            },
          },
          0.3,
        )
        .from(
          split.chars,
          {
            yPercent: 115,
            duration: 1.15,
            stagger: 0.045,
            ease: "power4.out",
          },
          0.55,
        )
        .fromTo(
          spectrumRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.15, ease: "power3.inOut" },
          1.35,
        )
        .fromTo(
          subRef.current,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.85 },
          1.55,
        )
        .fromTo(
          hintRef.current,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          1.8,
        );

      /* Standing pulse on the scroll hint. */
      gsap.to(hintLineRef.current, {
        scaleY: 0.35,
        transformOrigin: "top",
        duration: 0.85,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.4,
      });

      /* Gentle parallax exit while the threshold hands over to fig. 01. */
      gsap.to(contentRef.current, {
        y: -72,
        autoAlpha: 0.22,
        ease: "none",
        scrollTrigger: {
          trigger: sceneRef.current,
          start: "bottom 78%",
          end: "bottom 8%",
          scrub: 1,
        },
      });

      return () => split.revert();
    },
    { scope: sceneRef },
  );

  return (
    <section
      ref={sceneRef}
      data-scene="00 · THRESHOLD"
      data-cursor="scroll"
      aria-label="Figure 00 — Threshold: the entrance to the Refraction Room"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6"
    >
      {/* ambient beam across the room */}
      <div
        ref={beamRef}
        aria-hidden="true"
        className="absolute left-0 right-0 top-[37%] h-px origin-left bg-[rgba(244,241,234,0.08)]"
      >
        <div
          ref={sweepRef}
          className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.65)] to-transparent"
        />
      </div>

      <div ref={contentRef} className="relative flex flex-col items-center text-center">
        <p
          ref={kickerRef}
          className={`${styles.mono} text-[10px] uppercase tracking-[0.4em] text-[rgba(244,241,234,0.55)] opacity-0 sm:text-xs`}
        >
          THE REFRACTION ROOM — A SCROLL STUDY IN FIVE FIGURES
        </p>

        <h2
          ref={titleRef}
          className={`${styles.display} mt-7 overflow-hidden text-[clamp(2.5rem,10vw,10.5rem)] font-extrabold leading-[0.95] tracking-tight`}
        >
          REFRACTION
        </h2>

        <div
          ref={spectrumRef}
          aria-hidden="true"
          className="mt-9 h-px w-[min(620px,72vw)] origin-left bg-[linear-gradient(90deg,#22d3ee,#8b5cf6,#d946ef,#ec4899,#f43f5e,#fb923c,#fbbf24)]"
        />

        <p
          ref={subRef}
          className={`${styles.mono} mt-9 max-w-md text-[13px] leading-relaxed text-[rgba(244,241,234,0.62)] opacity-0`}
        >
          Every component in the collection is light, disciplined.
          This is the room where the discipline is studied — five
          figures, one beam, no shortcuts.
        </p>

        <div
          ref={hintRef}
          className={`${styles.mono} mt-14 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-[rgba(244,241,234,0.45)] opacity-0`}
        >
          <span>Scroll to develop</span>
          <span
            ref={hintLineRef}
            aria-hidden="true"
            className="block h-6 w-px bg-current"
          />
          <span>Fig. 00/04</span>
        </div>
      </div>
    </section>
  );
}
