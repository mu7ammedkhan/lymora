"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

/* Site-wide smooth scrolling plus a thin reading-progress line under the header. */
export function SmoothScroll() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -96 }, allowNestedScroll: true });
    (window as Window & { lenis?: Lenis | null }).lenis = lenis;

    // Pause smoothing while the mobile menu locks the page
    const lock = new MutationObserver(() => {
      if (!lenis) return;
      if (root.hasAttribute("data-nav-open")) lenis.stop();
      else lenis.start();
    });
    lock.observe(root, { attributes: true, attributeFilter: ["data-nav-open"] });

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      lock.disconnect();
      lenis?.destroy();
      (window as Window & { lenis?: Lenis | null }).lenis = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="scroll-progress" ref={bar} aria-hidden="true" />;
}
