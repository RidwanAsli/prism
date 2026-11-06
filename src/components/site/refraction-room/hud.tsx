"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./refraction.module.css";

const emptySubscribe = () => () => {};

/**
 * Laboratory HUD. Portaled to <body> so pinned stages, page overflow
 * clipping and stacking contexts can never interfere. It tracks the
 * room’s overall progress and reports the active figure.
 */
export function Hud() {
  // Server renders nothing; the client flips to true right after
  // hydration — no setState-in-effect, no cascading render.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pillFillRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pillLabelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      const section = document.getElementById("refraction");
      if (!section) return;

      gsap.registerPlugin(ScrollTrigger);

      /* Visibility — the HUD lives only while the room is on screen. */
      ScrollTrigger.create({
        trigger: section,
        start: "top 65%",
        end: "bottom 35%",
        onToggle: (self) => {
          gsap.to(rootRef.current, {
            autoAlpha: self.isActive ? 1 : 0,
            duration: 0.45,
            ease: "power2.out",
          });
        },
      });

      /* Overall progress of the study. */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          if (fillRef.current)
            fillRef.current.style.transform = `scaleY(${p})`;
          if (pillFillRef.current)
            pillFillRef.current.style.transform = `scaleX(${p})`;
        },
      });

      /* Active figure — probe which scene box (pin-spacer aware)
         contains the viewport midpoint. Live on every scroll, immune
         to pin rebuilds. */
      const scenes = gsap.utils.toArray<HTMLElement>(
        "#refraction [data-scene]",
      );

      const setScene = (label: string) => {
        const [index, name] = label.split(" · ");
        if (indexRef.current && indexRef.current.textContent !== index)
          indexRef.current.textContent = index;
        if (labelRef.current && labelRef.current.textContent !== name)
          labelRef.current.textContent = name;
        if (pillLabelRef.current && pillLabelRef.current.textContent !== label)
          pillLabelRef.current.textContent = label;
      };

      const probeScene = () => {
        const probe = window.innerHeight * 0.5;
        let current: string | null = null;
        for (const scene of scenes) {
          const box = scene.closest(".pin-spacer") ?? scene;
          const rect = box.getBoundingClientRect();
          if (rect.top <= probe && rect.bottom >= probe) {
            current = scene.dataset.scene ?? null;
            break;
          }
        }
        if (current) setScene(current);
      };

      window.addEventListener("scroll", probeScene, { passive: true });
      probeScene();

      return () => {
        window.removeEventListener("scroll", probeScene);
      };
    },
    { dependencies: [mounted] },
  );

  if (!mounted) return null;

  return createPortal(
    <div ref={rootRef} className={styles.hud} aria-hidden="true">
      {/* Desktop rail */}
      <div className={`${styles.hudRail} hidden md:flex`}>
        <span className={styles.hudVertical}>PRISM://REFRACTION</span>
        <div className={styles.hudTrack}>
          <div ref={fillRef} className={styles.hudFill} />
        </div>
        <span ref={indexRef} className={styles.hudIndex}>
          00
        </span>
        <span ref={labelRef} className={styles.hudVertical}>
          THRESHOLD
        </span>
      </div>

      {/* Mobile pill */}
      <div className={`${styles.hudPill} flex md:hidden`}>
        <span ref={pillLabelRef}>00 · THRESHOLD</span>
        <div className={styles.hudPillTrack}>
          <div ref={pillFillRef} className={styles.hudPillFill} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
