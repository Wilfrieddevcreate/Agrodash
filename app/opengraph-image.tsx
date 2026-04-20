import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AgroDash — Premium agribusiness management dashboard";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(circle at 20% 20%, #8fd1a3 0%, transparent 50%), radial-gradient(circle at 80% 80%, #2f9d60 0%, transparent 55%), linear-gradient(135deg, #0f2b1b 0%, #0c3a24 50%, #0f2b1b 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #55c27a, #1f9d55 55%, #0f6b37)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <svg
              width={40}
              height={40}
              viewBox="0 0 32 32"
              fill="white"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 27V16" strokeWidth="2.2" fill="none" />
              <path d="M16 16C16 16 16 10.5 19.5 7.5C22 5.3 25 5.3 26 6.5C27 7.8 26.5 11 24 13.5C20.8 16.7 16 16 16 16Z" />
              <path
                d="M16 19C16 19 16 14 13 11.5C11 10 8.5 10.3 7.8 11.3C7.1 12.4 7.5 14.8 9.7 16.6C12.6 19 16 19 16 19Z"
                fillOpacity="0.78"
              />
              <path d="M10.5 27H21.5" strokeWidth="2" fill="none" strokeOpacity="0.55" />
            </svg>
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.02em" }}>
            AgroDash
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              maxWidth: 960,
            }}
          >
            Premium agribusiness dashboard
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 820,
            }}
          >
            Manage crops, orders, invoices and logistics across every farm from one workspace.
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            {["Next.js 16", "React 19", "Tailwind 4", "TypeScript"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "10px 18px",
                  fontSize: 20,
                  fontWeight: 600,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
