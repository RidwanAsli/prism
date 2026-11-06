"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import styles from "./refraction.module.css";

const emptySubscribe = () => () => {};

/**
 * The room’s cursor: a precise dot, a lagging difference-blend ring,
 * and contextual labels (ATTRACT / DROP / DRAG) pulled from
 * [data-cursor] targets. Only precise pointers get it; everyone else
 * keeps their native cursor.
 */
export function RefractionCursor() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (
        !rootRef.current ||
        !dotRef.current ||
        !ringRef.current ||
        !labelRef.current
      )
        return;
      if (!window.matchMedia("(pointer: fine)").matches) return;

      const section = document.getElementById("refraction");
      if (!section) return;

      gsap.set([dotRef.current, ringRef.current], { xPercent: 0, yPercent: 0 });

      const dotX = gsap.quickTo(dotRef.current, "x", {
        duration: 0.06,
        ease: "power2.out",
      });
      const dotY = gsap.quickTo(dotRef.current, "y", {
        duration: 0.06,
        ease: "power2.out",
      });
      const ringX = gsap.quickTo(ringRef.current, "x", {
        duration: 0.42,
        ease: "power3.out",
      });
      const ringY = gsap.quickTo(ringRef.current, "y", {
        duration: 0.42,
        ease: "power3.out",
      });

      let inside = false;
      let currentLabel = "";

      const applyLabel = (label: string) => {
        if (label === currentLabel) return;
        currentLabel = label;
        if (label) {
          labelRef.current.textContent = label;
          gsap.to(labelRef.current, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.28,
            ease: "power2.out",
          });
          gsap.to(ringRef.current, {
            scale: 1.85,
            duration: 0.4,
            ease: "power3.out",
          });
        } else {
          gsap.to(labelRef.current, {
            autoAlpha: 0,
            scale: 0.6,
            duration: 0.22,
            ease: "power2.in",
          });
          gsap.to(ringRef.current, {
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
          });
        }
      };

      const show = () => {
        if (!inside) {
          inside = true;
          gsap.to(rootRef.current, {
            autoAlpha: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      const hide = () => {
        if (!inside) return;
        inside = false;
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const onMove = (e: PointerEvent) => {
        const target = e.target as Element | null;
        const inRoom = !!target?.closest?.("#refraction");
        if (!inRoom) {
          hide();
          return;
        }
        show();
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);

        const labelled = target.closest?.("[data-cursor]");
        applyLabel(labelled?.getAttribute("data-cursor") ?? "");
      };

      const onLeaveDocument = () => hide();

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeaveDocument);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeaveDocument);
      };
    },
    { dependencies: [mounted] },
  );

  if (!mounted) return null;

  return createPortal(
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <div ref={dotRef} className={styles.cursorDot} />
      <div ref={ringRef} className={styles.cursorRing}>
        <span ref={labelRef} className={styles.cursorLabel} />
      </div>
    </div>,
    document.body,
  );
}
