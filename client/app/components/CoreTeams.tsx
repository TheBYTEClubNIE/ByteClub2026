"use client";

import React, { useState } from "react";
import TeamMembers from "./DisplayCore";

const teams = [
  {
    id: "tech",
    name: "Tech Team",
    description: "Building, breaking, and shipping. The engineers behind every digital product the club creates.",
    image: "/just for reference/tech.webp",
    bg: "linear-gradient(135deg, #1a1a1a, #3a3a3a)",
  },
  {
    id: "management",
    name: "Management Team",
    description: "Keeping everything running smoothly — events, logistics, and the people who make it all happen.",
    image: "/just for reference/managment.webp",
    bg: "linear-gradient(135deg, #2c2c2c, #555)",
  },
  {
    id: "creative",
    name: "Creative Team",
    description: "Design, branding, and content. The visual voice of the club across every platform.",
    image: "/just for reference/creative.webp",
    bg: "linear-gradient(135deg, #111, #444)",
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        border: "0.5px solid rgba(0,0,0,0.07)",
        background: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease, background 0.2s",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.1)" : "none",
        animation: `cardIn 0.6s ease ${index * 0.1}s both`,
      }}
    >
      {/* Image panel */}
      <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
        <img
          src={team.image}
          alt={team.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
      </div>

      {/* Body */}
      <div style={{ padding: "1.2rem 1.4rem", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
        <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111", margin: "0 0 0.3rem" }}>
          {team.name}
        </p>
        <p style={{ fontSize: "0.77rem", color: "#000", lineHeight: 1.6, fontWeight: 300, margin: "0 0 1rem" }}>
          {team.description}
        </p>
        <button
          onClick={() => onView(team.id)}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.color = "#555"; }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            color: "#111",
            border: "0.5px solid #ccc",
            borderRadius: 100,
            padding: "5px 12px",
            cursor: "pointer",
            background: "transparent",
            transition: "all 0.2s",
            letterSpacing: "0.04em",
          }}
        >
          View members <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

export default function CoreTeams() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="px-8 py-12">

        {/* Header */}

        {/* Team cards — hide when a team is selected */}
        {!selectedTeam && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {teams.map((team, i) => (
              <TeamCard key={team.id} team={team} index={i} onView={setSelectedTeam} />
            ))}
          </div>
        )}

        {/* Members view */}
        {selectedTeam && (
          <div className="mt-4">
            <button
              onClick={() => setSelectedTeam(null)}
              className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors duration-200"
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