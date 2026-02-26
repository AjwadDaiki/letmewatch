import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LetMeWatch - Find YouTube videos to watch while eating";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function BrandMark() {
  return (
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 28,
        background: "linear-gradient(145deg, #ff0033, #d9042e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 14px 28px rgba(217,4,46,0.35)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          border: "3px solid rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "9px solid transparent",
            borderBottom: "9px solid transparent",
            borderLeft: "15px solid white",
            marginLeft: 4,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          width: 8,
          height: 8,
          borderRadius: 999,
          background: "white",
          opacity: 0.9,
        }}
      />
    </div>
  );
}

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0c0a09",
          fontFamily: "system-ui, sans-serif",
          padding: "80px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Warm glow top */}
        <div style={{
          position: "absolute", top: -120, left: "50%",
          transform: "translateX(-50%)",
          width: 900, height: 400,
          background: "radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Logo badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 40,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "#ef4444",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: "13px solid white", marginLeft: 3 }} />
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>LetMeWatch</span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 72, fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 24 }}>
          Find the perfect video<br />
          <span style={{ color: "#ef4444" }}>to watch while eating.</span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.5)", fontWeight: 400, marginBottom: 52, lineHeight: 1.4 }}>
          Stop spending 10 minutes choosing. AI picks for you in seconds.
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 14 }}>
          {["AI-powered", "No account needed", "< 10 seconds"].map((item) => (
            <div key={item} style={{
              padding: "12px 22px", borderRadius: 999,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.75)",
              display: "flex",
            }}>{item}</div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: "absolute", bottom: 48, right: 80, fontSize: 20, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
          letmewatch.me
        </div>
      </div>
    ),
    { ...size }
  );
}
