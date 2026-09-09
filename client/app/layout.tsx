import "./globals.css";
import type { Metadata } from "next";
import { Geist, Unbounded, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
// Unbounded: a geometric, slightly retro-futurist display face with real
// character (distinct closed apertures, blocky terminals) instead of the
// generic-modern-tech-startup look a lot of grotesque sans faces have
// settled into. Ties into the binary/circuit brand motif better too.
const display = Unbounded({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
});
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "The Byte Club | NIE's Technical Club",
  description:
    "A student-run technical club at NIE. Fun-first events that teach real coding, hands-on building, and the skills that get first-years placement-ready.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        geist.variable,
        display.variable,
        body.variable,
        mono.variable
      )}
    >
      <body>
        {children}
      </body>
    </html>
  );
}