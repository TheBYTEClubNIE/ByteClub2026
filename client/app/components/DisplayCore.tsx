"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface Member {
    id: number;
    name: string;
    role: string;
    insta: string;
    linkedin: string;
    github: string;
    image: string;
}

const techMembers: Member[] = [
    { id: 1, name: "Diwakar Sharma Aditya", role: "Frontend Dev", insta: "https://www.instagram.com/", linkedin: "https://www.linkedin.com/in/diwakar-sharma15", github: "https://github.com/thewalker045", image: "/Core/Tech/diwakarsharma.jpg.jpeg" },
    { id: 2, name: "Divyansh Kalia", role: "Backend Dev", insta: "https://www.instagram.com/divyansh18hq", linkedin: "https://www.linkedin.com/in/divyansh-kalia-50a52435a", github: "https://github.com/Divyanshcoder18", image: "/Core/Tech/divyanshkalia.jpg.jpeg" },
    { id: 3, name: "Samarth R", role: "Backend Dev", insta: "https://www.instagram.com/samarth.r_gowda", linkedin: "https://www.linkedin.com/in/samarth-r-978162396", github: "https://github.com/samarth-r18", image: "/Core/Tech/SamarthR.jpg.jpeg" },
    { id: 4, name: "Shreyas A S", role: "Backend Dev", insta: "https://www.instagram.com/shrey__as___", linkedin: "https://www.linkedin.com/in/shreyas-a-s-9009b6389", github: "https://github.com/shreyasaele2032", image: "/Core/Tech/shreyash.jpg.jpeg" },
    { id: 5, name: "Adwik R", role: "Backend Dev", insta: "https://www.instagram.com/x0advik", linkedin: "https://www.linkedin.com/in/advik-n", github: "https://github.com/Advik-n", image: "/Core/Tech/advikr.jpg.jpeg" },
    { id: 6, name: "Ayush Anand", role: "Backend Dev", insta: "https://www.instagram.com/surya_anand_001", linkedin: "https://www.linkedin.com/in/ayush-anand10521", github: "https://github.com/ayushanand001", image: "/Core/Tech/Ayush.jpg.jpeg" },
];

const managementMembers: Member[] = [
    { id: 1, name: "Eaktha MG", role: "Event Manager", insta: "https://www.instagram.com/unity_emg", linkedin: "https://www.linkedin.com/in/eaktha-m-g-99770a332", github: "https://github.com/eaktha246", image: "/Core/Managment/eaktha.jpg.jpeg" },
    { id: 2, name: "Chris Mariya", role: "Coordinator", insta: "https://www.instagram.com/twihard_afternator", linkedin: "https://www.linkedin.com/in/chris-mariya-3018a039b", github: "https://github.com/ChrisMariya-1412", image: "/Core/Managment/chrismariya.jpg.jpeg" },
    { id: 3, name: "Haripriya", role: "Coordinator", insta: "https://www.instagram.com/hxri_priyx30", linkedin: "https://www.linkedin.com/in/hari-priya-r304018", github: "https://github.com/harip-riya", image: "/Core/Managment/haripriya.jpg.jpeg" },
    { id: 4, name: "Mrityunjay Kumar", role: "Coordinator", insta: "https://www.instagram.com/_mrityunjay_kr", linkedin: "https://www.linkedin.com/in/mrityunjay-kumar-72aaa83ba", github: "github_id", image: "/Core/Managment/mritunjaya.jpg.jpeg" },
    { id: 5, name: "Saaim Khan", role: "Coordinator", insta: "https://www.instagram.com/__saaim____", linkedin: "https://www.linkedin.com/in/saaim-khan-158636333", github: "https://github.com/saaimkhan2006", image: "/Core/Managment/saaimkhan.jpg.jpeg" },
    { id: 6, name: "Siya K Shetty", role: "Coordinator", insta: "https://www.instagram.com/_siyakshettyyy_", linkedin: "https://www.linkedin.com/in/siya-k-shetty-4a654a385", github: "https://github.com/Siyakshetty", image: "/Core/Managment/siya.jpg.jpeg" },
    { id: 7, name: "Tanish Sharma", role: "Coordinator", insta: "https://www.instagram.com/tanish.io", linkedin: "https://www.linkedin.com/in/tanish-sharma-5a6820316", github: "https://github.com/TanishSharma0203", image: "/Core/Managment/tanishsharma.jpg.jpeg" },
    { id: 8, name: "Anwita Srikiran", role: "Coordinator", insta: "https://www.instagram.com/anwita_srikiran", linkedin: "https://www.linkedin.com/in/anwita-srikiran-b97318405", github: "https://github.com/2025csanwitasrikiran", image: "/Core/Managment/Anwita.jpeg" },
    { id: 9, name: "Sanjana Shibin", role: "Coordinator", insta: "https://www.instagram.com/sanjana_.shh", linkedin: "https://www.linkedin.com/in/sanjana-shibin-49b578398", github: "https://github.com/sanjanashibin", image: "/Core/Managment/sanjana.jpeg" },
    { id: 10, name: "Tanishq Dhawan", role: "Coordinator", insta: "https://www.instagram.com/okay.tanishq", linkedin: "https://www.linkedin.com/in/tanishq-dhawan", github: "https://github.com/CALL-ME-TATA", image: "/Core/Managment/tanishq.jpeg" },
];

const creativeMembers: Member[] = [
    { id: 1, name: "Shreshth bhagel", role: "UI Designer", insta: "https://www.instagram.com/baghel.harsh1", linkedin: "https://www.linkedin.com/in/shreshthbaghel", github: "https://github.com/Shreshthbaghel", image: "/Core/Creativity/shresth.jpg.jpeg" },
    { id: 2, name: "Chythra Shyamanandan", role: "Content Creator", insta: "https://www.instagram.com/tidesofcharlie._", linkedin: "https://www.linkedin.com/in/chythra-shyamnandan-780059312", github: "https://github.com/Chythrasn0407", image: "/Core/Creativity/chythra.jpg.jpeg" },
    { id: 3, name: "Nakul R", role: "Content Creator", insta: "insta_id", linkedin: "linkedin_id", github: "github_id", image: "/Core/Creativity/Nakul.jpeg" },
    { id: 5, name: "Renuka S", role: "Content Creator", insta: "https://www.instagram.com/shutter__bhug", linkedin: "https://www.linkedin.com/in/riddhi-renu-s", github: "github_id", image: "/Core/Creativity/renuka.jpg" },
];

const teamData: Record<string, Member[]> = {
    tech: techMembers,
    management: managementMembers,
    creative: creativeMembers,
};

const teamLabels: Record<string, string> = {
    tech: "Tech Team",
    management: "Management Team",
    creative: "Creative Team",
};

function InstagramIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}

function GithubIcon() {
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

const ACCENT_TONES = ["#3066be", "#60afff", "#28c2ff", "#2af5ff"];
const isValidUrl = (val: string) => val.startsWith("http");

function MemberCard({ member, index, cardWidth }: { member: Member; index: number; cardWidth: number }) {
    return (
        <div
            className="tbc-card shrink-0 relative overflow-hidden"
            style={{ width: cardWidth, height: cardWidth * 1.3, scrollSnapAlign: "start" }}
        >
            <span className="tbc-card-corner tbc-card-corner--tl" />
            <span className="tbc-card-corner tbc-card-corner--br" />

            <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    // Baseline zoom so object-fit: cover crops past any
                    // edge artifacts baked into a couple of source photos.
                    transform: "scale(1.06)",
                    filter: "grayscale(0.5) brightness(0.9)",
                }}
            />

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `linear-gradient(180deg, transparent 45%, ${ACCENT_TONES[index % ACCENT_TONES.length]}22 78%, rgba(10,11,13,0.94) 100%)`,
                }}
            />

            <span className="tbc-index absolute top-3 right-3.5" style={{ fontSize: "1.6rem" }}>
                {String(index + 1).padStart(2, "0")}
            </span>

            <div className="absolute left-0 right-0 bottom-0 p-4">
                <p
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        color: "var(--ink)",
                        margin: 0,
                    }}
                >
                    {member.name}
                </p>

                <div className="flex gap-3.5 mt-2.5" style={{ color: "var(--ink-muted)" }}>
                    {isValidUrl(member.insta) && (
                        <a
                            href={member.insta}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on Instagram`}
                            style={{ color: "inherit" }}
                            className="hover:text-[var(--accent)] transition-colors"
                        >
                            <InstagramIcon />
                        </a>
                    )}
                    {isValidUrl(member.linkedin) && (
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on LinkedIn`}
                            style={{ color: "inherit" }}
                            className="hover:text-[var(--accent)] transition-colors"
                        >
                            <LinkedInIcon />
                        </a>
                    )}
                    {isValidUrl(member.github) && (
                        <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on GitHub`}
                            style={{ color: "inherit" }}
                            className="hover:text-[var(--accent)] transition-colors"
                        >
                            <GithubIcon />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Phones (the large majority of this site's traffic) get a plain, native
 * horizontally-scrollable row: swipe to browse, no pinning, no vertical-
 * centering math, no scroll-jacking. That whole class of bug (overflow,
 * mis-centering, sticky-timing edge cases) simply can't happen here,
 * which matters more on mobile than the fancier desktop effect below.
 */
function MobileMemberRow({ members, label }: { members: Member[]; label: string }) {
    if (members.length === 0) return null;
    return (
        <section className="px-4">
            <div className="text-center mb-6">
                <span className="tbc-eyebrow" style={{ marginBottom: 8 }}>Meet the team</span>
                <h3 className="tbc-heading" style={{ fontSize: "clamp(1.6rem, 7vw, 2.2rem)", fontWeight: 700 }}>
                    {label}
                </h3>
            </div>
            <div
                className="flex overflow-x-auto pb-3 -mx-4 px-4"
                style={{ gap: 14, scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
            >
                {members.map((member, index) => (
                    <MemberCard key={member.id} member={member} index={index} cardWidth={168} />
                ))}
            </div>
        </section>
    );
}

/**
 * Scroll-jacked horizontal gallery (matching motion.dev's react/scroll-
 * horizontal example): the container is tall, its inner track pins via
 * `sticky` for the duration, and page-scroll progress across that tall
 * container drives a horizontal `x` transform on the card row instead of
 * the usual vertical reveal. The sticky window itself is only as wide as
 * one card and centered (`overflow: visible`), so neighboring cards peek
 * in from the sides as they slide through — same framing as the reference.
 * Desktop only (see MobileMemberRow above for phones).
 */
function ScrollGallery({ members, label }: { members: Member[]; label: string }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [cardWidth, setCardWidth] = useState(260);
    const gap = 24;

    useEffect(() => {
        const handleResize = () => setCardWidth(window.innerWidth <= 640 ? 210 : 260);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const totalDistance = Math.max(0, (members.length - 1) * (cardWidth + gap));
    const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

    // Scroll distance scales with member count so a 10-person team doesn't
    // feel rushed and a 4-person team doesn't drag — same per-card pacing
    // regardless of how many people are in the gallery.
    const containerHeightVh = Math.max(180, members.length * 55 + 60);

    if (members.length === 0) return null;

    return (
        <section className="px-4 sm:px-10">
            <div ref={containerRef} className="relative" style={{ height: `${containerHeightVh}vh` }}>
                <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center">
                    <div className="text-center mb-6 sm:mb-8">
                        <span className="tbc-eyebrow" style={{ marginBottom: 8 }}>Meet the team</span>
                        <h3 className="tbc-heading" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 700 }}>
                            {label}
                        </h3>
                    </div>

                    <div
                        className="mx-auto flex items-center"
                        style={{ width: cardWidth, overflow: "visible" }}
                    >
                    <motion.div className="flex" style={{ x, gap }}>
                        {members.map((member, index) => (
                            <MemberCard key={member.id} member={member} index={index} cardWidth={cardWidth} />
                        ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function TeamMembers({ teamId }: { teamId: string }) {
    const members = teamData[teamId] ?? [];
    const label = teamLabels[teamId] ?? "Team";

    // Mobile gets the plain swipeable row (no sticky/scroll-jacking — see
    // MobileMemberRow above); desktop keeps the pinned scroll gallery.
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile === null) return null;
    return isMobile ? (
        <MobileMemberRow members={members} label={label} />
    ) : (
        <ScrollGallery members={members} label={label} />
    );
}
