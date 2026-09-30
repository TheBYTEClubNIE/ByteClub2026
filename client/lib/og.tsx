import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

// Shared link-preview card: logo, one headline, one supporting line.
export async function ogCard({ label, title, sub }: { label: string; title: string; sub: string }) {
  const logo = await readFile(path.join(process.cwd(), "public", "Logo", "logo-transparent.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0a0b0d",
          color: "#f3f5f7",
          borderBottom: "12px solid #28c2ff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={84} height={84} alt="" />
          <span style={{ fontSize: 30, fontWeight: 700 }}>The Byte Club</span>
          <span style={{ fontSize: 30, color: "#28c2ff", marginLeft: "auto" }}>{label}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: title.length > 48 ? 64 : 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            {title}
          </div>
          <div style={{ fontSize: 32, color: "#9aa2ab", lineHeight: 1.35 }}>{sub}</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
