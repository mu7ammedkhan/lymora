"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Item = { href: string; title: string; text: string; image: string };

/* Industries: a list on the left, the matching photograph on the right. */
export function IndustryShowcase({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="industry-showcase">
      <div className="industry-list">
        {items.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            className={`industry-row ${active === index ? "is-active" : ""}`}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            <span className="industry-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="industry-copy">
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </span>
            <span className="industry-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      <div className="industry-visual" aria-hidden="true">
        {items.map((item, index) => (
          <div className={`industry-frame ${active === index ? "is-active" : ""}`} key={item.href}>
            <Image src={item.image} alt="" fill sizes="(max-width: 980px) 100vw, 45vw" />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
