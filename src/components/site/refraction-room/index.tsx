"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./refraction.module.css";
import { Hud } from "./hud";
import { RefractionCursor } from "./cursor";
import { Threshold } from "./scenes/threshold";
import { Dispersion } from "./scenes/dispersion";
import { Aberration } from "./scenes/aberration";
import { Specimens } from "./scenes/specimens";
import { Reflection } from "./scenes/reflection";

const emptySubscribe = () => () => {};

/**
 * Film grain, portaled to <body> and gated to the room’s visibility,
 * so it never washes the marketing sections above or below.
 */
function Grain() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const grainRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!grainRef.current || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const section = document.getElementById("refraction");
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onToggle: (self) => {
          gsap.to(grainRef.current, {
            autoAlpha: self.isActive ? 1 : 0,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });
    },
    { dependencies: [mounted] },
  );

  if (!mounted) return null;

  return createPortal(
    <div ref={rootRef} aria-hidden="true">
      <div ref={grainRef} className={styles.grain} />
    </div>,
    document.body,
  );
}

/**
 * THE REFRACTION ROOM
 * A five-figure scroll study in light and motion — pinned, scrubbed
 * and hand-choreographed with GSAP. Placed after the collection as
 * the gallery’s closing argument: craft, isolated and observable.
 */
export function RefractionRoom() {
  const rootRef = useRef<HTMLElement>(null);

  /* Metrics change when the room’s fonts finish loading. */
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      let cancelled = false;
      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
      return () => {
        cancelled = true;
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      id="refraction"
      ref={rootRef}
      aria-label="The Refraction Room — a five-figure interactive scroll study of light and motion"
      className={`${styles.root} relative scroll-mt-24`}
    >
      {/* chamber doors */}
      <div className={styles.strip} aria-hidden="true">
        <span>Controlled light environment</span>
        <span>ISO 100 — Develop slowly</span>
        <span>Do not shake the easel</span>
      </div>

      <Threshold />
      <Dispersion />
      <Aberration />
      <Specimens />
      <Reflection />

      <div className={styles.strip} aria-hidden="true">
        <span>Exit darkroom</span>
        <span>All figures observed</span>
        <span>Go build your own light</span>
      </div>

      {/* room chrome (portaled) */}
      <Hud />
      <Grain />
      <RefractionCursor />
    </section>
  );
}
