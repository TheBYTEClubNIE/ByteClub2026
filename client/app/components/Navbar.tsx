"use client";

import { useEffect, useState } from "react";
import { Home, Info, Trophy, Send, PenLine } from "lucide-react";

const navItems = [
  { icon: Info, label: "Info", id: "info", href: "#info" },
  { icon: Trophy, label: "Leaderboard", id: "pastevents", href: "#pastevents" },
  { icon: Home, label: "Home", id: "home", href: "#home" },
  { icon: PenLine, label: "Write Review", id: "write", href: "#write" },
  { icon: Send, label: "Send Review", id: "idea", href: "#idea" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) =>
        document.getElementById(item.id)
      );

      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        if (!section) return;

        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (
          scrollPosition >= top &&
          scrollPosition < top + height
        ) {
          setActive(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&family=Share+Tech+Mono&display=swap');

        @keyframes glowPulse {
          0%,100% {
            box-shadow:
              0 0 18px rgba(0,212,255,0.15),
              0 0 40px rgba(0,212,255,0.06);
          }

          50% {
            box-shadow:
              0 0 28px rgba(0,212,255,0.25),
              0 0 65px rgba(0,212,255,0.12);
          }
        }

        .cyber-navbar {
          position: relative;
          overflow: hidden;
          background: rgba(2, 8, 18, 0.88);
          border: 1px solid rgba(0,212,255,0.22);
          backdrop-filter: blur(16px);
          animation: glowPulse 4s ease-in-out infinite;
        }

        .cyber-navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              135deg,
              rgba(0,212,255,0.08) 0%,
              transparent 50%,
              rgba(0,255,200,0.04) 100%
            );
          pointer-events: none;
        }

        .nav-btn {
          position: relative;
          overflow: hidden;
        }

        .nav-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0,212,255,0.18),
            rgba(0,255,200,0.08)
          );
          opacity: 0;
          transition: 0.3s ease;
        }

        .nav-btn:hover::before {
          opacity: 1;
        }

        .active-btn {
          background:
            linear-gradient(
              135deg,
              rgba(0,212,255,0.22),
              rgba(0,255,200,0.12)
            );

          border: 1px solid rgba(0,212,255,0.4);

          box-shadow:
            0 0 18px rgba(0,212,255,0.25),
            inset 0 0 12px rgba(0,212,255,0.08);
        }

        .nav-line {
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(0,212,255,0.4),
              rgba(0,255,200,0.4),
              transparent
            );
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="fixed top-6 left-0 right-0 z-50 px-4">
        <div className="flex items-center justify-center max-w-7xl mx-auto">

          <nav
            className="cyber-navbar relative flex items-center gap-2 px-4 py-3 rounded-full"
          >
            <div className="absolute top-0 left-5 right-5 nav-line" />

            {navItems.map(({ icon: Icon, label, id, href }) => {
              const isActive = active === id;

              return (
                <a
                  key={id}
                  href={href}
                  onClick={() => setActive(id)}
                  aria-label={label}
                  title={label}
                  className={`
                    nav-btn relative flex items-center justify-center
                    transition-all duration-300
                    rounded-full
                    ${
                      isActive
                        ? "active-btn w-14 h-14 text-cyan-300 -translate-y-1"
                        : "w-11 h-11 text-cyan-500/70 hover:text-cyan-300 hover:bg-cyan-400/5"
                    }
                  `}
                >
                  <Icon
                    size={isActive ? 21 : 18}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    className="relative z-10 transition-all duration-300"
                  />

                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow:
                          "0 0 20px rgba(0,212,255,0.25)",
                      }}
                    />
                  )}
                </a>
              );
            })}

            <div
              className="absolute -bottom-3 left-10 right-10 h-4 rounded-full blur-xl"
              style={{
                background: "rgba(0,212,255,0.12)",
              }}
            />
          </nav>
        </div>
      </div>
    </>
  );
}