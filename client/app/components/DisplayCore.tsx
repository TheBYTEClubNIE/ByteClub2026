import Image from "next/image";
import { DOMAINS, LEADS, type Domain, type PhotoFrame, isProfileUrl, photoStyle, zoomedSizes } from "@/content/team";
import DomainArt from "./DomainArt";
import PullBadge from "./PullBadge";

interface Member {
    id: number;
    name: string;
    role: string;
    insta: string;
    linkedin: string;
    github: string;
    image: string;
    frame?: PhotoFrame;
}

const techMembers: Member[] = [
    { id: 1, name: "Diwakar Sharma Aditya", role: "Frontend Dev", insta: "https://www.instagram.com/", linkedin: "https://www.linkedin.com/in/diwakar-sharma15", github: "https://github.com/thewalker045", image: "/Core/Tech/diwakarsharma.jpg.jpeg", frame: { position: "50% 30%", origin: "50% 30%", zoom: 1.6 } },
    { id: 2, name: "Divyansh Kalia", role: "Backend Dev", insta: "https://www.instagram.com/divyansh18hq", linkedin: "https://www.linkedin.com/in/divyansh-kalia-50a52435a", github: "https://github.com/Divyanshcoder18", image: "/Core/Tech/divyanshkalia.jpg.jpeg", frame: { position: "43% 45%", origin: "43% 45%", zoom: 2 } },
    { id: 3, name: "Samarth R", role: "Backend Dev", insta: "https://www.instagram.com/samarth.r_gowda", linkedin: "https://www.linkedin.com/in/samarth-r-978162396", github: "https://github.com/samarth-r18", image: "/Core/Tech/SamarthR.jpg.jpeg", frame: { position: "50% 25%", origin: "50% 25%", zoom: 1.05 } },
    { id: 4, name: "Shreyas A S", role: "Backend Dev", insta: "https://www.instagram.com/shrey__as___", linkedin: "https://www.linkedin.com/in/shreyas-a-s-9009b6389", github: "https://github.com/shreyasaele2032", image: "/Core/Tech/shreyash.jpg.jpeg", frame: { position: "53% 36%", origin: "53% 36%", zoom: 1.4 } },
    { id: 5, name: "Adwik R", role: "Backend Dev", insta: "https://www.instagram.com/x0advik", linkedin: "https://www.linkedin.com/in/advik-n", github: "https://github.com/Advik-n", image: "/Core/Tech/advikr.jpg.jpeg", frame: { position: "41% 22%", origin: "41% 22%", zoom: 1.8 } },
    { id: 6, name: "Ayush Anand", role: "Backend Dev", insta: "https://www.instagram.com/surya_anand_001", linkedin: "https://www.linkedin.com/in/ayush-anand10521", github: "https://github.com/ayushanand001", image: "/Core/Tech/Ayush.jpg.jpeg", frame: { position: "57% 40%", origin: "57% 40%", zoom: 2 } },
];

const managementMembers: Member[] = [
    { id: 1, name: "Eaktha MG", role: "Event Manager", insta: "https://www.instagram.com/unity_emg", linkedin: "https://www.linkedin.com/in/eaktha-m-g-99770a332", github: "https://github.com/eaktha246", image: "/Core/Managment/eaktha.jpg.jpeg", frame: { position: "50% 27%", origin: "50% 27%", zoom: 1.7 } },
    { id: 2, name: "Chris Mariya", role: "Coordinator", insta: "https://www.instagram.com/twihard_afternator", linkedin: "https://www.linkedin.com/in/chris-mariya-3018a039b", github: "https://github.com/ChrisMariya-1412", image: "/Core/Managment/chrismariya.jpg.jpeg", frame: { position: "42% 58%", origin: "42% 58%", zoom: 1.8 } },
    { id: 3, name: "Haripriya", role: "Coordinator", insta: "https://www.instagram.com/hxri_priyx30", linkedin: "https://www.linkedin.com/in/hari-priya-r304018", github: "https://github.com/harip-riya", image: "/Core/Managment/haripriya.jpg.jpeg", frame: { position: "42% 20%", origin: "42% 20%", zoom: 1.5 } },
    { id: 4, name: "Mrityunjay Kumar", role: "Coordinator", insta: "https://www.instagram.com/_mrityunjay_kr", linkedin: "https://www.linkedin.com/in/mrityunjay-kumar-72aaa83ba", github: "github_id", image: "/Core/Managment/mritunjaya.jpg.jpeg", frame: { position: "49% 50%", origin: "49% 50%", zoom: 1.4 } },
    { id: 5, name: "Saaim Khan", role: "Coordinator", insta: "https://www.instagram.com/__saaim____", linkedin: "https://www.linkedin.com/in/saaim-khan-158636333", github: "https://github.com/saaimkhan2006", image: "/Core/Managment/saaimkhan.jpg.jpeg", frame: { position: "49% 35%", origin: "49% 35%", zoom: 1.7 } },
    { id: 6, name: "Siya K Shetty", role: "Coordinator", insta: "https://www.instagram.com/_siyakshettyyy_", linkedin: "https://www.linkedin.com/in/siya-k-shetty-4a654a385", github: "https://github.com/Siyakshetty", image: "/Core/Managment/siya.jpg.jpeg", frame: { position: "46% 44%", origin: "46% 44%", zoom: 2 } },
    { id: 7, name: "Tanish Sharma", role: "Coordinator", insta: "https://www.instagram.com/tanish.io", linkedin: "https://www.linkedin.com/in/tanish-sharma-5a6820316", github: "https://github.com/TanishSharma0203", image: "/Core/Managment/tanishsharma.jpg.jpeg", frame: { position: "47% 36%", origin: "47% 36%", zoom: 1.3 } },
    { id: 8, name: "Anwita Srikiran", role: "Coordinator", insta: "https://www.instagram.com/anwita_srikiran", linkedin: "https://www.linkedin.com/in/anwita-srikiran-b97318405", github: "https://github.com/2025csanwitasrikiran", image: "/Core/Managment/Anwita.jpeg", frame: { position: "43% 32%", origin: "43% 32%", zoom: 1.4 } },
    { id: 9, name: "Sanjana Shibin", role: "Coordinator", insta: "https://www.instagram.com/sanjana_.shh", linkedin: "https://www.linkedin.com/in/sanjana-shibin-49b578398", github: "https://github.com/sanjanashibin", image: "/Core/Managment/sanjana.jpeg", frame: { position: "38% 54%", origin: "38% 54%", zoom: 1.6 } },
    { id: 10, name: "Tanishq Dhawan", role: "Coordinator", insta: "https://www.instagram.com/okay.tanishq", linkedin: "https://www.linkedin.com/in/tanishq-dhawan", github: "https://github.com/CALL-ME-TATA", image: "/Core/Managment/tanishq.jpeg", frame: { position: "57% 25%", origin: "57% 25%", zoom: 1.3 } },
];

const creativeMembers: Member[] = [
    { id: 1, name: "Shreshth bhagel", role: "UI Designer", insta: "https://www.instagram.com/baghel.harsh1", linkedin: "https://www.linkedin.com/in/shreshthbaghel", github: "https://github.com/Shreshthbaghel", image: "/Core/Creativity/shresth.jpg.jpeg", frame: { position: "45% 25%", origin: "45% 25%", zoom: 1.8 } },
    { id: 2, name: "Chythra Shyamanandan", role: "Content Creator", insta: "https://www.instagram.com/tidesofcharlie._", linkedin: "https://www.linkedin.com/in/chythra-shyamnandan-780059312", github: "https://github.com/Chythrasn0407", image: "/Core/Creativity/chythra.jpg.jpeg", frame: { position: "66% 25%", origin: "66% 25%", zoom: 1.3 } },
    { id: 3, name: "Nakul R", role: "Content Creator", insta: "insta_id", linkedin: "linkedin_id", github: "github_id", image: "/Core/Creativity/Nakul.jpeg", frame: { position: "51% 27%", origin: "51% 27%", zoom: 1.8 } },
    { id: 5, name: "Renuka S", role: "Content Creator", insta: "https://www.instagram.com/shutter__bhug", linkedin: "https://www.linkedin.com/in/riddhi-renu-s", github: "github_id", image: "/Core/Creativity/renuka.jpg", frame: { position: "48% 40%", origin: "48% 40%", zoom: 1.8 } },
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

export function InstagramIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function LinkedInIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}

export function GithubIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
        </svg>
    );
}

// A club ID badge: clip on top, squad band, framed photo, name, role, socials.
function Badge({ member }: { member: Member }) {
    const links = [
        { href: member.insta, label: "Instagram", icon: <InstagramIcon /> },
        { href: member.linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
        { href: member.github, label: "GitHub", icon: <GithubIcon /> },
    ].filter((l) => isProfileUrl(l.href));

    return (
        <PullBadge>
            <span className="badge-clip" aria-hidden />
            <div className="badge-photo" data-holo-card>
                <Image
                    src={member.image}
                    alt=""
                    fill
                    sizes={zoomedSizes("(min-width: 1024px) 170px, (min-width: 640px) 22vw, 30vw", member.frame?.zoom)}
                    quality={90}
                    className="object-cover"
                    style={photoStyle(member.frame)}
                />
            </div>
            <p className="badge-name">{member.name}</p>
            <p className="badge-role">{member.role}</p>
            {links.length > 0 && (
                <div className="badge-links">
                    {links.map((l) => (
                        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on ${l.label}`}>
                            {l.icon}
                        </a>
                    ))}
                </div>
            )}
        </PullBadge>
    );
}

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
            <ul className="badge-grid">
                {members.map((member) => (
                    <Badge key={member.id} member={member} />
                ))}
            </ul>
        </section>
    );
}

export const FACE_WALL_CSS = `
.squad { position: relative; padding: 18px 14px 22px; border-radius: 20px; border: 1px solid var(--line);
  background: radial-gradient(70% 50% at 100% 0%, color-mix(in srgb, var(--squad) 13%, transparent), transparent 70%), var(--bg-elevated); }
/* only the artwork is clipped, so a pulled badge can swing past the panel edge */
.squad-art { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none; }
.squad-art::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--squad); }
.squad:has(.is-pulled) { z-index: 10; }
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

.badge-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px 10px; }
.badge-slot { position: relative; }
.badge-slot.is-pulled { z-index: 5; }
.badge-strap { position: absolute; z-index: 0; left: 50%; top: -4px; width: 12px; height: 0; transform-origin: top center; border-radius: 2px; background: linear-gradient(90deg, color-mix(in srgb, var(--squad) 70%, #000), var(--squad) 30%, var(--squad) 70%, color-mix(in srgb, var(--squad) 70%, #000)); box-shadow: 0 4px 10px rgba(0,0,0,0.5); pointer-events: none; }
.badge { position: relative; z-index: 1; cursor: grab; user-select: none; touch-action: pan-y; padding: 14px 7px 8px; border-radius: 14px; border: 1px solid var(--line); background: linear-gradient(180deg, #161b20, #0f1316); box-shadow: 0 12px 26px -16px rgba(0, 0, 0, 0.85); transform-origin: 50% -14px; }
.badge::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 4px; border-radius: 14px 14px 0 0; background: var(--squad); }
.badge-clip { position: absolute; z-index: 2; top: -7px; left: 50%; width: 30px; height: 12px; transform: translateX(-50%); border-radius: 4px; background: #3a4249; box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.35); }
.badge-clip::after { content: ""; position: absolute; left: 50%; top: 4px; width: 14px; height: 3px; transform: translateX(-50%); border-radius: 2px; background: #0a0b0d; }
.badge-photo { position: relative; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 9px; background: #07090b; }
.badge-name { margin-top: 9px; font-size: 13px; font-weight: 600; line-height: 1.25; text-align: center; color: var(--ink); }
.badge-role { margin-top: 2px; font-size: 12px; text-align: center; color: var(--squad); }
.badge-links { display: flex; justify-content: center; margin-top: 4px; }
.badge-links a { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 6px; color: var(--ink-muted); transition: color 0.2s ease, background-color 0.2s ease; }
.badge-links a:hover { color: var(--squad); background: rgba(255, 255, 255, 0.05); }
.badge:active { cursor: grabbing; }
.badge-slot.is-pulled .badge { box-shadow: 0 24px 40px -16px rgba(0, 0, 0, 0.9); }

@media (min-width: 640px) { .badge-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px 14px; } }
@media (min-width: 768px) {
  .squad { padding: 24px; }
  .squad-head { grid-template-columns: minmax(0, 1fr) auto; align-items: end; }
}
@media (min-width: 1024px) {
  .badge-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 26px 16px; }
  .badge-name { font-size: 14px; }
}
`;
