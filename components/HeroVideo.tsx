"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  src: string;
  mobileSrc?: string;
  poster: string;
  className?: string;
};

/* Muted background film: plays only while on screen, and never for reduced-motion visitors. */
export function HeroVideo({ src, mobileSrc, poster, className = "" }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const play = () => { if (!reduce.matches) video.play().catch(() => {}); };
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : video.pause()), { threshold: 0.01 });
    observer.observe(video);
    const onReady = () => video.setAttribute("data-playing", "");
    video.addEventListener("playing", onReady);
    return () => {
      observer.disconnect();
      video.removeEventListener("playing", onReady);
    };
  }, []);

  return (
    <video ref={ref} className={`hero-video ${className}`} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1}>
      {mobileSrc && <source src={mobileSrc} type="video/mp4" media="(max-width: 760px)" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
