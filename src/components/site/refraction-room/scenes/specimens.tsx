"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ArrowDown } from "lucide-react";

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

/* Deterministic ball field — no hydration surprises. */
const BALLS = Array.from({ length: 14 }, (_, i) => ({
  left: 4 + ((i * 67) % 88),
  size: [12, 18, 10, 15, 22, 13, 9, 17, 11, 20, 14, 10, 16, 12][i],
  color: HUES[i % HUES.length],
}));

const ORBIT_DOTS = [
  { color: "#22d3ee", duration: 8, progress: 0.15 },
  { color: "#d946ef", duration: 13, progress: 0.55 },
  { color: "#fbbf24", duration: 19, progress: 0.8, reverse: true },
] as const;

/**
 * FIG. 03 — SPECIMEN WALL
 * The study turns sideways: a pinned horizontal wall of five
 * observable behaviors — magnetism, gravity, inertia, velocity,
 * orbit — each one live under the visitor’s hand.
 */
export function Specimens() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const magnetAreaRef = useRef<HTMLDivElement>(null);
  const magnetDiscRef = useRef<HTMLDivElement>(null);
  const magnetReadRef = useRef<HTMLSpanElement>(null);
  const gravBoxRef = useRef<HTMLDivElement>(null);
  const gravPanelRef = useRef<HTMLElement>(null);
  const inertiaAreaRef = useRef<HTMLDivElement>(null);
  const inertiaCardRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLParagraphElement>(null);
  const velocityRowsRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(
        ScrollTrigger,
        Draggable,
        InertiaPlugin,
        MotionPathPlugin,
      );

      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;

      const q = gsap.utils.selector(stageRef);

      const staticFinal = () => {
        gsap.set(q(".rr-panel"), { autoAlpha: 1, y: 0 });
        gsap.set(q(".rr-ball"), { autoAlpha: 1, y: 120 });
        gsap.set(q(".rr-velocity-copy"), { autoAlpha: 1 });
      };

      const build = () => {
        const teardown: Array<() => void> = [];
        /* ---------- the sideways journey ---------- */
        const distance = () => track.scrollWidth - stage.clientWidth;

        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* Panels surface as they cross the viewport. */
        q(".rr-panel").forEach((panel) => {
          gsap.fromTo(
            panel,
            { y: 52, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              ease: "power1.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left 92%",
                end: "left 58%",
                scrub: true,
              },
            },
          );
        });

        /* ---------- specimen 01 · magnetism ---------- */
        const area = magnetAreaRef.current;
        const disc = magnetDiscRef.current;
        if (area && disc) {
          if (window.matchMedia("(pointer: fine)").matches) {
            const dx = gsap.quickTo(disc, "x", {
              duration: 0.5,
              ease: "power3.out",
            });
            const dy = gsap.quickTo(disc, "y", {
              duration: 0.5,
              ease: "power3.out",
            });
            const onMove = (e: PointerEvent) => {
              const r = area.getBoundingClientRect();
              const px = e.clientX - (r.left + r.width / 2);
              const py = e.clientY - (r.top + r.height / 2);
              const dist = Math.max(Math.hypot(px, py), 1);
              const radius = Math.max(r.width, r.height) * 0.72;
              const pull = (1 - Math.min(dist / radius, 1)) * 88;
              const tx = (px / dist) * Math.min(pull, dist);
              const ty = (py / dist) * Math.min(pull, dist);
              dx(tx);
              dy(ty);
              if (magnetReadRef.current)
                magnetReadRef.current.textContent = `x ${Math.round(tx)} · y ${Math.round(ty)}`;
            };
            const onLeave = () => {
              dx(0);
              dy(0);
              if (magnetReadRef.current)
                magnetReadRef.current.textContent = "x 0 · y 0";
            };
            area.addEventListener("pointermove", onMove);
            area.addEventListener("pointerleave", onLeave);
            teardown.push(() => {
              area.removeEventListener("pointermove", onMove);
              area.removeEventListener("pointerleave", onLeave);
            });
          } else {
            /* Coarse pointers get a resting field instead. */
            const drift = gsap.timeline({ repeat: -1, yoyo: true });
            drift.to(disc, { x: 64, duration: 2.6, ease: "sine.inOut" }, 0);
            drift.to(disc, { y: 34, duration: 3.3, ease: "sine.inOut" }, 0);
            teardown.push(() => drift.kill());
          }
        }

        /* ---------- specimen 02 · gravity ---------- */
        const gravBox = gravBoxRef.current;
        const gravPanel = gravPanelRef.current;
        if (gravBox && gravPanel) {
          const balls = gravBox.querySelectorAll<HTMLElement>(".rr-ball");

          const dropAll = () => {
            const H = gravBox.clientHeight;
            balls.forEach((ball, i) => {
              const size = BALLS[i].size;
              const floor = H - size - 2;
              const bounce =
                Math.min(46 + ((i * 37) % 84), H * 0.42);
              const baseDur = 0.62 + (i % 5) * 0.07;
              const drift = ((i * 53) % 120) - 60;
              const tl = gsap.timeline({ delay: i * 0.05 });
              tl.set(ball, { y: -size * 2, x: 0, autoAlpha: 1 })
                .to(ball, { y: floor, duration: baseDur, ease: "power2.in" })
                .to(ball, { y: floor - bounce, duration: baseDur * 0.62, ease: "power2.out" })
                .to(ball, { y: floor, duration: baseDur * 0.62, ease: "power2.in" })
                .to(ball, { y: floor - bounce * 0.4, duration: baseDur * 0.48, ease: "power2.out" })
                .to(ball, { y: floor, duration: baseDur * 0.48, ease: "power2.in" })
                .to(ball, { y: floor - bounce * 0.14, duration: baseDur * 0.36, ease: "power2.out" })
                .to(ball, { y: floor, duration: baseDur * 0.36, ease: "power2.in" })
                .to(ball, { x: drift, duration: baseDur * 3.3, ease: "none" }, 0);
            });
          };
          dropRef.current = dropAll;

          ScrollTrigger.create({
            trigger: gravPanel,
            containerAnimation: scrollTween,
            start: "left 70%",
            once: true,
            onEnter: () => dropAll(),
          });

          teardown.push(() => {
            balls.forEach((ball) => gsap.killTweensOf(ball));
          });
        }

        /* ---------- specimen 03 · inertia ---------- */
        const inertiaArea = inertiaAreaRef.current;
        const card = inertiaCardRef.current;
        if (inertiaArea && card) {
          const updateCoords = () => {
            if (!coordRef.current) return;
            const x = gsap.getProperty(card, "x") as number;
            const y = gsap.getProperty(card, "y") as number;
            coordRef.current.textContent = `x ${Math.round(x)} · y ${Math.round(y)}`;
          };
          const drag = Draggable.create(card, {
            type: "x,y",
            inertia: true,
            bounds: inertiaArea,
            edgeResistance: 0.82,
            onDrag: updateCoords,
            onThrowUpdate: updateCoords,
          })[0];
          teardown.push(() => drag.kill());
        }

        /* ---------- specimen 04 · velocity ---------- */
        const rowsWrap = velocityRowsRef.current;
        if (rowsWrap) {
          const rows = gsap.utils.toArray<HTMLElement>(
            ".rr-vrow",
            rowsWrap,
          ) as HTMLElement[];
          const loops = rows.map((row, i) => {
            const tween = gsap.to(row, {
              xPercent: i === 1 ? 0 : -50,
              repeat: -1,
              duration: [17, 12, 21][i] ?? 17,
              ease: "none",
              paused: false,
            });
            if (i === 1) {
              gsap.set(row, { xPercent: -50 });
            }
            return tween;
          });

          const proxy = { skew: 0 };
          const clampSkew = gsap.utils.clamp(-4, 4);
          const skewTo = gsap.quickTo(rowsWrap, "skewX", {
            duration: 0.5,
            ease: "power3.out",
          });
          const velocityTrigger = ScrollTrigger.create({
            trigger: stage,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              const v = Math.abs(self.getVelocity());
              const ts = gsap.utils.clamp(0.6, 5, 0.6 + v / 1100);
              loops.forEach((loop) => loop.timeScale(ts));
              const skew = clampSkew(self.getVelocity() / -450);
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
          teardown.push(() => {
            velocityTrigger.kill();
            loops.forEach((loop) => loop.kill());
          });
        }

        /* ---------- specimen 05 · orbit ---------- */
        const orbitDots = q(".rr-orbit-dot");
        const ring = q(".rr-orbit-ring");
        if (orbitDots.length) {
          const spin = gsap.to(ring, {
            rotation: 360,
            svgOrigin: "160 160",
            repeat: -1,
            duration: 90,
            ease: "none",
          });
          const orbits = orbitDots.map((dot, i) => {
            const spec = ORBIT_DOTS[i];
            const tween = gsap.to(dot, {
              duration: spec.duration,
              repeat: -1,
              ease: "none",
              motionPath: {
                path: "#rr-orbit-path",
                align: "#rr-orbit-path",
                alignOrigin: [0.5, 0.5],
                start: spec.reverse ? 1 : 0,
                end: spec.reverse ? 0 : 1,
              },
            });
            tween.progress(spec.progress);
            return tween;
          });
          teardown.push(() => {
            spin.kill();
            orbits.forEach((orbit) => orbit.kill());
          });
        }

        return () => teardown.forEach((fn) => fn());
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
          return build();
        },
      );

      return () => {
        mm.revert();
      };
    },
    { scope: stageRef },
  );

  return (
    <div
      ref={stageRef}
      data-scene="03 · SPECIMENS"
      aria-label="Figure 03, Specimen Wall: a horizontal gallery of five interactive motion specimens — magnetism, gravity, inertia, velocity and orbit."
      className="relative h-[100svh] overflow-hidden"
    >
      <p className={`${styles.figCaption} ${styles.mono}`}>
        FIG. 03 — SPECIMEN WALL
      </p>
      <p className={`${styles.figCaptionRight} ${styles.mono}`}>
        TRAVEL BY SCROLLING DOWN
      </p>

      <div
        ref={trackRef}
        className="flex h-full w-max items-center gap-[6vw] px-[10vw] will-change-transform"
      >
        {/* — 01 · magnetism — */}
        <article
          className={`rr-panel relative flex h-[72svh] w-[80vw] shrink-0 flex-col justify-between border border-white/10 bg-[#0a0a11] p-6 sm:w-[56vw] md:p-9 lg:w-[44vw] ${styles.rrFocus}`}
        >
          <header className={`${styles.mono} flex justify-between text-[10px] uppercase tracking-[0.3em] text-[rgba(244,241,234,0.5)]`}>
            <span>Specimen 01/05</span>
            <span>Magnetism</span>
          </header>
          <div
            ref={magnetAreaRef}
            data-cursor="attract"
            className="relative my-5 flex-1"
          >
            <div
              ref={magnetDiscRef}
              className="absolute left-1/2 top-1/2 -ml-5 -mt-5 size-10 rounded-full border border-white/40 bg-white/5"
            >
              <div className="absolute inset-[13px] rounded-full bg-[#d946ef]" />
            </div>
            <span
              ref={magnetReadRef}
              className={`${styles.mono} absolute bottom-1 right-1 text-[9px] tracking-[0.2em] text-[rgba(244,241,234,0.4)]`}
            >
              x 0 · y 0
            </span>
            <span className={`${styles.mono} absolute bottom-1 left-1 text-[9px] tracking-[0.2em] text-[rgba(244,241,234,0.3)]`}>
              DRAW NEAR
            </span>
          </div>
          <footer className="flex items-end justify-between gap-4">
            <p className={`${styles.mono} max-w-[18ch] text-[9px] leading-relaxed tracking-[0.18em] text-[rgba(244,241,234,0.4)]`}>
              A FIELD THAT LEANS TOWARD YOUR POINTER
            </p>
            <span className={`${styles.outline} ${styles.display} text-5xl font-extrabold leading-none md:text-6xl`}>01</span>
          </footer>
        </article>

        {/* — 02 · gravity — */}
        <article
          ref={gravPanelRef}
          className={`rr-panel relative flex h-[72svh] w-[80vw] shrink-0 flex-col justify-between border border-white/10 bg-[#0a0a11] p-6 sm:w-[56vw] md:p-9 lg:w-[44vw] ${styles.rrFocus}`}
        >
          <header className={`${styles.mono} flex justify-between text-[10px] uppercase tracking-[0.3em] text-[rgba(244,241,234,0.5)]`}>
            <span>Specimen 02/05</span>
            <span>Gravity</span>
          </header>
          <div
            ref={gravBoxRef}
            data-cursor="drop"
            onClick={() => dropRef.current?.()}
            className="relative my-5 flex-1 overflow-hidden border border-white/10"
          >
            <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px bg-[rgba(244,241,234,0.25)]" />
            {BALLS.map((ball, i) => (
              <span
                key={`ball-${i}`}
                className="rr-ball absolute top-0 rounded-full opacity-0"
                style={{
                  left: `${ball.left}%`,
                  width: ball.size,
                  height: ball.size,
                  background: ball.color,
                }}
              />
            ))}
            <span className={`${styles.mono} absolute bottom-1.5 left-2 text-[9px] tracking-[0.2em] text-[rgba(244,241,234,0.35)]`}>
              TAP TO RE-DROP
            </span>
          </div>
          <footer className="flex items-end justify-between gap-4">
            <p className={`${styles.mono} max-w-[18ch] text-[9px] leading-relaxed tracking-[0.18em] text-[rgba(244,241,234,0.4)]`}>
              FOURTEEN BODIES, THREE BOUNCES, NO MERCY
            </p>
            <span className={`${styles.outline} ${styles.display} text-5xl font-extrabold leading-none md:text-6xl`}>02</span>
          </footer>
        </article>

        {/* — 03 · inertia — */}
        <article className={`rr-panel relative flex h-[72svh] w-[80vw] shrink-0 flex-col justify-between border border-white/10 bg-[#0a0a11] p-6 sm:w-[56vw] md:p-9 lg:w-[44vw] ${styles.rrFocus}`}>
          <header className={`${styles.mono} flex justify-between text-[10px] uppercase tracking-[0.3em] text-[rgba(244,241,234,0.5)]`}>
            <span>Specimen 03/05</span>
            <span>Inertia</span>
          </header>
          <div
            ref={inertiaAreaRef}
            data-cursor="drag"
            className="relative my-5 flex-1 overflow-hidden border border-white/10"
          >
            <div
              ref={inertiaCardRef}
              className="absolute left-[36%] top-[26%] flex size-[clamp(120px,13vw,170px)] touch-none flex-col justify-between border border-white/25 bg-[#0d0d15] p-4"
            >
              <div className={`${styles.mono} flex justify-between text-[8px] tracking-[0.25em] text-[rgba(244,241,234,0.5)]`}>
                <span>PRISM</span>
                <span>№ 03</span>
              </div>
              <div className="text-center">
                <div className="mx-auto size-2 rounded-full bg-[#22d3ee]" />
                <p className={`${styles.mono} mt-2 text-[8px] tracking-[0.25em] text-[rgba(244,241,234,0.45)]`}>
                  SPECIMEN CARD
                </p>
              </div>
              <p
                ref={coordRef}
                className={`${styles.mono} text-[9px] tracking-[0.15em] text-[rgba(244,241,234,0.55)]`}
              >
                x 0 · y 0
              </p>
            </div>
          </div>
          <footer className="flex items-end justify-between gap-4">
            <p className={`${styles.mono} max-w-[18ch] text-[9px] leading-relaxed tracking-[0.18em] text-[rgba(244,241,234,0.4)]`}>
              THROW IT. IT GLIDES, THEN RESTS
            </p>
            <span className={`${styles.outline} ${styles.display} text-5xl font-extrabold leading-none md:text-6xl`}>03</span>
          </footer>
        </article>

        {/* — 04 · velocity — */}
        <article className="rr-panel relative flex h-[72svh] w-[80vw] shrink-0 flex-col justify-between border border-white/10 bg-[#0a0a11] p-6 sm:w-[56vw] md:p-9 lg:w-[44vw]">
          <header className={`${styles.mono} flex justify-between text-[10px] uppercase tracking-[0.3em] text-[rgba(244,241,234,0.5)]`}>
            <span>Specimen 04/05</span>
            <span>Velocity</span>
          </header>
          <div
            ref={velocityRowsRef}
            className={`relative my-5 flex flex-1 flex-col justify-center gap-7 overflow-hidden ${styles.marqueeMask}`}
          >
            <div className={`${styles.marqueeRow} rr-vrow`}>
              {[0, 1].map((n) => (
                <span
                  key={`v1-${n}`}
                  className={`${styles.outline} ${styles.display} ${styles.marqueeChunk} whitespace-nowrap text-[9vw] font-extrabold leading-none lg:text-[5.5vw]`}
                >
                  MOTION IS A MATERIAL —
                </span>
              ))}
            </div>
            <div className={`${styles.marqueeRow} rr-vrow`}>
              {[0, 1].map((n) => (
                <span
                  key={`v2-${n}`}
                  className={`${styles.display} ${styles.marqueeChunk} whitespace-nowrap text-[9vw] font-extrabold leading-none text-[#f4f1ea] lg:text-[5.5vw]`}
                >
                  LIGHT BENDS BEFORE IT SHINES —
                </span>
              ))}
            </div>
            <div className={`${styles.marqueeRow} rr-vrow`}>
              {[0, 1].map((n) => (
                <span
                  key={`v3-${n}`}
                  className={`${styles.outline} ${styles.display} ${styles.marqueeChunk} whitespace-nowrap text-[9vw] font-extrabold leading-none lg:text-[5.5vw]`}
                >
                  MASS IS MEANING —
                </span>
              ))}
            </div>
          </div>
          <footer className="flex items-end justify-between gap-4">
            <p className={`${styles.mono} max-w-[18ch] text-[9px] leading-relaxed tracking-[0.18em] text-[rgba(244,241,234,0.4)]`}>
              THIS WALL KNOWS HOW FAST YOU SCROLL
            </p>
            <span className={`${styles.outline} ${styles.display} text-5xl font-extrabold leading-none md:text-6xl`}>04</span>
          </footer>
        </article>

        {/* — 05 · orbit — */}
        <article className="rr-panel relative flex h-[72svh] w-[80vw] shrink-0 flex-col justify-between border border-white/10 bg-[#0a0a11] p-6 sm:w-[56vw] md:p-9 lg:w-[44vw]">
          <header className={`${styles.mono} flex justify-between text-[10px] uppercase tracking-[0.3em] text-[rgba(244,241,234,0.5)]`}>
            <span>Specimen 05/05</span>
            <span>Orbit</span>
          </header>
          <div className="relative my-5 grid flex-1 place-items-center">
            <svg
              viewBox="0 0 320 320"
              className="size-[min(80%,44svh)]"
              aria-hidden="true"
            >
              <g className="rr-orbit-ring">
                <path
                  id="rr-orbit-path"
                  d="M 160 42 A 118 118 0 0 0 160 278 A 118 118 0 0 0 160 42"
                  fill="none"
                  stroke="rgba(244,241,234,0.22)"
                  strokeWidth="1"
                  strokeDasharray="2 7"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="64"
                  fill="none"
                  stroke="rgba(244,241,234,0.15)"
                  strokeWidth="1"
                />
                <circle cx="160" cy="160" r="2" fill="rgba(244,241,234,0.5)" />
              </g>
              <circle className="rr-orbit-dot" r="6" fill={ORBIT_DOTS[0].color} />
              <circle className="rr-orbit-dot" r="6" fill={ORBIT_DOTS[1].color} />
              <circle className="rr-orbit-dot" r="6" fill={ORBIT_DOTS[2].color} />
            </svg>
            <p className={`${styles.mono} absolute bottom-1 left-1 text-[9px] tracking-[0.25em] text-[rgba(244,241,234,0.4)]`}>
              SYNC — 03 BODIES · STABLE
            </p>
          </div>
          <footer className="flex items-end justify-between gap-4">
            <p className={`${styles.mono} max-w-[18ch] text-[9px] leading-relaxed tracking-[0.18em] text-[rgba(244,241,234,0.4)]`}>
              THREE PERIODS, ONE QUIET CENTER
            </p>
            <span className={`${styles.outline} ${styles.display} text-5xl font-extrabold leading-none md:text-6xl`}>05</span>
          </footer>
        </article>

        {/* — endcap — */}
        <div className="flex h-[72svh] w-[60vw] shrink-0 flex-col items-center justify-center gap-5 sm:w-[36vw]">
          <p className={`${styles.display} text-center text-3xl font-extrabold leading-tight sm:text-4xl`}>
            END OF
            <span className="block text-[rgba(244,241,234,0.5)]">THE WALL</span>
          </p>
          <p className={`${styles.mono} text-[10px] uppercase tracking-[0.35em] text-[rgba(244,241,234,0.45)]`}>
            05/05 observed
          </p>
          <ArrowDown className="size-4 text-[rgba(244,241,234,0.5)]" aria-hidden="true" />
        </div>
      </div>

      <div className={styles.vignette} aria-hidden="true" />
    </div>
  );
}
