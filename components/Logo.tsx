import Link from "next/link";

type MarkProps = { size?: number; className?: string };

export function LymoraMark({ size = 42, className = "" }: MarkProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      <path d="M45 5C20 11 7 28 7 50s13 39 38 45C31 80 26 65 26 50S31 20 45 5Z" fill="#8457FF" />
      <path d="M55 5c25 6 38 23 38 45S80 89 55 95c14-15 19-30 19-45S69 20 55 5Z" fill="#4054F7" />
    </svg>
  );
}

export function Wordmark({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className={`wordmark ${inverse ? "wordmark-inverse" : ""}`} aria-label="Lymora home">
      <span>Lym</span><LymoraMark size={compact ? 24 : 29} /><span>ra</span>
    </Link>
  );
}
