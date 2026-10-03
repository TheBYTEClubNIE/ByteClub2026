import Image from "next/image";
import { DOMAINS, LEADS, type Domain, photoStyle, zoomedSizes } from "@/content/team";
import DomainArt from "./DomainArt";
import LanyardWall, { type WallMember as Member } from "./LanyardWall";

const techMembers: Member[] = [
    { id: 1, name: "Diwakar Sharma Aditya", role: "Frontend Dev", insta: "https://www.instagram.com/", linkedin: "https://www.linkedin.com/in/diwakar-sharma15", github: "https://github.com/thewalker045", image: "/Core/Tech/diwakarsharma.jpg.jpeg", frame: { position: "50% 30%", origin: "50% 30%", zoom: 1.6 } },
    { id: 2, name: "Divyansh Kalia", role: "Backend Dev", insta: "https://www.instagram.com/divyansh18hq", linkedin: "https://www.linkedin.com/in/divyansh-kalia-50a52435a", github: "https://github.com/Divyanshcoder18", image: "/Core/Tech/divyanshkalia.jpg.jpeg", frame: { position: "43% 45%", origin: "43% 45%", zoom: 2 } },
    { id: 3, name: "Samarth R", role: "Backend Dev", insta: "https://www.instagram.com/samarth.r_gowda", linkedin: "https://www.linkedin.com/in/samarth-r-978162396", github: "https://github.com/samarth-r18", image: "/Core/Tech/SamarthR.jpg.jpeg", frame: { position: "50% 25%", origin: "50% 25%", zoom: 1.05 } },
    { id: 5, name: "Adwik R", role: "Backend Dev", insta: "https://www.instagram.com/x0advik", linkedin: "https://www.linkedin.com/in/advik-n", github: "https://github.com/Advik-n", image: "/Core/Tech/advikr.jpg.jpeg", frame: { position: "41% 22%", origin: "41% 22%", zoom: 1.8 } },
    { id: 6, name: "Ayush Anand", role: "Backend Dev", insta: "https://www.instagram.com/surya_anand_001", linkedin: "https://www.linkedin.com/in/ayush-anand10521", github: "https://github.com/ayushanand001", image: "/Core/Tech/Ayush.jpg.jpeg", frame: { position: "57% 40%", origin: "57% 40%", zoom: 2 } },
    { id: 7, name: "Shaswat Singh", role: "Core Member", insta: "https://www.instagram.com/hereshashwat2807", linkedin: "https://www.linkedin.com/in/shaswat-singh-6b18b1375", github: "https://github.com/ShaswatNIE", image: "/Core/Tech/shaswat.jpg", frame: { position: "50% 3%", origin: "0% 40%", zoom: 1.5 } },
];

const managementMembers: Member[] = [
    { id: 1, name: "Eaktha MG", role: "Event Manager", insta: "https://www.instagram.com/unity_emg", linkedin: "https://www.linkedin.com/in/eaktha-m-g-99770a332", github: "https://github.com/eaktha246", image: "/Core/Managment/eaktha.jpg.jpeg", frame: { position: "50% 27%", origin: "50% 27%", zoom: 1.7 } },
    { id: 2, name: "Chris Mariya", role: "Coordinator", insta: "https://www.instagram.com/twihard_afternator", linkedin: "https://www.linkedin.com/in/chris-mariya-3018a039b", github: "https://github.com/ChrisMariya-1412", image: "/Core/Managment/chrismariya.jpg.jpeg", frame: { position: "42% 58%", origin: "42% 58%", zoom: 1.8 } },
    { id: 3, name: "Haripriya", role: "Coordinator", insta: "https://www.instagram.com/hxri_priyx30", linkedin: "https://www.linkedin.com/in/hari-priya-r304018", github: "https://github.com/harip-riya", image: "/Core/Managment/haripriya.jpg.jpeg", frame: { position: "42% 20%", origin: "42% 20%", zoom: 1.5 } },
    { id: 4, name: "Mrityunjay Kumar", role: "Coordinator", insta: "https://www.instagram.com/_mrityunjay_kr", linkedin: "https://www.linkedin.com/in/mrityunjay-kumar-72aaa83ba", github: "github_id", image: "/Core/Managment/mritunjaya.jpg.jpeg", frame: { position: "49% 50%", origin: "49% 50%", zoom: 1.4 } },
    { id: 5, name: "Saaim Khan", role: "Coordinator", insta: "https://www.instagram.com/__saaim____", linkedin: "https://www.linkedin.com/in/saaim-khan-158636333", github: "https://github.com/saaimkhan2006", image: "/Core/Managment/saaim.jpg", frame: { position: "50% 0%", origin: "54% 11%", zoom: 2.2 } },
    { id: 6, name: "Siya K Shetty", role: "Coordinator", insta: "https://www.instagram.com/_siyakshettyyy_", linkedin: "https://www.linkedin.com/in/siya-k-shetty-4a654a385", github: "https://github.com/Siyakshetty", image: "/Core/Managment/siya.jpg.jpeg", frame: { position: "46% 44%", origin: "46% 44%", zoom: 2 } },
    { id: 7, name: "Tanish Sharma", role: "Coordinator", insta: "https://www.instagram.com/tanish.io", linkedin: "https://www.linkedin.com/in/tanish-sharma-5a6820316", github: "https://github.com/TanishSharma0203", image: "/Core/Managment/tanish.jpg", frame: { position: "50% 43%", origin: "47% 48%", zoom: 1.15 } },
    { id: 8, name: "Anwita Srikiran", role: "Coordinator", insta: "https://www.instagram.com/anwita_srikiran", linkedin: "https://www.linkedin.com/in/anwita-srikiran-b97318405", github: "https://github.com/2025csanwitasrikiran", image: "/Core/Managment/Anwita.jpeg", frame: { position: "43% 32%", origin: "43% 32%", zoom: 1.4 } },
    { id: 9, name: "Sanjana Shibin", role: "Coordinator", insta: "https://www.instagram.com/sanjana_.shh", linkedin: "https://www.linkedin.com/in/sanjana-shibin-49b578398", github: "https://github.com/sanjanashibin", image: "/Core/Managment/sanjana.jpeg", frame: { position: "38% 54%", origin: "38% 54%", zoom: 1.6 } },
];

const creativeMembers: Member[] = [
    { id: 1, name: "Shreshth bhagel", role: "UI Designer", insta: "https://www.instagram.com/baghel.harsh1", linkedin: "https://www.linkedin.com/in/shreshthbaghel", github: "https://github.com/Shreshthbaghel", image: "/Core/Creativity/shresth.jpg.jpeg", frame: { position: "45% 25%", origin: "45% 25%", zoom: 1.8 } },
    { id: 2, name: "Chythra Shyamanandan", role: "Content Creator", insta: "https://www.instagram.com/tidesofcharlie._", linkedin: "https://www.linkedin.com/in/chythra-shyamnandan-780059312", github: "https://github.com/Chythrasn0407", image: "/Core/Creativity/chythra.jpg.jpeg", frame: { position: "66% 25%", origin: "66% 25%", zoom: 1.3 } },
    { id: 3, name: "Nakul R", role: "Content Creator", insta: "insta_id", linkedin: "linkedin_id", github: "github_id", image: "/Core/Creativity/Nakul.jpeg", frame: { position: "51% 27%", origin: "51% 27%", zoom: 1.8 } },
    { id: 6, name: "Rahul Panchal", role: "Core Member", insta: "https://www.instagram.com/rahulpanchal.404", linkedin: "https://www.linkedin.com/in/rahul-panchal-6a543b319", github: "https://github.com/RahulPanchal-404", image: "/Core/Creativity/rahul.jpg", frame: { position: "50% 21%", origin: "50% 50%", zoom: 1.2 } },
];

const teamData: Record<string, Member[]> = {
    tech: techMembers,
    management: managementMembers,
    creative: creativeMembers,
};

const teamLabels: Record<string, string> = {
    tech: "Tech squad",
    management: "Management squad",
    creative: "Creative squad",
};
const domainColor = (id: string) => DOMAINS.find((d) => d.id === id)?.color ?? "var(--accent)";

export default function TeamMembers({ teamId }: { teamId: string }) {
    const members = teamData[teamId] ?? [];
    if (members.length === 0) return null;
    const leads = LEADS.filter((l) => l.squad === teamId);
    // "Backend Dev ×5 · Frontend Dev ×1": the squad's make-up at a glance
    const mix = Object.entries(
        members.reduce<Record<string, number>>((acc, m) => ({ ...acc, [m.role]: (acc[m.role] ?? 0) + 1 }), {})
    ).sort((a, b) => b[1] - a[1]);

    return (
        <section className="squad" style={{ ["--squad" as string]: domainColor(teamId) }} aria-labelledby={`squad-${teamId}`}>
            <span className="squad-art" aria-hidden>
                <DomainArt domain={teamId as Domain} />
            </span>
            <header className="squad-head">
                <div>
                    <h3 id={`squad-${teamId}`} className="team-label">
                        <span className="team-dot" aria-hidden />
                        {teamLabels[teamId] ?? "Team"}
                        <span className="team-count">{members.length} members</span>
                    </h3>
                    <p className="squad-mix">
                        {mix.map(([role, n]) => (
                            <span key={role}>
                                {role} <b>×{n}</b>
                            </span>
                        ))}
                    </p>
                </div>
                {leads.length > 0 && (
                    <div className="squad-leads">
                        <span className="squad-avatars" aria-hidden>
                            {leads.map((l) => (
                                <span key={l.id} className="squad-avatar">
                                    <Image src={l.image} alt="" fill sizes={zoomedSizes("40px", l.frame?.zoom)} className="object-cover" style={photoStyle(l.frame)} />
                                </span>
                            ))}
                        </span>
                        <span>
                            Led by <b>{leads.map((l) => l.name).join(" & ")}</b>
                        </span>
                    </div>
                )}
            </header>
            <LanyardWall members={members} color={domainColor(teamId)} label={teamLabels[teamId] ?? "Team"} />
        </section>
    );
}

export const FACE_WALL_CSS = `
.squad { position: relative; padding: 18px 14px 22px; border-radius: 20px; border: 1px solid var(--line);
  background: radial-gradient(70% 50% at 100% 0%, color-mix(in srgb, var(--squad) 13%, transparent), transparent 70%), var(--bg-elevated); }
/* only the artwork is clipped, so a pulled badge can swing past the panel edge */
.squad-art { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none; }
.squad-art::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--squad); }
.squad .lead-art { position: absolute; z-index: 0; top: -12px; right: -12px; width: 260px; height: auto; color: var(--squad); opacity: 0.2; pointer-events: none;
  -webkit-mask-image: linear-gradient(225deg, #000 30%, transparent 75%); mask-image: linear-gradient(225deg, #000 30%, transparent 75%); }
.squad > :not(.squad-art) { position: relative; z-index: 1; }

.squad-head { display: grid; gap: 14px; margin-bottom: 24px; }
.team-label { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 1.25rem; letter-spacing: -0.01em; color: var(--ink); }
.team-dot { width: 10px; height: 10px; border-radius: 3px; background: var(--squad); box-shadow: 0 0 12px var(--squad); }
.team-count { font-family: var(--font-body); font-weight: 500; font-size: 14px; color: var(--ink-muted); }
.squad-mix { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.squad-mix span { padding: 3px 10px; border-radius: 999px; border: 1px solid var(--line-strong); background: rgba(7, 9, 11, 0.4); font-size: 12.5px; color: var(--ink-muted); }
.squad-mix b { font-weight: 600; color: var(--squad); }
.squad-leads { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--ink-muted); }
.squad-leads b { font-weight: 600; color: var(--ink); }
.squad-avatars { display: flex; flex-shrink: 0; }
.squad-avatar { position: relative; width: 38px; height: 38px; overflow: hidden; border-radius: 50%; border: 2px solid var(--squad); background: #07090b; }
.squad-avatar + .squad-avatar { margin-left: -10px; }

/* ID cards on lanyards: the 3D scene hangs them from --rope above each card */
.lanyard-wall { --rope: 46px; position: relative; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
.lanyard-canvas { position: absolute; z-index: 0; left: -28px; top: -20px; width: calc(100% + 56px); height: calc(100% + 76px); pointer-events: none; }
.badge-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px 12px; }
.slot { position: relative; padding-top: var(--rope); }
.slot::before { content: ""; position: absolute; left: 50%; top: 0; width: 7px; height: calc(var(--rope) + 4px); transform: translateX(-50%); border-radius: 2px; background: var(--squad); opacity: 0.85; }
.badge { position: relative; aspect-ratio: 21 / 32; display: flex; flex-direction: column; align-items: center; padding: 11% 9.5% 0; overflow: hidden; border-radius: 8% / 5.3%; border: 1px solid var(--line); background: linear-gradient(180deg, #192028, #0d1114); }
.badge::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 7.2%; background: var(--squad); }
.badge-photo { position: relative; width: 100%; aspect-ratio: 340 / 320; overflow: hidden; border-radius: 7%; background: #07090b; }
.badge-initials { position: absolute; inset: 0; display: grid; place-items: center; font-family: var(--font-display); font-weight: 700; font-size: clamp(1.4rem, 6vw, 2.2rem); color: var(--squad); }
.badge-name { margin-top: 7%; font-size: 13px; font-weight: 600; line-height: 1.15; text-align: center; color: var(--ink); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.badge-role { margin-top: 3px; font-size: 11.5px; text-align: center; color: var(--squad); }
.lanyard-wall.is-3d .badge, .lanyard-wall.is-3d .slot::before { opacity: 0; }
.lanyard-wall.is-3d .badge { pointer-events: none; }
.lanyard-wall img { -webkit-user-drag: none; }
.badge-links { display: flex; justify-content: center; margin-top: 6px; }
.badge-links a { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 6px; color: var(--ink-muted); transition: color 0.2s ease, background-color 0.2s ease; }
.badge-links a:hover { color: var(--squad); background: rgba(255, 255, 255, 0.05); }

@media (min-width: 640px) { .badge-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px 18px; } }
@media (min-width: 768px) {
  .squad { padding: 24px; }
  .squad-head { grid-template-columns: minmax(0, 1fr) auto; align-items: end; }
}
@media (min-width: 1024px) {
  .lanyard-wall { --rope: 56px; }
  .badge-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px 22px; }
}
`;
