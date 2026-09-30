import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Bytle from "../components/Bytle";

export const metadata: Metadata = {
  title: "Bytle, the daily tech word game",
  description: "One tech word a day, six tries. Crack it, learn what it means, share your grid. By The Byte Club, NIE.",
};

export default function BytlePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 md:px-8 lg:px-12">
        <Link href="/" className="btn btn-ghost" style={{ minHeight: 40, fontSize: 14, paddingLeft: 12 }}>
          <ArrowLeft size={18} aria-hidden />
          Back to site
        </Link>
        <Link href="/" aria-label="The Byte Club home" className="hidden sm:flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logo/logo-transparent.png" alt="" className="h-9 w-9 object-contain" />
          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            The Byte Club
          </span>
        </Link>
        <Link href="/#join" className="btn btn-primary" style={{ minHeight: 40, fontSize: 14 }}>
          Join the club
        </Link>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12" style={{ marginTop: "-3rem" }}>
        <Bytle standalone />
      </main>
    </div>
  );
}
