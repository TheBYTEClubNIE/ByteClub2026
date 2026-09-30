import Link from "next/link";

export const metadata = { title: "Page not found" };

const TILES = ["4", "0", "4"];

export default function NotFound() {
  return (
    <main
      className="flex min-h-[100svh] flex-col items-start justify-center px-4 sm:px-6 md:items-center md:text-center"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <div className="flex gap-2" aria-hidden>
        {TILES.map((t, i) => (
          <span
            key={i}
            className="relative flex h-24 w-[4.5rem] items-center justify-center overflow-hidden rounded-md text-6xl font-medium sm:h-32 sm:w-24 sm:text-8xl"
            style={{ fontFamily: "var(--font-mono)", background: "#151a1f", color: "var(--accent)" }}
          >
            {t}
            <span className="absolute inset-x-0 top-1/2 h-px" style={{ background: "rgba(0,0,0,0.6)" }} />
          </span>
        ))}
      </div>

      <h1
        className="mt-10"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.75rem, 5vw, 2.75rem)", letterSpacing: "-0.02em" }}
      >
        This gate doesn&apos;t exist.
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        The page you were looking for isn&apos;t here, or it moved. The board
        still has everything that&apos;s on.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/#events" className="btn btn-ghost">
          See events
        </Link>
      </div>
    </main>
  );
}
