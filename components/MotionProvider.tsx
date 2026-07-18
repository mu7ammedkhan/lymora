"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const route = pathname.split("/")[1] || "home";
    document.documentElement.dataset.route = route;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section:nth-of-type(n+3)"));
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -10%", threshold: 0.08 }
    );
    sections.forEach(section => {
      section.classList.add("reveal-section");
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
