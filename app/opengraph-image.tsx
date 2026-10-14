import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lymora - Human Meets Intelligence";

const mark = (stroke: string, width: number) => (
  <>
    <path d="M16.82 39.41A17 17 0 0 1 16.82 8.59" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" />
    <path d="M31.18 8.59A17 17 0 0 1 31.18 39.41" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeDasharray={width === 6 ? "0.01 9.63" : "0.01 2.41"} />
    <path d="M24 1.8Q24.6 5.6 27.4 6.2Q24.6 6.8 24 10.6Q23.4 6.8 20.6 6.2Q23.4 5.6 24 1.8Z" fill={stroke} />
  </>
);

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#4F46E5", color: "#FFFFFF", fontFamily: "sans-serif", overflow: "hidden" }}>
        <svg width="620" height="620" viewBox="0 0 48 48" style={{ position: "absolute", right: -40, top: 5, opacity: 0.22 }}>{mark("#FFFFFF", 2)}</svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 78px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, letterSpacing: -1.5 }}>
            <svg width="52" height="52" viewBox="0 0 48 48">{mark("#FFFFFF", 6)}</svg>
            lymora
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, lineHeight: 0.98, letterSpacing: -4, maxWidth: 780 }}>Human meets intelligence.</div>
            <div style={{ marginTop: 28, fontSize: 28, color: "rgba(255,255,255,.78)" }}>AI-ready professionals, teams and workforces. Dubai, UAE.</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
