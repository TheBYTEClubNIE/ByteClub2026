import TeamMembers, { FACE_WALL_CSS } from "./DisplayCore";
import { Holo } from "./effects";

const TEAM_IDS = ["tech", "management", "creative"] as const;

export default function CoreTeams() {
  return (
    <Holo className="mt-16 sm:mt-24 flex flex-col gap-12 sm:gap-14">
      <style>{FACE_WALL_CSS}</style>
      {TEAM_IDS.map((teamId) => (
        <TeamMembers key={teamId} teamId={teamId} />
      ))}
    </Holo>
  );
}
