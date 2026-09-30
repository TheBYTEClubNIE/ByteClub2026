"use client";

import { useEffect, useState } from "react";
import { BookOpen, Calendar, Gamepad2, History, Home as HomeIcon, UserPlus, Users } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import ScrollRing from "./ScrollRing";

const navItems = [
  { title: "Home", href: "#home", icon: <HomeIcon className="h-full w-full" /> },
  { title: "Events", href: "#events", icon: <Calendar className="h-full w-full" /> },
  { title: "Team", href: "#team", icon: <Users className="h-full w-full" /> },
  { title: "Changelog", href: "#past", icon: <History className="h-full w-full" /> },
  { title: "Blog", href: "#blog", icon: <BookOpen className="h-full w-full" /> },
  { title: "Bytle", href: "#bytle", icon: <Gamepad2 className="h-full w-full" /> },
  { title: "Join", href: "#join", icon: <UserPlus className="h-full w-full" /> },
];

export default function SiteNav() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
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
          <FloatingDock items={activeNavItems} />
        </div>
        <a
          href="#join"
          className="pointer-events-auto hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-xs font-semibold shrink-0"
          style={{ background: "var(--ink)", color: "var(--bg)", fontFamily: "var(--font-body)" }}
        >
          Join
        </a>
      </div>
    </nav>
  );
}
