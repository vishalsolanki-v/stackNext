import { ImageResponse } from "next/og";

export const alt = "VishalDevFlow - A community for developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0f1117",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "80px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid #212734",
            borderRadius: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "64px 72px",
            width: "100%",
          }}
        >
          <div style={{ color: "#ff7000", fontSize: 34, fontWeight: 700 }}>
            VISHALDEVFLOW
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            Build knowledge.
            <br />
            Share answers.
          </div>
          <div style={{ color: "#dce3f1", fontSize: 30 }}>
            A community for developers to learn and grow.
          </div>
        </div>
      </div>
    ),
    size
  );
}
