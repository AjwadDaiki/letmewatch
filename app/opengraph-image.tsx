import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LetMeWatch - Smart YouTube picks in seconds";
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
          justifyContent: "space-between",
          alignItems: "stretch",
          background:
            "radial-gradient(circle at 22% 0%, rgba(255,255,255,0.09), transparent 38%), linear-gradient(180deg, #15171b, #121418)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: "44px 46px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 0.6px, transparent 0.6px)",
            backgroundSize: "3px 3px",
            opacity: 0.16,
          }}
        />

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
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: "linear-gradient(145deg, #ff0033, #d20d31)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 24px rgba(255, 0, 51, 0.28)",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "16px solid white",
                  marginLeft: 3,
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-1.2px" }}>
                LetMeWatch
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.66)",
                  fontWeight: 700,
                }}
              >
                YouTube Match
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                fontSize: 58,
                fontWeight: 880,
                lineHeight: 1.06,
                letterSpacing: "-1.8px",
              }}
            >
              Stop scrolling.
              <br />
              Start watching.
            </div>
            <div
              style={{
                fontSize: 25,
                maxWidth: 620,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.66)",
              }}
            >
              3 quick steps: duration, context, language. Get directly watchable YouTube videos in seconds.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {["Duration", "Context", "Language"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "9px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.08)",
                  fontSize: 14,
                  fontWeight: 700,
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
            justifyContent: "center",
            gap: 12,
            position: "relative",
            zIndex: 2,
          }}
        >
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(30,32,36,0.94)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
                padding: 9,
                transform: idx === 2 ? "translateX(8px)" : idx === 3 ? "translateX(18px)" : "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 104,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background:
                    idx === 1
                      ? "linear-gradient(140deg, #2d3440, #1a202a)"
                      : idx === 2
                      ? "linear-gradient(140deg, #33445a, #1b2535)"
                      : "linear-gradient(140deg, #2f3f4f, #1a232f)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
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
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.62)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 7px",
                  }}
                >
                  {idx === 1 ? "14:12" : idx === 2 ? "27:31" : "33:08"}
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
