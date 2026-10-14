import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lymora - Human Meets Intelligence";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#08080D", color: "#F4F2EE", fontFamily: "sans-serif", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 900, height: 900, right: -260, bottom: -560, borderRadius: 9999, background: "radial-gradient(circle, rgba(122,92,255,.55), rgba(240,96,158,.25) 40%, transparent 68%)" }} />
        <svg width="560" height="560" viewBox="0 0 48 48" style={{ position: "absolute", right: 40, top: 40 }}>
          <defs>
            <linearGradient id="h" x1="18" y1="40" x2="18" y2="8" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FF6A3D" /><stop offset="1" stopColor="#FFB48F" /></linearGradient>
            <linearGradient id="i" x1="30" y1="8" x2="30" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5CC8FF" /><stop offset="1" stopColor="#7A5CFF" /></linearGradient>
          </defs>
          <path d="M16.82 39.41A17 17 0 0 1 16.82 8.59" fill="none" stroke="url(#h)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M31.18 8.59A17 17 0 0 1 31.18 39.41" fill="none" stroke="url(#i)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.01 2.41" />
          <path d="M24 3.2Q24.4 5.8 26.2 6.2Q24.4 6.6 24 9.2Q23.6 6.6 21.8 6.2Q23.6 5.8 24 3.2Z" fill="#fff" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 76px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700, letterSpacing: -1.5 }}>
            <svg width="52" height="52" viewBox="0 0 48 48">
              <path d="M16.82 39.41A17 17 0 0 1 16.82 8.59" fill="none" stroke="#FF8A5B" strokeWidth="6" strokeLinecap="round" />
              <path d="M31.18 8.59A17 17 0 0 1 31.18 39.41" fill="none" stroke="#7A5CFF" strokeWidth="6" strokeLinecap="round" strokeDasharray="0.01 9.63" />
              <path d="M24 1.8Q24.6 5.6 27.4 6.2Q24.6 6.8 24 10.6Q23.4 6.8 20.6 6.2Q23.4 5.6 24 1.8Z" fill="#fff" />
            </svg>
            lymora
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.95, letterSpacing: -4, maxWidth: 760 }}>Human meets intelligence.</div>
            <div style={{ marginTop: 28, fontSize: 28, color: "rgba(244,242,238,.68)" }}>AI-ready professionals, teams and workforces. Dubai, UAE.</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
