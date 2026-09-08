"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-20 border-t"
      style={{ borderColor: "var(--line)", background: "var(--bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              className="text-xl font-bold"
            >
              The Byte Club
            </h2>
            <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-body)" }} className="text-sm mt-3 leading-relaxed">
              NIE&apos;s student-run technical club. Fun-first tech events,
              real skills, since 2023.
            </p>
          </div>

          <div>
            <h3 style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }} className="font-semibold mb-3">Quick Links</h3>
            <ul style={{ color: "var(--ink-muted)", fontFamily: "var(--font-body)" }} className="space-y-2 text-sm">
              <li>
                <Link href="/#home" className="hover:text-white transition cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#info" className="hover:text-white transition cursor-pointer">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/#cores" className="hover:text-white transition cursor-pointer">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/#write" className="hover:text-white transition cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/#pastevents" className="hover:text-white transition cursor-pointer">
                  Past Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: "var(--ink)", fontFamily: "var(--font-body)" }} className="font-semibold mb-3">Connect</h3>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/thebyteclubnie?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="p-2 rounded-full transition" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>🌐</a>
              <a href="https://www.linkedin.com/company/thebyteclubnie" className="p-2 rounded-full transition" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>💼</a>
              <a href="https://github.com/The-Byte-Club" className="p-2 rounded-full transition" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>🐙</a>
              <a href="https://www.facebook.com/thebyteclubnie" className="p-2 rounded-full transition" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>📸</a>
            </div>
          </div>
        </div>

        <div className="my-8 h-px" style={{ background: "var(--line)" }} />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>
          <p>© {new Date().getFullYear()} The Byte Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}