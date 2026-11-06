"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

import styles from "../refraction.module.css";

/* ------------------------------------------------------------------ */
/* Plate geometry — desktop viewBox 1440 x 700                         */
/* ------------------------------------------------------------------ */

const APEX = { x: 700, y: 175 };
const BASE_L = { x: 565, y: 480 };
const BASE_R = { x: 835, y: 480 };
const ENTRY = { x: 621, y: 350 };
const EXIT = { x: 817, y: 430 };

const RAY_COLORS = [
  { name: "RED", lambda: "680", color: "#f43f5e", angle: 1 },
  { name: "ORANGE", lambda: "620", color: "#fb923c", angle: 5 },
  { name: "AMBER", lambda: "580", color: "#fbbf24", angle: 9.5 },
  { name: "GREEN", lambda: "540", color: "#4ade80", angle: 14 },
  { name: "CYAN", lambda: "490", color: "#22d3ee", angle: 18.5 },
  { name: "VIOLET", lambda: "440", color: "#8b5cf6", angle: 23 },
  { name: "FUCHSIA", lambda: "400", color: "#d946ef", angle: 27.5 },
] as const;

const RAYS = RAY_COLORS.map((ray) => {
  const rad = (ray.angle * Math.PI) / 180;
  const len = 610 / Math.cos(rad);
  return {
    ...ray,
    x2: EXIT.x + Math.cos(rad) * len,
    y2: EXIT.y + Math.sin(rad) * len,
    labelY: EXIT.y + (1235 - EXIT.x) * Math.tan(rad) - 8,
  };
});

const TICKS = Array.from({ length: 37 }, (_, i) => ({
  x: 60 + i * 36,
  major: i % 5 === 0,
}));

/**
 * FIG. 01 — DISPERSION
 * An optics plate drawn live by scroll: a coherent beam meets a crown
 * glass prism, bends once inside, and leaves as seven labeled
 * wavelengths. Every annotation is hand-placed.
 */
export function Dispersion() {
  const stageRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<SVGGElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(
        ScrollTrigger,
        DrawSVGPlugin,
        ScrambleTextPlugin,
      );

      const q = gsap.utils.selector(stageRef);
      const stage = stageRef.current;
      if (!stage) return;

      const staticFinal = () => {
        gsap.set(q(".rr-plate-wrap"), { autoAlpha: 1 });
        gsap.set(q(".rr-source-beam"), { drawSVG: "0% 100%" });
        gsap.set(q(".rr-prism-edge"), { drawSVG: "0% 100%" });
        gsap.set(q(".rr-prism-fill"), { autoAlpha: 1 });
        gsap.set(q(".rr-vertex"), { autoAlpha: 1, scale: 1 });
        gsap.set(q(".rr-normal, .rr-normal-label"), { autoAlpha: 1 });
        gsap.set(q(".rr-theta"), { autoAlpha: 1 });
        gsap.set(q(".rr-internal"), { drawSVG: "0% 100%" });
        gsap.set(q(".rr-ray, .rr-ray-glow"), { drawSVG: "0% 100%" });
        gsap.set(q(".rr-ray-label"), { autoAlpha: 1 });
        gsap.set(q(".rr-index-label, .rr-ruler-label"), { autoAlpha: 1 });
        gsap.set(q(".rr-tick"), { autoAlpha: 1 });
        gsap.set(q(".rr-source-label"), { autoAlpha: 1 });
        gsap.set(captionRef.current, { autoAlpha: 1, y: 0 });
      };

      const build = (isMobile: boolean) => {
        gsap.set("#rr-svg", {
          attr: {
            viewBox: isMobile
              ? "310 60 1070 600"
              : "0 0 1440 700",
          },
        });
        gsap.set(q(".rr-plate-wrap"), { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${isMobile ? 1500 : 1800}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        /* — the source — */
        tl.fromTo(
          ".rr-source-beam",
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 6, ease: "power1.inOut" },
          0,
        );
        tl.fromTo(
          ".rr-source-label",
          { autoAlpha: 0 },
          {
            autoAlpha: 0.85,
            duration: 4,
            scrambleText: {
              text: "SOURCE — WHITE · COHERENT",
              chars: "01λ·/",
              speed: 0.5,
            },
          },
          1.5,
        );

        /* — the prism rises — */
        tl.fromTo(
          ".rr-prism-edge",
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            duration: 8,
            stagger: 1.1,
            ease: "power2.inOut",
          },
          5,
        );
        tl.fromTo(
          ".rr-prism-fill",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 5, ease: "power1.inOut" },
          10,
        );
        tl.fromTo(
          ".rr-vertex",
          { autoAlpha: 0, scale: 0.2, transformOrigin: "center" },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 2.4,
            stagger: 0.7,
            ease: "back.out(2.5)",
          },
          12.5,
        );

        /* — physics annotations (transient) — */
        tl.fromTo(
          ".rr-normal",
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 4, ease: "power2.out" },
          17,
        );
        tl.fromTo(
          ".rr-normal-label, .rr-theta",
          { autoAlpha: 0 },
          { autoAlpha: 0.9, duration: 2.5, ease: "power1.out" },
          19,
        );
        tl.to(
          ".rr-normal, .rr-normal-label, .rr-theta",
          { autoAlpha: 0, duration: 3, ease: "power1.in" },
          28,
        );

        /* — refraction inside the glass — */
        tl.fromTo(
          ".rr-internal",
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 8, ease: "power1.inOut" },
          23,
        );

        /* — the spectrum fans out — */
        tl.fromTo(
          ".rr-ray-glow",
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            duration: 11,
            stagger: 1.1,
            ease: "power2.out",
          },
          31,
        );
        tl.fromTo(
          ".rr-ray",
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            duration: 11,
            stagger: 1.1,
            ease: "power2.out",
          },
          31.6,
        );

        /* — wavelength labels — */
        tl.fromTo(
          ".rr-ray-label",
          { autoAlpha: 0, x: -10 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 3,
            stagger: 0.9,
            ease: "power2.out",
          },
          44,
        );

        /* — instrument chrome — */
        tl.fromTo(
          ".rr-index-label, .rr-ruler-label",
          { autoAlpha: 0 },
          { autoAlpha: 0.8, duration: 3.5, ease: "power1.out" },
          50,
        );
        tl.fromTo(
          ".rr-tick",
          { autoAlpha: 0 },
          {
            autoAlpha: 0.5,
            duration: 0.8,
            stagger: 0.22,
            ease: "none",
          },
          51,
        );

        /* — a slow breath while the plate settles — */
        tl.fromTo(
          plateRef.current,
          { scale: 1, transformOrigin: "50% 45%" },
          { scale: 1.035, duration: 16, ease: "sine.inOut" },
          56,
        );
        tl.fromTo(
          captionRef.current,
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 5, ease: "power2.out" },
          58,
        );

        /* — the fan ignites, then hands off — */
        tl.to(".rr-ray-glow", { opacity: 0.34, duration: 6, ease: "sine.inOut" }, 80);
        tl.to(".rr-ray-glow", { opacity: 0.2, duration: 6, ease: "sine.inOut" }, 90);
        tl.to(captionRef.current, { autoAlpha: 0, y: -14, duration: 4, ease: "power1.in" }, 96);
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

      /* Mouse parallax on the plate (fine pointers only). */
      if (window.matchMedia("(pointer: fine)").matches) {
        const qx = gsap.quickTo(plateRef.current, "x", {
          duration: 0.9,
          ease: "power3.out",
        });
        const qy = gsap.quickTo(plateRef.current, "y", {
          duration: 0.9,
          ease: "power3.out",
        });
        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          qx((((e.clientX - r.left) / r.width) * 2 - 1) * -14);
          qy((((e.clientY - r.top) / r.height) * 2 - 1) * -10);
        };
        stage.addEventListener("pointermove", onMove);
        return () => {
          stage.removeEventListener("pointermove", onMove);
          mm.revert();
        };
      }

      return () => mm.revert();
    },
    { scope: stageRef },
  );

  return (
    <div
      ref={stageRef}
      data-scene="01 · DISPERSION"
      role="img"
      aria-label="Figure 01, Dispersion: a white beam enters a glass prism, bends once inside, and exits as seven labeled wavelengths from red to fuchsia."
      className="relative h-[100svh] overflow-hidden"
    >
      <p className={`${styles.figCaption} ${styles.mono}`}>FIG. 01 — DISPERSION</p>
      <p className={`${styles.figCaptionRight} ${styles.mono}`}>
        PLATE 01 · CROWN GLASS
      </p>

      <div className="rr-plate-wrap absolute inset-0 opacity-0">
        <svg
          id="rr-svg"
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <filter id="rr-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>

          <g ref={plateRef}>
            {/* ruler along the bottom of the plate */}
            {TICKS.map((tick, i) => (
              <line
                key={`tick-${i}`}
                className="rr-tick"
                x1={tick.x}
                y1={tick.major ? 644 : 652}
                x2={tick.x}
                y2={660}
                stroke="#f4f1ea"
                strokeWidth={tick.major ? 1 : 0.6}
              />
            ))}
            <text
              className="rr-ruler-label"
              x="60"
              y="686"
              fill="#f4f1ea"
              fillOpacity="0.55"
              fontSize="10"
              letterSpacing="3"
              fontFamily="monospace"
            >
              PLATE 01 — DISPERSION THROUGH CROWN PRISM · 60° APEX
            </text>

            {/* incoming beam */}
            <line
              className="rr-source-beam"
              x1="0"
              y1={ENTRY.y}
              x2={ENTRY.x}
              y2={ENTRY.y}
              stroke="#f4f1ea"
              strokeOpacity="0.85"
              strokeWidth="2"
            />
            <text
              className="rr-source-label"
              x="16"
              y="332"
              fill="#f4f1ea"
              fillOpacity="0.7"
              fontSize="11"
              letterSpacing="2.5"
              fontFamily="monospace"
            >
              SOURCE — WHITE · COHERENT
            </text>

            {/* prism body */}
            <polygon
              className="rr-prism-fill"
              points={`${APEX.x},${APEX.y} ${BASE_L.x},${BASE_L.y} ${BASE_R.x},${BASE_R.y}`}
              fill="#ffffff"
              fillOpacity="0.05"
              stroke="none"
            />
            <line
              className="rr-prism-edge"
              x1={APEX.x}
              y1={APEX.y}
              x2={BASE_L.x}
              y2={BASE_L.y}
              stroke="#f4f1ea"
              strokeOpacity="0.65"
              strokeWidth="2"
            />
            <line
              className="rr-prism-edge"
              x1={BASE_L.x}
              y1={BASE_L.y}
              x2={BASE_R.x}
              y2={BASE_R.y}
              stroke="#f4f1ea"
              strokeOpacity="0.65"
              strokeWidth="2"
            />
            <line
              className="rr-prism-edge"
              x1={BASE_R.x}
              y1={BASE_R.y}
              x2={APEX.x}
              y2={APEX.y}
              stroke="#f4f1ea"
              strokeOpacity="0.65"
              strokeWidth="2"
            />
            <circle className="rr-vertex" cx={APEX.x} cy={APEX.y} r="3.5" fill="#ffffff" />
            <circle className="rr-vertex" cx={BASE_L.x} cy={BASE_L.y} r="3.5" fill="#ffffff" />
            <circle className="rr-vertex" cx={BASE_R.x} cy={BASE_R.y} r="3.5" fill="#ffffff" />

            {/* surface normal + incident angle */}
            <line
              className="rr-normal"
              x1="571"
              y1="328"
              x2="671"
              y2="372"
              stroke="#f4f1ea"
              strokeOpacity="0.5"
              strokeWidth="1"
              strokeDasharray="4 5"
            />
            <text
              className="rr-normal-label"
              x="554"
              y="326"
              fill="#f4f1ea"
              fillOpacity="0.6"
              fontSize="11"
              fontFamily="monospace"
            >
              N
            </text>
            <path
              className="rr-theta"
              d="M 655 350 A 34 34 0 0 1 652.1 363.8"
              fill="none"
              stroke="#f4f1ea"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            <text
              className="rr-index-label"
              x="700"
              y="458"
              textAnchor="middle"
              fill="#f4f1ea"
              fillOpacity="0.65"
              fontSize="12"
              letterSpacing="2"
              fontFamily="monospace"
            >
              n = 1.52
            </text>

            {/* refracted ray inside the glass */}
            <line
              className="rr-internal"
              x1={ENTRY.x}
              y1={ENTRY.y}
              x2={EXIT.x}
              y2={EXIT.y}
              stroke="#ffffff"
              strokeOpacity="0.95"
              strokeWidth="2.2"
            />

            {/* the spectrum */}
            <g filter="url(#rr-glow)">
              {RAYS.map((ray) => (
                <line
                  key={`glow-${ray.name}`}
                  className="rr-ray-glow"
                  x1={EXIT.x}
                  y1={EXIT.y}
                  x2={ray.x2}
                  y2={ray.y2}
                  stroke={ray.color}
                  strokeWidth="7"
                  strokeOpacity="0.16"
                />
              ))}
            </g>
            {RAYS.map((ray) => (
              <line
                key={`ray-${ray.name}`}
                className="rr-ray"
                x1={EXIT.x}
                y1={EXIT.y}
                x2={ray.x2}
                y2={ray.y2}
                stroke={ray.color}
                strokeWidth="1.8"
                strokeOpacity="0.95"
              />
            ))}
            {RAYS.map((ray) => (
              <text
                key={`label-${ray.name}`}
                className="rr-ray-label"
                x="1218"
                y={ray.labelY}
                fill={ray.color}
                fontSize="11"
                letterSpacing="2"
                fontFamily="monospace"
              >
                {`λ ${ray.lambda} — ${ray.name}`}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <div className={styles.vignette} aria-hidden="true" />

      <p
        ref={captionRef}
        className={`${styles.display} absolute bottom-[9%] left-6 max-w-[16rem] text-xl font-bold leading-tight text-[#f4f1ea] opacity-0 sm:left-10 sm:max-w-sm sm:text-3xl lg:text-4xl`}
      >
        One beam in.
        <span className="block text-[rgba(244,241,234,0.55)]">
          Seven wavelengths out.
        </span>
      </p>
    </div>
  );
}
