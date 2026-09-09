"use client";

import Link from "next/link";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.87.24-1.46 1.49-1.46h1.6V4.36C16.3 4.25 15.42 4.17 14.4 4.17c-2.13 0-3.6 1.3-3.6 3.68V10.5H8.3v3h2.5V21h2.7z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#info", label: "Events" },
  { href: "/#cores", label: "Team" },
  { href: "/#write", label: "Contact" },
  { href: "/#pastevents", label: "Past Events" },
];

const SOCIALS = [
  { href: "https://www.instagram.com/thebyteclubnie?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram", icon: <InstagramIcon /> },
  { href: "https://www.linkedin.com/company/thebyteclubnie", label: "LinkedIn", icon: <LinkedInIcon /> },
  { href: "https://github.com/The-Byte-Club", label: "GitHub", icon: <GithubIcon /> },
  { href: "https://www.facebook.com/thebyteclubnie", label: "Facebook", icon: <FacebookIcon /> },
];

export default function Footer() {
  return (
    <footer
      className="mt-20 border-t"
      style={{ borderColor: "var(--line)", background: "var(--bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="tbc-heading" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              The Byte Club
            </h2>
            <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-body)" }} className="text-sm mt-3 leading-relaxed max-w-xs">
              NIE&apos;s student-run technical club. Fun-first tech events,
              real skills, since 2023.
            </p>
          </div>

          <div>
            <span className="tbc-eyebrow tbc-eyebrow--muted" style={{ marginBottom: 14, display: "inline-flex" }}>
              Quick links
            </span>
            <ul style={{ color: "var(--ink-muted)", fontFamily: "var(--font-body)" }} className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-[var(--accent)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="tbc-eyebrow tbc-eyebrow--muted" style={{ marginBottom: 14, display: "inline-flex" }}>
              Connect
            </span>
            <div className="flex gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", color: "var(--ink-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent-border)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-muted)"; e.currentTarget.style.borderColor = "var(--line)"; }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="my-8 h-px" style={{ background: "var(--line)" }} />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>
          <p className="text-xs tracking-wide">{"©"} {new Date().getFullYear()} The Byte Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
