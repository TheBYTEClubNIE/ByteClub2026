import { ScrollWords } from "./effects";

const STORY =
  "The Byte Club began in 2023 as a handful of first-years who wanted tech events that didn't feel like another lecture. It's grown into a full community, but the idea hasn't changed: get people writing code, building things, and helping each other get better at it, one fun event at a time.";

export default function About() {
  return (
    <section id="about" className="section">
      <h2 className="section-title max-w-3xl">
        Started small in 2023. Still learning out loud.
      </h2>

      <ScrollWords
        text={STORY}
        className="mt-10 max-w-4xl text-[clamp(1.35rem,3.2vw,2.25rem)] leading-[1.35] font-medium tracking-[-0.01em]"
      />

      <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <p className="max-w-xl text-base leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          We exist to make tech feel approachable for whoever&apos;s just
          starting out, and to make sure that by the time you graduate, the
          skills you picked up here helped you get where you wanted to go.
        </p>
        <ul className="flex flex-wrap gap-2">
          {["Hands-on", "Student-run", "Open to all years"].map((fact) => (
            <li
              key={fact}
              className="rounded-full border px-4 py-2 text-sm font-medium"
              style={{ borderColor: "var(--line-strong)", color: "var(--ink)" }}
            >
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
