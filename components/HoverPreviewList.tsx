"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { href: string; title: string; text: string; image: string };

/* A list of large links; on hover a photograph follows the cursor. */
export function HoverPreviewList({ items }: { items: Item[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    const card = preview.current;
    if (!el || !card || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, cx = 0, cy = 0, frame = 0;
    const loop = () => {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      const tilt = Math.max(-10, Math.min(10, (x - cx) * 0.12));
      card.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotate(${tilt}deg)`;
      frame = requestAnimationFrame(loop);
    };
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    };
    const onEnter = (event: PointerEvent) => { onMove(event); cx = x; cy = y; cancelAnimationFrame(frame); frame = requestAnimationFrame(loop); };
    const onLeave = () => { cancelAnimationFrame(frame); setActive(null); };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={`hover-list ${active !== null ? "has-active" : ""}`} ref={wrap}>
      {items.map((item, index) => (
        <Link
          href={item.href}
          key={item.href}
          className={`hover-list-row ${active === index ? "is-active" : ""}`}
          onPointerEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onBlur={() => setActive(null)}
          data-reveal="up"
          style={{ "--i": index } as React.CSSProperties}
        >
          <span className="hover-list-index">{String(index + 1).padStart(2, "0")}</span>
          <strong>{item.title}</strong>
          <p>{item.text}</p>
          <span className="hover-list-arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
      <div className="hover-preview" ref={preview} aria-hidden="true">
        {items.map((item, index) => (
          <div className={`hover-preview-frame ${active === index ? "is-active" : ""}`} key={item.href}>
            <Image src={item.image} alt="" fill sizes="340px" />
          </div>
        ))}
      </div>
    </div>
  );
}
