import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LetMeWatch - Smart video picks for your watch session";
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
          alignItems: "stretch",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 12% 9%, rgba(84,110,147,0.16), transparent 42%), radial-gradient(circle at 90% 90%, rgba(84,110,147,0.1), transparent 42%), linear-gradient(180deg, #edf1f6, #dde4ee)",
          fontFamily: "system-ui, sans-serif",
          color: "#19191b",
          padding: "44px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "58%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <BrandMark />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: "-1.5px" }}>
                LetMeWatch
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: "rgba(25,25,27,0.72)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                }}
              >
                Video picks that fit your time
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1px" }}>
              Stop scrolling.
              <br />
              Start watching.
            </div>
            <div
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                color: "rgba(25,25,27,0.72)",
                maxWidth: 620,
              }}
            >
              Tell us your time, your context, your language. Get watchable
              YouTube recommendations in seconds.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {["3 quick steps", "< 10 sec", "No account"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(15,15,16,0.14)",
                  background: "rgba(255,255,255,0.85)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "rgba(25,25,27,0.78)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            width: "36%",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            position: "relative",
            zIndex: 2,
            justifyContent: "center",
          }}
        >
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                borderRadius: 20,
                border: "1px solid rgba(15,15,16,0.14)",
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 10px 24px rgba(15,15,16,0.09)",
                padding: 10,
                transform: index === 2 ? "translateX(10px)" : index === 3 ? "translateX(24px)" : "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 112,
                  borderRadius: 14,
                  background:
                    index === 1
                      ? "linear-gradient(135deg, #1f2937, #111827)"
                      : index === 2
                      ? "linear-gradient(135deg, #334155, #0f172a)"
                      : "linear-gradient(135deg, #374151, #111827)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.92)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "7px solid transparent",
                      borderBottom: "7px solid transparent",
                      borderLeft: "11px solid #ff0033",
                      marginLeft: 3,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    padding: "3px 7px",
                    borderRadius: 7,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "white",
                    background: "rgba(0,0,0,0.6)",
                  }}
                >
                  {index === 1 ? "14:12" : index === 2 ? "27:31" : "33:08"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
