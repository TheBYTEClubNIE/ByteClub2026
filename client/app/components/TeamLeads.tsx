"use client";

import React, { useState } from "react";

interface Lead {
  id: number;
  name: string;
  role: string;
  insta: string;
  linkedin: string;
  github: string;
  image: string;
}

const leads: Lead[] = [
  { id: 1, name: "Ritesh Kumar", role: "Club Lead", insta: "https://www.instagram.com/riteshkrkarn", linkedin: "https://www.linkedin.com/in/riteshkrkarn", github: "https://github.com/riteshkrkarn", image: "/Leads/ritesh president.jpeg" },
  { id: 2, name: "Gulshan Kumar", role: "Tech Lead", insta: "https://www.instagram.com/jhagk_", linkedin: "https://www.linkedin.com/in/gulshankumar0", github: "https://github.com/GulshanJha00", image: "/Leads/gulshankumar-techlead.jpeg" },
  { id: 3, name: "Mayank Rai", role: "Management Lead", insta: "https://www.instagram.com/may_nk_0333", linkedin: "https://www.linkedin.com/in/mayank-rai-423419305", github: "https://github.com/raimac12345", image: "/Leads/Mayank-managmentlead.jpeg" },
  { id: 4, name: "Sashwat Sharma", role: "Creativity Lead", insta: "https://www.instagram.com/luminal786", linkedin: "https://www.linkedin.com/in/shashwat-sharma-universal", github: "https://github.com/Universal786", image: "/Leads/shashwat-creativitylead.jpeg" },
  { id: 5, name: "Sambhav Roy", role: "Design Lead", insta: "insta_id", linkedin: "linkedin_id", github: "github_id", image: "/Leads/Sambhav.jpeg" },
  { id: 6, name: "Vishnu M", role: "Sponsorship Lead", insta: "https://www.instagram.com/_vishnum___", linkedin: "https://www.linkedin.com/in/vishnu-m-88a722308", github: "https://github.com/MVishnu-dot", image: "/Leads/vishnum-sponshership lead.jpeg" },
];

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
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.7v2.2h.1c.7-1.3 2.4-2.7 5-2.7 5.4 0 6.4 3.6 6.4 8.3V24h-5V16c0-1.9 0-4.4-2.7-4.4s-3.1 2.1-3.1 4.2V24h-5V8z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.7.5.8 5.4.8 11.7c0 5 3.2 9.2 7.6 10.7.6.1.8-.3.8-.6v-2.2c-3.1.7-3.7-1.3-3.7-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7-.7 1.5-1 .1-.7.4-1.2.7-1.5-2.5-.3-5.2-1.2-5.2-5.5 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 .1.9-.3 1.8-.4 2.7-.4s1.8.1 2.7.4c2.1-.4 3-.1 3-.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.7 1.1 2.9 0 4.3-2.7 5.2-5.2 5.5.4.3.8 1 .8 2v3c0 .3.2.7.8.6 4.4-1.5 7.6-5.7 7.6-10.7C23.2 5.4 18.3.5 12 .5z"/>
    </svg>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative w-[260px] h-[340px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
        hovered ? "shadow-2xl -translate-y-2" : "shadow-md"
      }`}
    >
      <img
        src={lead.image}
        alt={lead.name}
        className={`w-full h-full object-cover transition-transform duration-500 ${
          hovered ? "scale-110" : ""
        }`}
      />

      {/* Bottom strip */}
      <div className={`absolute bottom-0 w-full px-4 py-3 backdrop-blur-md bg-white/20 transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}>
        <p className="text-white font-semibold">{lead.name}</p>
        <p className="text-white/80 text-sm">{lead.role}</p>
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-xl bg-white/20 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>

        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
          <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
        </div>

        <div className="text-center">
          <p className="font-bold text-gray-900">{lead.name}</p>
          <p className="text-xs uppercase text-gray-500">{lead.role}</p>
        </div>

        {/* Socials — use URLs directly, no wrapping */}
        <div className="flex gap-4">
          <a href={lead.insta} target="_blank" rel="noreferrer" className="text-gray-800 hover:text-pink-500 transition-colors">
            <InstagramIcon />
          </a>
          <a href={lead.linkedin} target="_blank" rel="noreferrer" className="text-gray-800 hover:text-blue-600 transition-colors">
            <LinkedInIcon />
          </a>
          <a href={lead.github} target="_blank" rel="noreferrer" className="text-gray-800 hover:text-gray-600 transition-colors">
            <GithubIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TeamLeads() {
  return (
    <section className="px-10 py-10">
      <div className="flex flex-wrap justify-center gap-8">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </section>
  );
}