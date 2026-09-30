"use client";

import { useEffect, useState } from "react";
import { BookOpen, Calendar, Home, UserPlus, Users } from "lucide-react";
import ScrollRing from "./ScrollRing";

const SECTION_IDS = ["home", "about", "events", "team", "past", "blog", "join"];

// Desktop top bar
const TOP_LINKS = [
  { href: "#events", label: "Events", sections: ["events"] },
  { href: "#team", label: "Team", sections: ["team"] },
  { href: "#past", label: "Past events", sections: ["past"] },
  { href: "#blog", label: "Blog", sections: ["blog"] },
];

// Phone bottom bar: five labelled tabs, Join last and highlighted.
const TABS = [
  { href: "#home", label: "Home", icon: Home, sections: ["home", "about"] },
  { href: "#events", label: "Events", icon: Calendar, sections: ["events", "past"] },
  { href: "#team", label: "Team", icon: Users, sections: ["team"] },
  { href: "#blog", label: "Blog", icon: BookOpen, sections: ["blog"] },
  { href: "#join", label: "Join", icon: UserPlus, sections: ["join"] },
];

export default function SiteNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="pointer-events-auto">
            <ScrollRing />
          </div>

          <ul
            className="pointer-events-auto hidden items-center gap-1 rounded-full p-1 md:flex"
            style={{ background: "rgba(16,19,23,0.92)", border: "1px solid var(--line)" }}
          >
            {TOP_LINKS.map((link) => {
              const isActive = link.sections.includes(active);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className="block rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--ink)]"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: isActive ? "var(--ink)" : "var(--ink-muted)",
                      background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a href="#join" className="btn btn-primary pointer-events-auto hidden md:inline-flex" style={{ minHeight: 40 }}>
            Join the club
          </a>
        </div>
      </nav>

      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-50 border-t md:hidden"
        style={{
          background: "rgba(10,11,13,0.96)",
          borderColor: "var(--line)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <ul className="grid grid-cols-5">
          {TABS.map(({ href, label, icon: Icon, sections }) => {
            const isActive = sections.includes(active);
            const isJoin = href === "#join";
            return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={isActive ? "true" : undefined}
                  className="relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: isJoin ? "var(--accent)" : isActive ? "var(--ink)" : "var(--ink-muted)",
                  }}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute top-0 h-0.5 w-8 rounded-full"
                      style={{ background: isJoin ? "var(--accent)" : "var(--ink)" }}
                    />
                  )}
                  <Icon size={20} strokeWidth={isActive || isJoin ? 2.2 : 1.8} aria-hidden />
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
