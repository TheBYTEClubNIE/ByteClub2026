export default function About() {
  return (
    <section id="about" className="section grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      <h2 className="section-title">
        Started small in 2023.
        <br />
        Still learning out loud.
      </h2>

      <div className="flex flex-col gap-5" style={{ fontFamily: "var(--font-body)" }}>
        <p className="text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
          The Byte Club began in 2023 as a handful of first-years who wanted
          tech events that didn&apos;t feel like another lecture. It&apos;s
          grown into a full community, but the idea hasn&apos;t changed: get
          people writing code, building things, and helping each other get
          better at it, one fun event at a time.
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          We exist to make tech feel approachable for whoever&apos;s just
          starting out, and to make sure that by the time you graduate, the
          skills you picked up here helped you get where you wanted to go.
        </p>

        <ul
          className="mt-3 grid grid-cols-3 border-t pt-5 text-sm"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        >
          {["Hands-on", "Student-run", "Open to all years"].map((fact) => (
            <li key={fact} className="flex items-center gap-2 font-medium">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
