import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LetMeWatch - Find the perfect YouTube video for your meal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1A2E",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(108,99,255,0.18)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,101,132,0.15)",
            filter: "blur(60px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 90,
            height: 90,
            borderRadius: 24,
            background: "linear-gradient(135deg, #6C63FF, #FF6584)",
            marginBottom: 28,
            fontSize: 44,
          }}
        >
          🍽️
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          <span style={{ color: "white" }}>Let</span>
          <span
            style={{
              background: "linear-gradient(135deg, #6C63FF, #FF6584)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Me
          </span>
          <span style={{ color: "white" }}>Watch</span>
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#A0AEC0",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          Find the perfect YouTube video to watch while eating - in 10 seconds
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
          }}
        >
          {[
            { icon: "⚡", text: "< 10 sec" },
            { icon: "🎯", text: "AI-powered" },
            { icon: "🆓", text: "100% free" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#A0AEC0",
                fontSize: 18,
              }}
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
