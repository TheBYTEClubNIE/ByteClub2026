"use client";

import React, { useRef, useState, useEffect } from "react";
import ThreeDImagePageflip, {
  PageFlipLeaf,
  ThreeDImagePageflipHandle,
} from "@/components/lightswind/3d-image-pageflip";

/* ───────────────── Leads Data ─────────────────
   Note: pageSide / leafIndex / pageNumber were dropped from this type —
   the new layout computes leaf positions itself (see buildBookPages below),
   since every lead now always spans two adjacent leaves: a photo face and
   a description face. If another file also imports `Lead` and relies on
   those three fields, keep them there and just ignore them here.
*/

export interface Lead {
  id: number;
  name: string;
  role: string;
  domain: string;
  badge: string;
  description: string;
  skills: string[];
  insta: string;
  linkedin: string;
  github: string;
  image: string;
}

export const leads: Lead[] = [
  {
    id: 1,
    name: "Ritesh Kumar",
    role: "Club Lead",
    domain: "Executive & Strategy",
    badge: "Club Lead",
    image: "/Leads/ritesh president.jpeg",
    description:
      "Sets the overarching vision and roadmap for Byte Club, driving cross-functional alignment across technical initiatives, creative campaigns, and community hackathons.",
    skills: ["Leadership", "Community", "Strategy"],
    insta: "https://www.instagram.com/riteshkrkarn",
    linkedin: "https://www.linkedin.com/in/riteshkrkarn",
    github: "https://github.com/riteshkrkarn",
  },
  {
    id: 2,
    name: "Gulshan Kumar",
    role: "Tech Lead",
    domain: "Engineering & Architecture",
    badge: "Tech Lead",
    image: "/Leads/gulshankumar-techlead.jpeg",
    description:
      "Architects the technical ecosystem and infrastructure for club platforms. Oversees full-stack open-source projects, conducts workshops, and mentors developers.",
    skills: ["Full-Stack", "Architecture", "Open Source"],
    insta: "https://www.instagram.com/jhagk_",
    linkedin: "https://www.linkedin.com/in/gulshankumar0",
    github: "https://github.com/GulshanJha00",
  },
  {
    id: 3,
    name: "Mayank Rai",
    role: "Management Lead",
    domain: "Operations & Logistics",
    badge: "Management Lead",
    image: "/Leads/Mayank-managmentlead.jpeg",
    description:
      "Orchestrates end-to-end event operations, resource allocation, and logistics. Ensures flagship hackathons and club projects execute seamlessly on schedule.",
    skills: ["Operations", "Logistics", "Planning"],
    insta: "https://www.instagram.com/may_nk_0333",
    linkedin: "https://www.linkedin.com/in/mayank-rai-423419305",
    github: "https://github.com/raimac12345",
  },
  {
    id: 4,
    name: "Sashwat Sharma",
    role: "Creativity Lead",
    domain: "Media & Brand Identity",
    badge: "Creativity Lead",
    image: "/Leads/shashwat-creativitylead.jpeg",
    description:
      "Directs creative strategy, multimedia storytelling, and brand identity across digital channels. Crafts high-impact visuals and design narratives.",
    skills: ["Creative", "Motion Design", "Branding"],
    insta: "https://www.instagram.com/luminal786",
    linkedin: "https://www.linkedin.com/in/shashwat-sharma-universal",
    github: "https://github.com/Universal786",
  },
  {
    id: 5,
    name: "Sambhav Roy",
    role: "Design Lead",
    domain: "UI/UX & Product Design",
    badge: "Design Lead",
    image: "/Leads/Sambhav.jpeg",
    description:
      "Spearheads UI/UX design systems, user research, and interactive prototypes. Transforms complex technical workflows into intuitive, visually stunning interfaces.",
    skills: ["UI/UX", "Figma", "Design Systems"],
    insta: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  {
    id: 6,
    name: "Vishnu M",
    role: "Sponsorship Lead",
    domain: "Partnerships & Outreach",
    badge: "Sponsorship Lead",
    image: "/Leads/vishnum-sponshership lead.jpeg",
    description:
      "Builds and manages key corporate partnerships, sponsorships, and industry outreach. Secures funding, merchandise, and mentorship resources.",
    skills: ["Partnerships", "Outreach", "Negotiation"],
    insta: "https://www.instagram.com/_vishnum___",
    linkedin: "https://www.linkedin.com/in/vishnu-m-88a722308",
    github: "https://github.com/MVishnu-dot",
  },
];

/* ───────────────── 3D PageFlip Leaves ─────────────────
   Book physics: at any moment you see the BACK of the last-flipped leaf on
   the left and the FRONT of the next leaf on the right. So to land on
   "lead's photo (left) + lead's description (right)" as one spread, each
   lead's photo goes on the BACK of one leaf, and their description goes on
   the FRONT of the very next leaf:

     leaf 0:  front = cover                back = lead[0] photo
     leaf 1:  front = lead[0] description   back = lead[1] photo
     leaf 2:  front = lead[1] description   back = lead[2] photo
     ...
     leaf N:  front = lead[N-1] description back = back cover

   Flipping leaf i reveals exactly the spread for lead i-1 (photo left,
   description right) — no separate front/back tracking is needed anymore.
*/

function buildBookPages(): PageFlipLeaf[] {
  const pages: PageFlipLeaf[] = [];

  // Leaf 0: front cover, back = first lead's photo
  pages.push({
    id: 0,
    frontTitle: "Byte Club",
    frontSubtitle: "Leadership Directory",
    frontBadge: "2025–2026",
    frontLogo: "/Logo/image.png",
    frontDescription:
      "A collective of student developers, designers, and innovators leading technical projects, community workshops, and hackathons.",
    frontIsCover: true,
    backImage: leads[0].image,
    backTitle: leads[0].name,
    backSubtitle: `${leads[0].role} • ${leads[0].domain}`,
    backBadge: leads[0].badge,
  });

  // One leaf per lead: front = this lead's description, back = next lead's photo
  leads.forEach((lead, idx) => {
    const isLast = idx === leads.length - 1;
    pages.push({
      id: idx + 1,
      frontTitle: lead.name,
      frontSubtitle: `${lead.role} • ${lead.domain}`,
      frontBadge: lead.badge,
      frontDescription: lead.description,
      frontSkills: lead.skills,
      frontSocials: {
        insta: lead.insta,
        linkedin: lead.linkedin,
        github: lead.github,
      },
      backImage: isLast ? undefined : leads[idx + 1].image,
      backBadge: isLast ? "Byte Club 2026" : leads[idx + 1].badge,
      backTitle: isLast ? "Byte Club" : leads[idx + 1].name,
      backSubtitle: isLast ? "Join The Community" : `${leads[idx + 1].role} • ${leads[idx + 1].domain}`,
      backLogo: isLast ? "/Logo/image.png" : undefined,
      backDescription: isLast
        ? "Building open-source platforms, conducting workshops, and hosting flagship hackathons. Connect with our community or explore upcoming initiatives."
        : undefined,
      backIsCover: isLast,
    });
  });

  return pages;
}

const bookPages: PageFlipLeaf[] = buildBookPages();

/* ───────────────── Main TeamLeads Component ───────────────── */

export default function TeamLeads() {
  const bookRef = useRef<ThreeDImagePageflipHandle>(null);
  // -1 = cover is showing, no lead active yet
  const [activeLeadIndex, setActiveLeadIndex] = useState<number>(-1);

  // Responsive book sizing (mobile & desktop)
  const [dimensions, setDimensions] = useState<{ width: number; height: number; perspective: number }>({
    width: 320,
    height: 480,
    perspective: 1600,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 380) {
        setDimensions({ width: 145, height: 250, perspective: 850 });
      } else if (w < 480) {
        setDimensions({ width: 165, height: 280, perspective: 950 });
      } else if (w < 640) {
        setDimensions({ width: 210, height: 340, perspective: 1200 });
      } else if (w < 1024) {
        setDimensions({ width: 260, height: 410, perspective: 1400 });
      } else {
        setDimensions({ width: 330, height: 490, perspective: 1600 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // turnedCount leaves flipped => spread for lead (turnedCount - 1) is showing.
  // turnedCount 0 = cover still showing.
  const handlePageChange = (turnedCount: number) => {
    if (turnedCount <= 0) {
      setActiveLeadIndex(-1);
    } else {
      setActiveLeadIndex(Math.min(turnedCount - 1, leads.length - 1));
    }
  };

  // Jump straight to a lead's spread (photo left, description right)
  const handleJumpToLead = (index: number) => {
    setActiveLeadIndex(index);
    bookRef.current?.goTo(index + 1);
  };

  const handleJumpToCover = () => {
    setActiveLeadIndex(-1);
    bookRef.current?.goTo(0);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 py-2">
      {/* Quick Jump Pills */}
      <div className="w-full flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-2">
        <button
          onClick={handleJumpToCover}
          className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
            activeLeadIndex === -1
              ? "bg-blue-600/20 text-blue-200 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105"
              : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              activeLeadIndex === -1 ? "bg-blue-400 animate-pulse" : "bg-white/40"
            }`}
          />
          <span>Cover</span>
        </button>

        {leads.map((lead, idx) => {
          const isActive = activeLeadIndex === idx;
          return (
            <button
              key={lead.id}
              onClick={() => handleJumpToLead(idx)}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
                isActive
                  ? "bg-blue-600/20 text-blue-200 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isActive ? "bg-blue-400 animate-pulse" : "bg-white/40"
                }`}
              />
              <span>{lead.name}</span>
              <span className="text-[10px] opacity-60 font-mono hidden md:inline">
                [{lead.role}]
              </span>
            </button>
          );
        })}
      </div>

      {/* Pure 3D Book */}
      <div className="w-full flex flex-col items-center justify-center overflow-visible py-2">
        <ThreeDImagePageflip
          ref={bookRef}
          pages={bookPages}
          pageWidth={dimensions.width}
          pageHeight={dimensions.height}
          perspective={dimensions.perspective}
          duration={0.7}
          peekAngle={15}
          spineShift={true}
          showPageNumbers={true}
          accentColor="#3b82f6"
          showControls={true}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
