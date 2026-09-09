"use client";

import TeamMembers from "./DisplayCore";

const TEAM_IDS = ["tech", "management", "creative"] as const;

export default function CoreTeams() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {TEAM_IDS.map((teamId) => (
        <TeamMembers key={teamId} teamId={teamId} />
      ))}
    </div>
  );
}
