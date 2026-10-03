import TeamMembers, { FACE_WALL_CSS } from "./DisplayCore";

const TEAM_IDS = ["tech", "management", "creative"] as const;

export default function CoreTeams() {
  return (
    <div className="mt-16 sm:mt-24 flex flex-col gap-5 sm:gap-6">
      <style>{FACE_WALL_CSS}</style>
      {TEAM_IDS.map((teamId) => (
        <TeamMembers key={teamId} teamId={teamId} />
      ))}
    </div>
  );
}
