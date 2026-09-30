// Leads and what each one carries. `arsenal` is the set of domains a lead
// covers: the club lead carries all of them, everyone else their own.
// `squad` links a lead to the core team they run (see DisplayCore.tsx).

export type Domain = "tech" | "design" | "creative" | "management" | "outreach";

export const DOMAINS: { id: Domain; label: string; color: string }[] = [
  { id: "tech", label: "Tech", color: "#28c2ff" },
  { id: "design", label: "Design", color: "#c6a6ff" },
  { id: "creative", label: "Creative", color: "#ffbf7f" },
  { id: "management", label: "Management", color: "#7ee0b5" },
  { id: "outreach", label: "Outreach", color: "#ff9db0" },
];

// How a photo sits in its frame: pan (object-position), zoom, and the point
// to zoom into (roughly where the face is). Tune per photo.
export interface PhotoFrame {
  position?: string;
  zoom?: number;
  origin?: string;
}

export const photoStyle = (f?: PhotoFrame) => ({
  objectPosition: f?.position ?? "50% 50%",
  transform: f?.zoom ? `scale(${f.zoom})` : undefined,
  transformOrigin: f?.origin,
});

// A zoomed photo is shown bigger than its box, so ask for a bigger file too
// (otherwise the browser downloads a small one and it looks soft). Only the
// size values are scaled, not the media conditions.
export const zoomedSizes = (sizes: string, zoom = 1) =>
  zoom <= 1
    ? sizes
    : sizes
        .split(",")
        .map((part) => {
          const i = part.lastIndexOf(")") + 1;
          return part.slice(0, i) + part.slice(i).replace(/(\d+(?:\.\d+)?)(px|vw|rem)/, (_, n, u) => `${Math.ceil(+n * zoom)}${u}`);
        })
        .join(",");

export interface Lead {
  id: number;
  name: string;
  role: string;
  area: string;
  description: string;
  skills: string[];
  insta: string;
  linkedin: string;
  github: string;
  image: string;
  arsenal: Domain[];
  frame?: PhotoFrame;
  squad?: "tech" | "management" | "creative";
}

export const LEADS: Lead[] = [
  {
    id: 1,
    name: "Ritesh Kumar",
    frame: { zoom: 1.25, origin: "55% 20%" },
    role: "Club Lead",
    area: "Executive & Strategy",
    image: "/Leads/ritesh president.jpeg",
    description:
      "Sets the overarching vision and roadmap for Byte Club, driving cross-functional alignment across technical initiatives, creative campaigns, and community hackathons.",
    skills: ["Leadership", "Community", "Strategy"],
    insta: "https://www.instagram.com/riteshkrkarn",
    linkedin: "https://www.linkedin.com/in/riteshkrkarn",
    github: "https://github.com/riteshkrkarn",
    arsenal: ["tech", "design", "creative", "management", "outreach"],
  },
  {
    id: 2,
    name: "Gulshan Kumar",
    frame: { zoom: 1.1, origin: "42% 18%" },
    role: "Tech Lead",
    area: "Engineering & Architecture",
    image: "/Leads/gulshankumar-techlead.jpeg",
    description:
      "Architects the technical ecosystem and infrastructure for club platforms. Oversees full-stack open-source projects, conducts workshops, and mentors developers.",
    skills: ["Full-Stack", "Architecture", "Open Source"],
    insta: "https://www.instagram.com/jhagk_",
    linkedin: "https://www.linkedin.com/in/gulshankumar0",
    github: "https://github.com/GulshanJha00",
    arsenal: ["tech"],
    squad: "tech",
  },
  {
    id: 7,
    name: "Tanishq Dhawan",
    frame: { position: "50% 0%", zoom: 1.45, origin: "47% 20%" },
    role: "Technical Co-Lead",
    area: "Full-Stack Development & Tooling",
    image: "/Leads/tanishq-technicalcolead.jpeg",
    description:
      "Partners with the Tech Lead on engineering direction, building and maintaining the platforms members actually use, and helping new developers get comfortable in a real codebase.",
    skills: ["Full-Stack", "Next.js", "Mentorship"],
    insta: "https://www.instagram.com/okay.tanishq",
    linkedin: "https://www.linkedin.com/in/tanishq-dhawan",
    github: "https://github.com/CALL-ME-TATA",
    arsenal: ["tech"],
    squad: "tech",
  },
  {
    id: 3,
    name: "Mayank Rai",
    frame: { zoom: 1.3, origin: "45% 40%" },
    role: "Management Lead",
    area: "Operations & Logistics",
    image: "/Leads/Mayank-managmentlead.jpeg",
    description:
      "Orchestrates end-to-end event operations, resource allocation, and logistics. Ensures flagship hackathons and club projects execute seamlessly on schedule.",
    skills: ["Operations", "Logistics", "Planning"],
    insta: "https://www.instagram.com/may_nk_0333",
    linkedin: "https://www.linkedin.com/in/mayank-rai-423419305",
    github: "https://github.com/raimac12345",
    arsenal: ["management"],
    squad: "management",
  },
  {
    id: 4,
    name: "Sashwat Sharma",
    frame: { zoom: 2.1, origin: "52% 36%" },
    role: "Creativity Lead",
    area: "Media & Brand Identity",
    image: "/Leads/shashwat-creativitylead.jpeg",
    description:
      "Directs creative strategy, multimedia storytelling, and brand identity across digital channels. Crafts high-impact visuals and design narratives.",
    skills: ["Creative", "Motion Design", "Branding"],
    insta: "https://www.instagram.com/luminal786",
    linkedin: "https://www.linkedin.com/in/shashwat-sharma-universal",
    github: "https://github.com/Universal786",
    arsenal: ["creative"],
    squad: "creative",
  },
  {
    id: 5,
    name: "Sambhav Roy",
    frame: { position: "50% 0%", zoom: 1.25, origin: "52% 30%" },
    role: "Design Lead",
    area: "UI/UX & Product Design",
    image: "/Leads/Sambhav.jpeg",
    description:
      "Spearheads UI/UX design systems, user research, and interactive prototypes. Transforms complex technical workflows into intuitive, visually stunning interfaces.",
    skills: ["UI/UX", "Figma", "Design Systems"],
    insta: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    arsenal: ["design"],
  },
  {
    id: 6,
    name: "Vishnu M",
    frame: { zoom: 1.25, origin: "55% 42%" },
    role: "Sponsorship Lead",
    area: "Partnerships & Outreach",
    image: "/Leads/vishnum-sponshership lead.jpeg",
    description:
      "Builds and manages key corporate partnerships, sponsorships, and industry outreach. Secures funding, merchandise, and mentorship resources.",
    skills: ["Partnerships", "Outreach", "Negotiation"],
    insta: "https://www.instagram.com/_vishnum___",
    linkedin: "https://www.linkedin.com/in/vishnu-m-88a722308",
    github: "https://github.com/MVishnu-dot",
    arsenal: ["outreach"],
  },
];

// Placeholders ("insta_id") and bare site roots ("https://www.instagram.com/")
// aren't real profiles, so they don't get an icon.
export const isProfileUrl = (val: string) =>
  val.startsWith("http") && !/^https?:\/\/(www\.)?(instagram|linkedin|github)\.com\/?$/.test(val);
