"use client";

import { useEffect, useState } from "react";

type SmoothWindow = Window & { lenis?: { scrollTo: (target: number) => void } | null };

/* Live local time in Dubai. Renders a placeholder on the server to avoid a hydration mismatch. */
export function DubaiClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 15000);
    return () => window.clearInterval(timer);
  }, []);
  return <time suppressHydrationWarning>{time}</time>;
}

export function BackToTop() {
  const toTop = () => {
    const lenis = (window as SmoothWindow).lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button type="button" className="footer-top" onClick={toTop}>
      Back to top <span aria-hidden="true">↑</span>
    </button>
  );
}
