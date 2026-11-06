"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { gsap } from "gsap";

export interface SpectrumParticlesHandle {
  /** Spawn a burst at a point given in SVG viewBox coordinates. */
  burst: (vx: number, vy: number) => void;
}

export interface ViewBoxState {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SpectrumParticlesProps {
  /** Ref flagged true while the chamber is pinned on screen. */
  activeRef: React.MutableRefObject<boolean>;
  /** Live viewBox so bursts land in the right spot at every breakpoint. */
  vbRef: React.MutableRefObject<ViewBoxState>;
}

const HUES = [
  "#22d3ee",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#fb923c",
  "#fbbf24",
];

interface Dust {
  kind: "dust";
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  speed: number;
  hue: string;
}

interface Spark {
  kind: "spark";
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: string;
}

type Particle = Dust | Spark;

/**
 * Canvas particle layer for the Light Chamber.
 * - Ambient star dust that slowly drifts and twinkles (always alive).
 * - Radial spectrum bursts spawned on demand (GSAP timeline `call`).
 * Driven by gsap.ticker so it stays perfectly in sync with the scene
 * and pauses for free when the tab is hidden.
 */
export const SpectrumParticles = forwardRef<
  SpectrumParticlesHandle,
  SpectrumParticlesProps
>(function SpectrumParticles({ activeRef, vbRef }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<Dust[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  useImperativeHandle(ref, () => ({
    burst(vx: number, vy: number) {
      const { w, h } = sizeRef.current;
      const vb = vbRef.current;
      if (!w || !h || !vb.w) return;
      const px = ((vx - vb.x) / vb.w) * w;
      const py = ((vy - vb.y) / vb.h) * h;

      const count = Math.round(Math.min(220, Math.max(120, w * 0.14)));
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Bias upward slightly — feels like a celebratory fountain.
        const speed = 50 + Math.random() * 240;
        const life = 0.7 + Math.random() * 0.9;
        sparksRef.current.push({
          kind: "spark",
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 40,
          size: 0.8 + Math.random() * 2.4,
          life,
          maxLife: life,
          hue: Math.random() < 0.22 ? "#ffffff" : HUES[i % HUES.length],
        });
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Seed ambient dust.
    const dustCount = 64;
    for (let i = 0; i < dustCount; i++) {
      dustRef.current.push({
        kind: "dust",
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.006,
        vy: (Math.random() - 0.5) * 0.003,
        size: 0.5 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.9,
        hue: Math.random() < 0.7 ? "#ffffff" : HUES[i % HUES.length],
      });
    }

    const tick = (_time: number, deltaMs: number) => {
      const { w, h } = sizeRef.current;
      if (!w || !h || !activeRef.current) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      const t = performance.now() / 1000;

      ctx.clearRect(0, 0, w, h);

      // Dust.
      ctx.globalCompositeOperation = "lighter";
      for (const d of dustRef.current) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.x < -0.02) d.x = 1.02;
        if (d.x > 1.02) d.x = -0.02;
        if (d.y < -0.02) d.y = 1.02;
        if (d.y > 1.02) d.y = -0.02;
        const tw = 0.08 + 0.16 * (0.5 + 0.5 * Math.sin(t * d.speed + d.phase));
        ctx.globalAlpha = tw;
        ctx.fillStyle = d.hue;
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparks.
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 150 * dt; // gravity
        s.vx *= 1 - 0.6 * dt; // drag
        s.vy *= 1 - 0.25 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const k = s.life / s.maxLife;
        ctx.globalAlpha = Math.min(1, k * 1.4);
        ctx.fillStyle = s.hue;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (0.5 + k * 0.7), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
    };
  }, [activeRef, vbRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
});
