"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { ChevronDown, Move } from "lucide-react";

import { AuroraText } from "@/components/magicui/aurora-text";
import { SectionHeading } from "@/components/site/section-heading";
import {
  SpectrumParticles,
  type SpectrumParticlesHandle,
  type ViewBoxState,
} from "./particles";

/* ------------------------------------------------------------------ */
/* Scene geometry (SVG user-space, desktop viewBox 1200 x 600)         */
/* ------------------------------------------------------------------ */

const TRAIL = "M 180 300 C 340 150 460 470 670 300";
const ENTRY = { x: 670, y: 300 };
const CENTER = { x: 770, y: 265 };
const END_Y = [70, 140, 210, 280, 350, 420, 490];
const WORDS_X = 950;
const BEAM_X = 940;

const HUES = [
  "#22d3ee",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#fb923c",
  "#fbbf24",
];

const WORDS = [
  "MOTION",
  "COLOR",
  "RHYTHM",
  "FORM",
  "DEPTH",
  "CONTRAST",
  "EMOTION",
];

const CAPTIONS = [
  "Every interface begins as a single beam of pure light.",
  "Left alone, light only travels.",
  "Give it something to break against…",
  "…and one beam becomes seven stories.",
  "Discipline is how chaos becomes a mark.",
];

const SCENES = [
  { at: 0.0, label: "01 — GENESIS" },
  { at: 0.06, label: "02 — TREK" },
  { at: 0.26, label: "03 — MONOLITH" },
  { at: 0.36, label: "04 — DISPERSION" },
  { at: 0.7, label: "05 — CONVERGENCE" },
  { at: 0.84, label: "06 — ARRAY" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function LightChamber() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SVGGElement>(null);
  const beamsRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<SpectrumParticlesHandle>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const liveBeamRef = useRef<SVGPathElement>(null);
  const liveGlowRef = useRef<SVGPathElement>(null);

  /** True while the pinned scene is on screen — gates the canvas ticker. */
  const activeRef = useRef(false);
  /** Live viewBox so overlays and bursts map correctly per breakpoint. */
  const vbRef = useRef<ViewBoxState>({ x: 0, y: 0, w: 1200, h: 600 });
  /** Unlocks the draggable light source once the story completes. */
  const [interactive, setInteractive] = useState(false);
  const interactiveRef = useRef(false);

  /* ---------------------------------------------------------------- */
  /* The cinematic timeline                                            */
  /* ---------------------------------------------------------------- */

  useGSAP(
    () => {
      gsap.registerPlugin(
        ScrollTrigger,
        DrawSVGPlugin,
        MotionPathPlugin,
        SplitText,
        Draggable,
      );

      const mm = gsap.matchMedia();

      /** Static, accessible composition when the user prefers no motion. */
      const staticFinal = () => {
        gsap.set("#lc-orb", { autoAlpha: 0 });
        gsap.set("#lc-flash", { autoAlpha: 0 });
        gsap.set(["#lc-trail", "#lc-trail-glow"], { drawSVG: "0% 100%" });
        gsap.set("#lc-prism-stroke", { drawSVG: "0% 100%" });
        gsap.set("#lc-prism-fill", { autoAlpha: 1 });
        gsap.set(".lc-facet", { autoAlpha: 1 });
        gsap.set([".lc-beam", ".lc-beam-glow"], { drawSVG: "0% 100%" });
        gsap.set(".lc-word", { autoAlpha: 1 });
        gsap.set("#lc-tags span", { autoAlpha: 1 });
        gsap.set("#lc-mark", { autoAlpha: 1 });
        gsap.set(".lc-mark-ray", { drawSVG: "0% 100%" });
        gsap.set("#lc-sub", { autoAlpha: 1 });
        gsap.set("#lc-hint", { autoAlpha: 0 });
        gsap.set(cueRef.current, { autoAlpha: 0 });
        if (counterRef.current)
          counterRef.current.textContent = "05 — CONVERGENCE";
        if (progressRef.current)
          progressRef.current.style.transform = "scaleX(1)";
      };

      /** Build the full scrubbed story for a given breakpoint. */
      const build = (isMobile: boolean) => {
        const vb = isMobile
          ? { x: 140, y: 0, w: 900, h: 600 }
          : { x: 0, y: 0, w: 1200, h: 600 };
        vbRef.current = vb;
        gsap.set("#lc-svg", {
          attr: { viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}` },
        });

        // Kinetic headline — every char carries one hue of the spectrum.
        const split = new SplitText("#lc-headline", { type: "chars" });
        split.chars.forEach((el, i) => {
          const hue = HUES[i % HUES.length];
          el.style.color = hue;
          el.style.textShadow = `0 0 22px ${hue}66`;
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 72",
            end: () => `+=${isMobile ? 2400 : 3200}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onToggle: (self) => {
              activeRef.current = self.isActive;
            },
            onUpdate: (self) => {
              const p = self.progress;
              if (progressRef.current)
                progressRef.current.style.transform = `scaleX(${p})`;
              if (counterRef.current) {
                let label = SCENES[0].label;
                for (const s of SCENES) if (p >= s.at) label = s.label;
                if (counterRef.current.textContent !== label)
                  counterRef.current.textContent = label;
              }
              if (cueRef.current)
                cueRef.current.style.opacity = p < 0.015 ? "1" : "0";
              const done = p > 0.985;
              if (done !== interactiveRef.current) {
                interactiveRef.current = done;
                setInteractive(done);
              }
            },
          },
        });

        const capIn = (i: number, at: number) =>
          tl.fromTo(
            `#lc-cap-${i}`,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 2.5, ease: "power2.out" },
            at,
          );
        const capOut = (i: number, at: number) =>
          tl.to(
            `#lc-cap-${i}`,
            { autoAlpha: 0, y: -10, duration: 1.5, ease: "power2.in" },
            at,
          );

        /* — 01 · GENESIS — */
        tl.fromTo(
          "#lc-orb",
          { autoAlpha: 0, scale: 0.3, x: 180, y: 300 },
          {
            autoAlpha: 1,
            scale: 1,
            x: 180,
            y: 300,
            duration: 4,
            ease: "back.out(2)",
          },
          0,
        );
        capIn(0, 0.5);
        capOut(0, 6);

        /* — 02 · TREK — */
        tl.to(
          "#lc-orb",
          {
            motionPath: {
              path: "#lc-trail",
              align: "#lc-trail",
              alignOrigin: [0.5, 0.5],
            },
            duration: 20,
            ease: "power1.inOut",
          },
          6,
        );
        tl.fromTo(
          ["#lc-trail-glow", "#lc-trail"],
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 20, ease: "none" },
          6,
        );
        tl.to("#lc-grid", { opacity: 0.1, duration: 4, ease: "sine.inOut" }, 9);
        tl.to(
          "#lc-grid",
          { opacity: 0.045, duration: 4, ease: "sine.inOut" },
          20,
        );
        capIn(1, 9);
        capOut(1, 25);

        /* — 03 · MONOLITH — */
        tl.fromTo(
          "#lc-prism-stroke",
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 9, ease: "power2.inOut" },
          26,
        );
        tl.fromTo(
          "#lc-prism-fill",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 5, ease: "power1.inOut" },
          31,
        );
        tl.fromTo(
          ".lc-facet",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 3, stagger: 0.5, ease: "power1.out" },
          30,
        );
        capIn(2, 27);
        capOut(2, 36.5);

        /* — 04 · DISPERSION — */
        tl.to(
          "#lc-orb",
          {
            scale: 0.25,
            autoAlpha: 0,
            duration: 1.6,
            ease: "power2.in",
          },
          36.2,
        );
        tl.set("#lc-flash", { autoAlpha: 0, scale: 0.25 }, 0);
        tl.fromTo(
          "#lc-flash",
          { scale: 0.25, autoAlpha: 0.95 },
          {
            scale: 3.2,
            autoAlpha: 0,
            duration: 2.4,
            ease: "expo.out",
            immediateRender: false,
          },
          37.2,
        );
        // Dim the inner facets so the fan reads clean through the glass.
        tl.to(".lc-facet", { autoAlpha: 0.05, duration: 2, ease: "power1.in" }, 37.5);
        tl.fromTo(
          [".lc-beam-glow", ".lc-beam"],
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            duration: 7.5,
            ease: "power3.out",
            stagger: 0.5,
          },
          37.5,
        );
        tl.fromTo(
          ".lc-word",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 3,
            ease: "back.out(1.7)",
            stagger: 0.6,
          },
          41,
        );
        tl.fromTo(
          "#lc-tags span",
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 2.5,
            ease: "power2.out",
            stagger: 0.4,
          },
          41,
        );
        capIn(3, 38.5);
        capOut(3, 57);

        /* Parade — the fan shimmers and the words breathe. */
        tl.to(
          ".lc-beam-glow",
          {
            opacity: 0.55,
            duration: 5,
            stagger: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          48,
        );
        tl.to(
          ".lc-word",
          {
            y: -5,
            duration: 4,
            stagger: 0.4,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          50,
        );

        /* — 05 · CONVERGENCE — */
        capIn(4, 66);
        capOut(4, 80);
        const words = gsap.utils.selector(stageRef)(".lc-word");
        words.forEach((el, i) => {
          const wx = WORDS_X;
          const wy = END_Y[i] + 10;
          tl.to(
            el,
            {
              motionPath: {
                path: [
                  { x: wx, y: wy },
                  { x: (wx + CENTER.x) / 2, y: Math.min(wy, CENTER.y) - 90 },
                  { x: CENTER.x, y: CENTER.y },
                ],
                type: "thru",
                curviness: 1.5,
              },
              scale: 0.12,
              autoAlpha: 0,
              duration: 7,
              ease: "power2.in",
            },
            70 + i * 0.35,
          );
        });
        tl.to(
          [".lc-beam", ".lc-beam-glow"],
          { drawSVG: "0% 0%", duration: 6.5, ease: "power2.in", stagger: 0.22 },
          70,
        );
        // On mobile the spectral tags have told their story — let them rest.
        tl.to("#lc-tags", { autoAlpha: 0, duration: 3, ease: "power1.in" }, 70);
        tl.to(
          "#lc-prism-fill",
          { autoAlpha: 0.4, duration: 6, ease: "power1.inOut" },
          72,
        );
        // The trail has told its story — let it dissolve.
        tl.to(
          ["#lc-trail", "#lc-trail-glow"],
          { autoAlpha: 0, duration: 4, ease: "power1.in" },
          74,
        );
        // Ghost the prism so the mark becomes the hero.
        tl.to("#lc-prism", { autoAlpha: 0.12, duration: 5, ease: "power1.inOut" }, 78);

        /* — 06 · ARRAY — */
        tl.fromTo(
          "#lc-mark",
          { autoAlpha: 0, scale: 0.4, rotate: -12 },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 6,
            ease: "elastic.out(1, 0.5)",
          },
          82,
        );
        tl.fromTo(
          ".lc-mark-ray",
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 4, stagger: 0.35, ease: "power2.out" },
          83.5,
        );
        tl.call(
          () => particlesRef.current?.burst(CENTER.x, CENTER.y),
          [],
          85.5,
        );
        tl.fromTo(
          split.chars,
          { yPercent: 70, autoAlpha: 0, rotateX: -70 },
          {
            yPercent: 0,
            autoAlpha: 1,
            rotateX: 0,
            duration: 5,
            stagger: 0.3,
            ease: "back.out(1.6)",
          },
          86,
        );
        tl.fromTo(
          "#lc-sub",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 3.5, ease: "power2.out" },
          90.5,
        );
        tl.fromTo(
          "#lc-hint",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 3, ease: "power2.out" },
          93,
        );
        tl.to({}, { duration: 2 }, 98); // breathing room at the end

        return () => split.revert();
      };

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
          return ctx.conditions?.isDesktop ? build(false) : build(true);
        },
      );

      return () => mm.revert();
    },
    { scope: stageRef },
  );

  /* ---------------------------------------------------------------- */
  /* Interactive finale — draggable light source                       */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!interactive) return;
    const handle = handleRef.current;
    const stage = stageRef.current;
    const beam = liveBeamRef.current;
    const glow = liveGlowRef.current;
    const fan = beamsRef.current;
    if (!handle || !stage || !beam || !glow || !fan) return;

    /** Aim the live beam from the handle at the prism entry face. */
    const updateBeam = () => {
      const x = handle.offsetLeft + (gsap.getProperty(handle, "x") as number);
      const y = handle.offsetTop + (gsap.getProperty(handle, "y") as number);
      const vb = vbRef.current;
      const vx = vb.x + (x / stage.clientWidth) * vb.w;
      const vy = vb.y + (y / stage.clientHeight) * vb.h;
      const sag = (ENTRY.x - vx) * 0.1;
      const d = `M ${vx.toFixed(1)} ${vy.toFixed(1)} Q ${((vx + ENTRY.x) / 2).toFixed(1)} ${((vy + ENTRY.y) / 2 + sag).toFixed(1)} ${ENTRY.x} ${ENTRY.y}`;
      beam.setAttribute("d", d);
      glow.setAttribute("d", d);
      gsap.set(fan, {
        svgOrigin: `${ENTRY.x} ${ENTRY.y}`,
        rotation: gsap.utils.clamp(-10, 10, (vy - ENTRY.y) * 0.045),
      });
    };

    const drag = Draggable.create(handle, {
      type: "x,y",
      // Keep the light source in the upper-left quadrant so its beam
      // never crosses the finale typography.
      bounds: {
        minX: 8 - handle.offsetLeft,
        maxX: stage.clientWidth * 0.45 - handle.offsetLeft,
        minY: 8 - handle.offsetTop,
        maxY: stage.clientHeight * 0.52 - handle.offsetTop,
      },
      edgeResistance: 0.85,
      onDrag: updateBeam,
      onDragEnd: updateBeam,
    })[0];

    updateBeam();
    gsap.fromTo(
      handle,
      { scale: 0.3, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(2.2)" },
    );

    // The spectrum breathes while you hold the light.
    const breathe = gsap.to(".lc-beam-glow", {
      opacity: 0.5,
      duration: 1.15,
      yoyo: true,
      repeat: -1,
      stagger: 0.12,
      ease: "sine.inOut",
      overwrite: "auto",
    });

    return () => {
      drag.kill();
      breathe.kill();
      gsap.set(fan, { rotation: 0 });
      gsap.set(handle, { clearProps: "all" });
    };
  }, [interactive]);

  /* ---------------------------------------------------------------- */
  /* Mouse parallax (fine pointers only)                               */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;
    const qx = gsap.quickTo(scene, "x", { duration: 0.9, ease: "power3.out" });
    const qy = gsap.quickTo(scene, "y", { duration: 0.9, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      qx(((e.clientX - r.left) / r.width - 0.5) * -14);
      qy(((e.clientY - r.top) / r.height - 0.5) * -10);
    };
    stage.addEventListener("pointermove", onMove);
    return () => stage.removeEventListener("pointermove", onMove);
  }, []);

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <section id="chamber" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Interlude · The Light Chamber"
          title={
            <>
              One beam.{" "}
              <AuroraText
                colors={["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-fuchsia)"]}
              >
                Every color.
              </AuroraText>
            </>
          }
          description="A cinematic GSAP study — one hand-choreographed timeline, scrubbed by your scroll, finished by your hand. Stay for the dispersion. Then drag the light."
        />

        <div
          ref={stageRef}
          className="relative mx-auto mt-12 aspect-[1.5] w-[min(100%,165vh)] overflow-hidden rounded-3xl border border-white/10 bg-[#06060e] shadow-[0_40px_120px_-40px_rgba(139,92,246,0.35)] sm:aspect-[2/1]"
          role="img"
          aria-label="An interactive light chamber: a beam of light travels through a prism and disperses into a spectrum of seven words, then converges into the PRISM mark."
        >
          {/* particle layer */}
          <SpectrumParticles ref={particlesRef} activeRef={activeRef} vbRef={vbRef} />

          {/* the scene */}
          <svg
            id="lc-svg"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="lc-prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="lc-live-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
              <radialGradient id="lc-flash-grad">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#e9d5ff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </radialGradient>
              <filter id="lc-blur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <pattern id="lc-gridpat" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M40 0H0V40"
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.16"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>

            <g id="lc-scene" ref={sceneRef}>
              {/* faint grid */}
              <rect
                id="lc-grid"
                x="0"
                y="0"
                width="1200"
                height="600"
                fill="url(#lc-gridpat)"
                opacity="0.045"
              />

              {/* journey trail */}
              <path
                id="lc-trail-glow"
                d={TRAIL}
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.14"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                id="lc-trail"
                d={TRAIL}
                fill="none"
                stroke="#e9d5ff"
                strokeOpacity="0.55"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* the prism */}
              <g id="lc-prism">
                <polygon
                  id="lc-prism-fill"
                  points="570,430 770,170 970,430"
                  fill="#ffffff"
                  fillOpacity="0.07"
                />
                <polygon
                  id="lc-prism-stroke"
                  points="570,430 770,170 970,430"
                  fill="none"
                  stroke="url(#lc-prism-grad)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <line className="lc-facet" x1="770" y1="343" x2="770" y2="170" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
                <line className="lc-facet" x1="770" y1="343" x2="570" y2="430" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
                <line className="lc-facet" x1="770" y1="343" x2="970" y2="430" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
              </g>

              {/* impact flash */}
              <circle
                id="lc-flash"
                cx={ENTRY.x}
                cy={ENTRY.y}
                r="60"
                fill="url(#lc-flash-grad)"
                filter="url(#lc-blur)"
              />

              {/* spectrum fan */}
              <g id="lc-beams" ref={beamsRef}>
                {HUES.map((hue, i) => (
                  <g key={hue}>
                    <line
                      className="lc-beam-glow"
                      x1={ENTRY.x}
                      y1={ENTRY.y}
                      x2={BEAM_X}
                      y2={END_Y[i]}
                      stroke={hue}
                      strokeOpacity="0.28"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    <line
                      className="lc-beam"
                      x1={ENTRY.x}
                      y1={ENTRY.y}
                      x2={BEAM_X}
                      y2={END_Y[i]}
                      stroke={hue}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                ))}
              </g>

              {/* spectral words */}
              {WORDS.map((w, i) => (
                <text
                  key={w}
                  className="lc-word hidden font-display sm:block"
                  x={WORDS_X}
                  y={END_Y[i] + 10}
                  fontSize="28"
                  letterSpacing="5"
                  fill={HUES[i]}
                  fillOpacity="0.92"
                >
                  {w}
                </text>
              ))}

              {/* the mark — outer g holds the static placement transform,
                  inner g is what GSAP animates (scale/rotate) cleanly */}
              <g transform="translate(770 265) scale(4.6) translate(-15 -15)">
                <g id="lc-mark">
                  <path
                    d="M15 4.5 L25.5 23 H4.5 Z"
                    fill="none"
                    stroke="url(#lc-prism-grad)"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                  <line x1="1.5" y1="10.5" x2="9.3" y2="14.5" stroke="#a5b4fc" strokeWidth="1.4" strokeLinecap="round" />
                  <line className="lc-mark-ray" x1="21.8" y1="16.2" x2="29" y2="16" stroke="#8b5cf6" strokeWidth="1.4" strokeLinecap="round" />
                  <line className="lc-mark-ray" x1="22.7" y1="17.9" x2="29.2" y2="19.6" stroke="#d946ef" strokeWidth="1.4" strokeLinecap="round" />
                  <line className="lc-mark-ray" x1="23.5" y1="19.6" x2="28.8" y2="23.6" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" />
                </g>
              </g>

              {/* the orb */}
              <g id="lc-orb">
                <circle cx="0" cy="0" r="26" fill="#ffffff" opacity="0.05" />
                <circle cx="0" cy="0" r="13" fill="#ffffff" opacity="0.12" />
                <circle cx="0" cy="0" r="6.5" fill="#ffffff" />
                <circle cx="0" cy="0" r="10" fill="none" stroke="#f5f3ff" strokeOpacity="0.75" strokeWidth="1" />
              </g>

              {/* interactive live beam */}
              {interactive ? (
                <g id="lc-live">
                  <path
                    ref={liveGlowRef}
                    className="lc-dash"
                    d=""
                    fill="none"
                    stroke="#c4b5fd"
                    strokeOpacity="0.5"
                    strokeWidth="9"
                    strokeLinecap="round"
                    filter="url(#lc-blur)"
                  />
                  <path
                    ref={liveBeamRef}
                    className="lc-dash"
                    d=""
                    fill="none"
                    stroke="url(#lc-live-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              ) : null}
            </g>
          </svg>

          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

          {/* progress line */}
          <div className="absolute inset-x-0 top-0 z-20 h-px bg-white/10">
            <div
              ref={progressRef}
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300"
            />
          </div>

          {/* scene counter */}
          <div className="absolute right-4 top-4 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 sm:right-6 sm:top-5">
            <span id="lc-counter" ref={counterRef}>01 — GENESIS</span>
          </div>

          {/* captions */}
          <div className="absolute bottom-14 left-4 z-20 h-10 w-[300px] sm:bottom-16 sm:left-8 sm:w-[420px]">
            {CAPTIONS.map((c, i) => (
              <p
                key={c}
                id={`lc-cap-${i}`}
                className="absolute bottom-0 left-0 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-white/60 sm:text-xs"
              >
                <span className="mr-2 text-white/30">0{i + 1}</span>
                {c}
              </p>
            ))}
          </div>

          {/* scroll cue */}
          <div
            ref={cueRef}
            className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-500"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/35">
              scroll
            </span>
            <ChevronDown className="size-3.5 animate-bounce text-white/35" aria-hidden="true" />
          </div>

          {/* finale typography — anchored by `bottom` (height-relative),
              never padding-bottom (which is width-relative in CSS) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[9%] z-10 flex flex-col items-center">
            <h3
              id="lc-headline"
              className="font-display text-3xl font-bold tracking-tight sm:text-6xl"
              style={{ perspective: "800px" }}
            >
              LIGHT, ARRANGED.
            </h3>
            <p
              id="lc-sub"
              className="mt-3 hidden max-w-md text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 sm:block sm:text-xs"
            >
              Every component below is just light, arranged with intent.
            </p>
            <div
              id="lc-hint"
              className="mt-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm"
            >
              <Move className="size-3" aria-hidden="true" />
              Drag the light — bend the spectrum
            </div>
          </div>

          {/* draggable light source */}
          {interactive ? (
            <div
              ref={handleRef}
              className="absolute left-[14%] top-[28%] z-30 -ml-[22px] -mt-[22px] size-11 cursor-grab touch-none rounded-full border border-white/25 bg-white/10 backdrop-blur-sm active:cursor-grabbing sm:top-1/2"
              role="slider"
              aria-label="Light source — drag to bend the spectrum"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
              tabIndex={0}
            >
              <span className="absolute inset-0 m-auto size-3.5 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,0.55)]" />
            </div>
          ) : null}

          {/* mobile spectral tags */}
          <div
            id="lc-tags"
            className="absolute inset-x-3 bottom-2 z-20 flex flex-wrap items-center justify-center gap-1.5 sm:hidden"
          >
            {WORDS.map((w, i) => (
              <span
                key={w}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/70 backdrop-blur-sm"
              >
                <span
                  className="size-1 rounded-full"
                  style={{ backgroundColor: HUES[i] }}
                />
                {w}
              </span>
            ))}
          </div>

          {/* signature */}
          <div className="absolute bottom-3 right-4 z-20 hidden font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 sm:block">
            gsap 3.13 · scrubbed timeline · zero templates
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
          scrolltrigger · drawsvg · motionpath · splittext · draggable · canvas
        </p>
      </div>
    </section>
  );
}
