"use client";

import { useEffect, useRef } from "react";

const DARK = ".dark-section, .home-process, .site-footer, .hero-stage, .cta-card, .stack-card-3, .standard-panel, .caio-competencies, .caio-offer, .caio-standard, .caio-final, .bento-quote, .bento-flow";
const VIEW = ".stack-media, .journal-visual, .bento-tile, .industry-row, .article-cover, .process-photo, .page-hero-frame";
const LINK = "a, button, summary, label, [role='button'], select";
const TEXT = "input, textarea, [contenteditable='true']";

/* Custom cursor: a dot and a trailing ring that grows over links and shows "View" over imagery. */
export function Cursor() {
  const dot = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    root.setAttribute("data-cursor", "");

    let x = -100, y = -100, rx = -100, ry = -100, frame = 0, shown = false;
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!shown) { shown = true; rx = x; ry = y; root.setAttribute("data-cursor", "on"); }
      const target = event.target as Element | null;
      if (!target?.closest) return;
      const state = target.closest(TEXT) ? "text" : target.closest(VIEW) ? "view" : target.closest(LINK) ? "link" : "";
      root.dataset.cursorState = state;
      root.dataset.cursorTone = target.closest(DARK) ? "light" : "";
    };
    const onLeave = () => { shown = false; root.setAttribute("data-cursor", ""); };
    const onDown = () => root.setAttribute("data-cursor-down", "");
    const onUp = () => root.removeAttribute("data-cursor-down");

    frame = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeAttribute("data-cursor");
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor-ring" ref={ring}><b>View</b></span>
      <span className="cursor-dot" ref={dot} />
    </div>
  );
}
