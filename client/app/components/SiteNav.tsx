"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Calendar, Gamepad2, History, Home as HomeIcon, UserPlus, Users } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { clearOldSaves } from "@/lib/bytle-day";
import ScrollRing from "./ScrollRing";

const navItems = [
  // the smallest phones only fit five; the logo ring beside the dock already goes home
  { title: "Home", href: "#home", icon: <HomeIcon className="h-full w-full" />, className: "max-[359px]:hidden" },
  { title: "Events", href: "#events", icon: <Calendar className="h-full w-full" /> },
  { title: "Team", href: "#team", icon: <Users className="h-full w-full" /> },
  { title: "Changelog", href: "#past", icon: <History className="h-full w-full" /> },
  { title: "Blog", href: "#blog", icon: <BookOpen className="h-full w-full" /> },
  { title: "Join", href: "#join", icon: <UserPlus className="h-full w-full" /> },
];

export default function SiteNav() {
  const [activeSection, setActiveSection] = useState("home");
  // Dot on the Bytle button until today's word has been played (the server knows).
  const [freshWord, setFreshWord] = useState(false);

  useEffect(() => {
    clearOldSaves();
    fetch("/api/bytle", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((g: { rows?: unknown[] } | null) => setFreshWord(!!g && !g.rows?.length))
      .catch(() => {});

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    navItems.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const activeNavItems = navItems.map((item) => ({
    ...item,
    active: item.href.slice(1) === activeSection,
  }));

  return (
    <nav aria-label="Main" className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none pt-5 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="pointer-events-auto shrink-0">
          <ScrollRing />
        </div>
        <div className="pointer-events-auto flex-1 min-w-0 flex justify-center">
          <FloatingDock items={activeNavItems} className="max-[359px]:gap-1" />
        </div>
        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <Link
            href="/bytle"
            aria-label={freshWord ? "Play Bytle, today's word is waiting" : "Play Bytle, the daily tech word game"}
            className="relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border text-xs font-semibold transition-colors hover:bg-[rgba(40,194,255,0.2)] sm:w-auto sm:px-4"
            style={{
              borderColor: "var(--accent-border)",
              background: "var(--accent-soft)",
              color: "var(--accent-strong)",
              fontFamily: "var(--font-body)",
            }}
          >
            <Gamepad2 size={17} aria-hidden />
            <span className="hidden sm:inline">Bytle</span>
            {freshWord && (
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full"
                style={{ background: "#ffbf7f", boxShadow: "0 0 0 2px var(--bg)" }}
              />
            )}
          </Link>
          <a
            href="#join"
            className="hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-xs font-semibold"
            style={{ background: "var(--ink)", color: "var(--bg)", fontFamily: "var(--font-body)" }}
          >
            Join
          </a>
        </div>
      </div>
    </nav>
  );
}
