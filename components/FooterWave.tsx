"use client";

import { useEffect, useRef } from "react";

/* An animated field of dots rolling like a data ocean, with a ripple that follows the cursor. */
export function FooterWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0, height = 0, frame = 0, running = false, t = 0;
    let mx = -9999, my = -9999, ease = 0;
    const COLS = 96, ROWS = 26;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const horizon = height * 0.08;
      for (let r = 0; r < ROWS; r++) {
        const depth = r / (ROWS - 1);            // 0 = far, 1 = near
        const persp = 0.35 + depth * 0.65;
        const rowY = horizon + Math.pow(depth, 1.6) * (height * 0.86);
        const spread = width * (0.55 + depth * 0.75);
        for (let c = 0; c < COLS; c++) {
          const u = c / (COLS - 1) - 0.5;
          const x = width / 2 + u * spread;
          let wave = (Math.sin(u * 7 + t * 0.8 + r * 0.32) * Math.cos(r * 0.24 - t * 0.55) * 26 + Math.sin(u * 3.2 - t * 0.45) * 12) * persp;
          const dx = x - mx, dy = rowY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) wave -= Math.cos((dist / 220) * Math.PI * 0.5) * 34 * ease * Math.sin(dist * 0.05 - t * 4);
          const y = rowY + wave;
          if (x < -10 || x > width + 10) continue;
          const size = 0.6 + persp * 1.5;
          const glow = Math.max(0, 1 - dist / 260) * ease;
          ctx.globalAlpha = Math.min(1, (0.12 + depth * 0.7) * (0.75 + (wave / (40 * persp)) * 0.25) + glow * 0.6);
          ctx.fillStyle = glow > 0.15 ? "#FFFFFF" : "#9DB8E0";
          ctx.beginPath();
          ctx.arc(x, y, size + glow * 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      t += 0.016;
      ease += ((mx > -9000 ? 1 : 0) - ease) * 0.06;
      draw();
      frame = requestAnimationFrame(loop);
    };
    const start = () => { if (!running && !reduce) { running = true; frame = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(frame); };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = event.clientX - rect.left;
      my = event.clientY - rect.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };

    resize();
    draw();
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0 });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="footer-wave" aria-hidden="true" />;
}
