"use client";

import React, { useState } from "react";

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
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.7v2.2h.1c.7-1.3 2.4-2.7 5-2.7 5.4 0 6.4 3.6 6.4 8.3V24h-5V16c0-1.9 0-4.4-2.7-4.4s-3.1 2.1-3.1 4.2V24h-5V8z" />
        </svg>
    );
}

function GithubIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.7.5.8 5.4.8 11.7c0 5 3.2 9.2 7.6 10.7.6.1.8-.3.8-.6v-2.2c-3.1.7-3.7-1.3-3.7-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7-.7 1.5-1 .1-.7.4-1.2.7-1.5-2.5-.3-5.2-1.2-5.2-5.5 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 .1.9-.3 1.8-.4 2.7-.4s1.8.1 2.7.4c2.1-.4 3-.1 3-.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.7 1.1 2.9 0 4.3-2.7 5.2-5.2 5.5.4.3.8 1 .8 2v3c0 .3.2.7.8.6 4.4-1.5 7.6-5.7 7.6-10.7C23.2 5.4 18.3.5 12 .5z" />
        </svg>
    );
}

function MemberCard({ member }: { member: Member }) {
    const [hovered, setHovered] = useState(false);

    const isValidUrl = (val: string) => val.startsWith("http");

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`relative w-[260px] h-[340px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                hovered ? "shadow-2xl -translate-y-2" : "shadow-md"
            }`}
        >
            <img
                src={member.image}
                alt={member.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-110" : ""}`}
            />

            {/* Bottom strip */}
            <div className={`absolute bottom-0 w-full px-4 py-3 backdrop-blur-md bg-white/40 transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}>
                <p className="text-black font-semibold">{member.name}</p>
            </div>

            {/* Hover overlay */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-xl bg-white/10 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                    <p className="font-bold text-black">{member.name}</p>
                    <p className="text-xs uppercase text-gray-600">{member.role}</p>
                </div>
                <div className="flex gap-4 text-gray-800">
                    {isValidUrl(member.insta) && (
                        <a href={member.insta} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                            <InstagramIcon />
                        </a>
                    )}
                    {isValidUrl(member.linkedin) && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                            <LinkedInIcon />
                        </a>
                    )}
                    {isValidUrl(member.github) && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                            <GithubIcon />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TeamMembers({ teamId }: { teamId: string }) {
    const members = teamData[teamId] ?? [];
    const label = teamLabels[teamId] ?? "Team";

    return (
        <section className="px-10 py-10">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">{label}</h3>
            <div className="flex flex-wrap justify-center gap-8">
                {members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                ))}
            </div>
        </section>
    );
}
