"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { LymoraMark } from "@/components/Logo";

const depth = (value: number, delay: number) => ({ "--depth": value, "--d": `${delay}ms` }) as React.CSSProperties;

/* A composed cluster of glass AI interface cards beside the hero headline. Decorative only. */
export function HeroAI() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (event: PointerEvent) => {
      x = event.clientX / window.innerWidth - 0.5;
      y = event.clientY / window.innerHeight - 0.5;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--hx", x.toFixed(3));
        el.style.setProperty("--hy", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hero-ai" ref={ref} aria-hidden="true">
      <div className="ai-slot ai-slot-chat" data-reveal="pop" style={depth(14, 700)}>
        <div className="ai-float">
          <div className="ai-card ai-chat">
            <div className="ai-head"><span className="ai-avatar"><LymoraMark size={13} /></span><b>Lymora AI Operator</b><i className="ai-live" /></div>
            <p className="ai-bubble">Summarise this week’s client enquiries and flag anything urgent.</p>
            <div className="ai-reply">
              <span className="ai-typing"><i /><i /><i /></span>
              <span className="ai-lines"><i /><i /><i /></span>
            </div>
            <div className="ai-foot"><span>Draft ready</span><b>Awaiting human review</b></div>
          </div>
        </div>
      </div>

      <div className="ai-slot ai-slot-verify" data-reveal="pop" style={depth(26, 950)}>
        <div className="ai-float">
          <div className="ai-chip"><span className="ai-check">✓</span>Verified by a person</div>
        </div>
      </div>

      <div className="ai-slot ai-slot-metric" data-reveal="pop" style={depth(22, 850)}>
        <div className="ai-float">
          <div className="ai-card ai-metric">
            <span className="ai-label">Hours returned to the team</span>
            <div className="ai-metric-row"><strong>126h</strong><em>+38%</em></div>
            <div className="ai-bars">{[38, 52, 46, 64, 58, 76, 92].map((h, i) => <i key={i} style={{ "--h": `${h}%`, "--b": i } as React.CSSProperties} />)}</div>
          </div>
        </div>
      </div>

      <div className="ai-slot ai-slot-flow" data-reveal="pop" style={depth(32, 1050)}>
        <div className="ai-float">
          <div className="ai-card ai-flow">
            <span className="ai-photo"><Image src="/images/operator.webp" alt="" fill sizes="44px" /></span>
            <div>
              <b>CAIO™ certified operator</b>
              <div className="ai-nodes"><span>Intent</span><i /><span className="is-ai">AI</span><i /><span>Review</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
