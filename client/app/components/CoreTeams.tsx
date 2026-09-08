"use client";

import React, { useState } from "react";
import TeamMembers from "./DisplayCore";

const teams = [
  {
    id: "tech",
    name: "Tech Team",
    description: "Building, breaking, and shipping — the engineers behind every project and workshop the club runs.",
    image: "/just for reference/tech.webp",
  },
  {
    id: "management",
    name: "Management Team",
    description: "Keeping everything running smoothly — events, logistics, and the people who make it all happen.",
    image: "/just for reference/managment.webp",
  },
  {
    id: "creative",
    name: "Creative Team",
    description: "Design, branding, and content — the visual voice of the club across every platform.",
    image: "/just for reference/creative.webp",
  },
];

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function TeamCard({ team, index, onView }: { team: typeof teams[0]; index: number; onView: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="tbc-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(team.id)}
      style={{
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.35s ease",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        animation: `cardIn 0.6s ease ${index * 0.1}s both`,
      }}
    >
      <span className="tbc-card-corner tbc-card-corner--tl" />
      <span className="tbc-card-corner tbc-card-corner--br" />

      <div style={{ height: 170, overflow: "hidden", position: "relative" }}>
        <img
          src={team.image}
          alt={team.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.5s ease, filter 0.5s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            filter: hovered ? "grayscale(0.1) saturate(1.05)" : "grayscale(0.55) saturate(0.9)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 35%, var(--bg-elevated) 108%)",
            mixBlendMode: "normal",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, rgba(40,194,255,0.16), transparent 55%)",
          }}
        />
        <span
          className="tbc-index"
          style={{ position: "absolute", top: 10, right: 14, fontSize: "2.2rem", opacity: 0.9 }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div style={{ padding: "1.3rem 1.4rem" }}>
        <p className="tbc-heading" style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
          {team.name}
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.86rem", color: "var(--ink-muted)", lineHeight: 1.6, margin: "0 0 1.2rem" }}>
          {team.description}
        </p>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: hovered ? "var(--accent)" : "var(--ink-faint)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
        >
          View members <ArrowIcon />
        </span>
      </div>
    </div>
  );
}

export default function CoreTeams() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes cardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <section>
        {!selectedTeam && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto md:[&>*:nth-child(2)]:mt-10">
            {teams.map((team, i) => (
              <TeamCard key={team.id} team={team} index={i} onView={setSelectedTeam} />
            ))}
          </div>
        )}

        {selectedTeam && (
          <div className="mt-4">
            <button
              onClick={() => setSelectedTeam(null)}
              style={{ color: "var(--ink-muted)", fontFamily: "var(--font-body)" }}
              className="mb-8 flex items-center gap-2 text-sm hover:opacity-80 transition-opacity duration-200"
            >
              ← Back to teams
            </button>
            <TeamMembers teamId={selectedTeam} />
          </div>
        )}
      </section>
    </>
  );
}
