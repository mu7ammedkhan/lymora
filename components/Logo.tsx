import Link from "next/link";
import { useId } from "react";

type MarkProps = { size?: number; className?: string; animated?: boolean };

/*
 * The Lymora mark: two arcs meeting around a spark.
 * The warm, continuous arc is the human; the cool, dotted arc is intelligence.
 * The spark in the gap is where they meet.
 */
export function LymoraMark({ size = 40, className = "", animated = false }: MarkProps) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`lymora-mark ${animated ? "lymora-mark-animated" : ""} ${className}`}
    >
      <defs>
        <linearGradient id={`h-${id}`} x1="18" y1="40" x2="18" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF6A3D" />
          <stop offset="1" stopColor="#FFB48F" />
        </linearGradient>
        <linearGradient id={`i-${id}`} x1="30" y1="8" x2="30" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5CC8FF" />
          <stop offset="1" stopColor="#7A5CFF" />
        </linearGradient>
      </defs>
      <path className="mark-human" d="M16.82 39.41A17 17 0 0 1 16.82 8.59" fill="none" stroke={`url(#h-${id})`} strokeWidth="6" strokeLinecap="round" />
      <path className="mark-intel" d="M31.18 8.59A17 17 0 0 1 31.18 39.41" fill="none" stroke={`url(#i-${id})`} strokeWidth="6" strokeLinecap="round" strokeDasharray="0.01 9.63" />
      <path className="mark-spark" d="M24 1.8Q24.6 5.6 27.4 6.2Q24.6 6.8 24 10.6Q23.4 6.8 20.6 6.2Q23.4 5.6 24 1.8Z" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className={`wordmark ${inverse ? "wordmark-inverse" : ""} ${compact ? "wordmark-compact" : ""}`} aria-label="Lymora home">
      <LymoraMark size={compact ? 28 : 34} />
      <span className="wordmark-text">lymora</span>
    </Link>
  );
}
