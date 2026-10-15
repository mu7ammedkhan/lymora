"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Grid children that reveal in sequence on every public page. */
const STAGGER_GROUPS = [
  ".cards-3",
  ".solution-grid",
  ".offer-grid",
  ".check-list",
  ".mini-card-grid",
  ".insights-grid",
  ".faq-list",
  ".capability-list",
  ".process-panel",
  ".stats",
  ".footer-grid",
];

const SPOTLIGHT = ".card, .solution-card, .mini-card, .article-card, .spot";

/* State lives in data attributes, never in className: React resets className
   whenever a client component re-renders, which would hide revealed content. */

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.route = pathname.split("/")[1] || "home";
    root.setAttribute("data-js", "");
    if (pathname === "/login" || pathname.startsWith("/app")) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: Array<() => void> = [];
    const fold = window.innerHeight * 0.92;

    /* Auto-tag shared components below the fold so every page gets scroll reveals. */
    document.querySelectorAll<HTMLElement>("main > section:not(:first-child)").forEach(section => {
      if (section.getBoundingClientRect().top < fold) return;
      section.querySelectorAll<HTMLElement>(".section-heading, .prose > h2, .cta-card, .answer-block").forEach(el => {
        if (!el.closest("[data-reveal]")) el.dataset.reveal = "up";
      });
      STAGGER_GROUPS.forEach(selector => {
        section.querySelectorAll<HTMLElement>(selector).forEach(group => {
          Array.from(group.children).forEach((child, index) => {
            const el = child as HTMLElement;
            if (el.dataset.reveal) return;
            el.dataset.reveal = "up";
            el.style.setProperty("--i", String(index % 8));
          });
        });
      });
    });
    document.querySelectorAll<HTMLElement>(SPOTLIGHT).forEach(el => el.setAttribute("data-spot", ""));

    /* Reveal on scroll */
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])"));
    const revealObserver = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-shown", "");
        revealObserver.unobserve(entry.target);
        const counters = entry.target.matches("[data-count]") ? [entry.target as HTMLElement] : Array.from(entry.target.querySelectorAll<HTMLElement>("[data-count]"));
        counters.forEach(counter => animateCount(counter, reduce));
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealTargets.forEach(el => revealObserver.observe(el));
    root.setAttribute("data-motion", "ready");
    cleanups.push(() => revealObserver.disconnect());

    /* Scroll-linked progress: --p runs 0 → 1 while an element crosses the viewport. */
    const scrollers = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll]"));
    if (scrollers.length && !reduce) {
      let frame = 0;
      const update = () => {
        frame = 0;
        const vh = window.innerHeight;
        scrollers.forEach(el => {
          const rect = el.getBoundingClientRect();
          const mode = el.dataset.scroll;
          let progress: number;
          if (mode === "pin") progress = -rect.top / Math.max(1, rect.height - vh);
          else if (mode === "exit") progress = -rect.top / Math.max(1, rect.height);
          else progress = (vh - rect.top) / (vh + rect.height);
          el.style.setProperty("--p", Math.min(1, Math.max(0, progress)).toFixed(4));
        });
      };
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(frame);
      });
    }

    /* Stacking cards: each card eases back as the next one slides over it. */
    const stack = Array.from(document.querySelectorAll<HTMLElement>(".stack-card"));
    if (stack.length > 1 && !reduce) {
      let frame = 0;
      const update = () => {
        frame = 0;
        stack.forEach((card, index) => {
          const next = stack[index + 1];
          if (!next) return;
          const rect = card.getBoundingClientRect();
          const cover = 1 - (next.getBoundingClientRect().top - rect.top) / rect.height;
          card.style.setProperty("--cover", Math.min(1, Math.max(0, cover)).toFixed(3));
        });
      };
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); });
    }

    /* Pointer effects: spotlight glow, magnetic buttons and tilt. */
    if (fine && !reduce) {
      let magnet: HTMLElement | null = null;
      let tilt: HTMLElement | null = null;

      const onMove = (event: PointerEvent) => {
        const target = event.target as Element | null;
        if (!target?.closest) return;

        const lit = target.closest<HTMLElement>("[data-spot], .button");
        if (lit) {
          const rect = lit.getBoundingClientRect();
          lit.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          lit.style.setProperty("--my", `${event.clientY - rect.top}px`);
        }

        const nextMagnet = target.closest<HTMLElement>(".button, [data-magnetic]");
        if (magnet && magnet !== nextMagnet) magnet.style.translate = "";
        magnet = nextMagnet;
        if (magnet) {
          const rect = magnet.getBoundingClientRect();
          const strength = Number(magnet.dataset.magnetic || 0.28);
          const x = (event.clientX - rect.left - rect.width / 2) * strength;
          const y = (event.clientY - rect.top - rect.height / 2) * strength * 1.2;
          magnet.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        }

        const nextTilt = target.closest<HTMLElement>("[data-tilt]");
        if (tilt && tilt !== nextTilt) resetTilt(tilt);
        tilt = nextTilt;
        if (tilt) {
          const rect = tilt.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          tilt.style.setProperty("--rx", `${(-py * 7).toFixed(2)}deg`);
          tilt.style.setProperty("--ry", `${(px * 9).toFixed(2)}deg`);
        }
      };
      const onLeave = () => {
        if (magnet) magnet.style.translate = "";
        if (tilt) resetTilt(tilt);
        magnet = null;
        tilt = null;
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      });
    }

    return () => cleanups.forEach(fn => fn());
  }, [pathname]);

  return null;
}

function resetTilt(el: HTMLElement) {
  el.style.removeProperty("--rx");
  el.style.removeProperty("--ry");
}

function animateCount(el: HTMLElement, reduce: boolean) {
  const end = Number(el.dataset.count);
  if (!Number.isFinite(end)) return;
  if (reduce) { el.textContent = String(end); return; }
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = String(Math.round(end * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
