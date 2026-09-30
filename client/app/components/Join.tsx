import ContactForm from "./ContactForm";
import { COMMUNITY_URL, JOIN_LINK } from "@/content/site";

const STEPS = [
  {
    title: COMMUNITY_URL ? "Join the community chat" : "Follow us on Instagram",
    body: COMMUNITY_URL
      ? "It's where events get announced, registrations open, and questions get answered fast."
      : "That's where we announce events and open registrations.",
    action: { href: JOIN_LINK.href, label: JOIN_LINK.label, external: true, primary: true },
  },
  {
    title: "Come to the next event",
    body: "Every session is open to all years. Check the board for what's on next.",
    action: { href: "#events", label: "See the board", external: false, primary: false },
  },
  {
    title: "Ask us anything",
    body: "Not sure where to start, or want to help run things? Send us a question.",
    action: { href: "#contact", label: "Ask a question", external: false, primary: false },
  },
];

export default function Join() {
  return (
    <section id="join" className="section grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <header className="section-head">
          <h2 className="section-title">Join the club</h2>
          <p className="section-lede">
            You don&apos;t need to already know how to code. You just need to
            show up.
          </p>
        </header>

        <ol className="flex flex-col">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-t py-6"
              style={{ borderColor: "var(--line)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                style={{
                  fontFamily: "var(--font-body)",
                  border: `1px solid ${step.action.primary ? "var(--accent)" : "var(--line-strong)"}`,
                  color: step.action.primary ? "var(--accent)" : "var(--ink)",
                }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  {step.body}
                </p>
                <a
                  href={step.action.href}
                  {...(step.action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`btn mt-4 ${step.action.primary ? "btn-accent" : "btn-ghost"}`}
                >
                  {step.action.label}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div id="contact" className="lg:pt-2" style={{ scrollMarginTop: 96 }}>
        <ContactForm />
      </div>
    </section>
  );
}
