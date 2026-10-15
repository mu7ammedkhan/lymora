import Link from "next/link";

type MarkProps = { size?: number; className?: string };

/*
 * The Lymora mark: two arcs meeting around a spark, in one colour.
 * The continuous arc is the human; the dotted arc is intelligence;
 * the spark in the gap is where they meet.
 */
export function LymoraMark({ size = 40, className = "" }: MarkProps) {
  return (
    <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 48 48" className={`lymora-mark ${className}`}>
      <path d="M16.82 39.41A17 17 0 0 1 16.82 8.59" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M31.18 8.59A17 17 0 0 1 31.18 39.41" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="0.01 9.63" />
      <path className="mark-spark" d="M24 1.8Q24.6 5.6 27.4 6.2Q24.6 6.8 24 10.6Q23.4 6.8 20.6 6.2Q23.4 5.6 24 1.8Z" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className={`wordmark ${inverse ? "wordmark-inverse" : ""}`} aria-label="Lymora home">
      <LymoraMark size={30} />
      <span className="wordmark-text">lymora</span>
    </Link>
  );
}
