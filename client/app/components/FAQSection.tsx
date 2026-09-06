
"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "What is BYTE Club?",
    answer:
      "BYTE Club is a technical club at NIE focused on helping students learn, build, collaborate, and explore technology through workshops, events, projects, and technical activities.",
  },
  {
    question: "Who can join BYTE Club?",
    answer:
      "Students from NIE who are interested in technology, programming, development, AI, cybersecurity, design, and other technical domains can join BYTE Club.",
  },
  {
    question: "Do I need coding experience to join BYTE Club?",
    answer:
      "No. You don't need to be an expert programmer. BYTE Club welcomes beginners as well as experienced students who want to learn and grow together.",
  },
  {
    question: "What kind of events does BYTE Club conduct?",
    answer:
      "BYTE Club conducts technical workshops, coding competitions, hackathons, tech talks, project-based activities, and fun technical events.",
  },
  {
    question: "How can I participate in BYTE Club events?",
    answer:
      "You can participate by registering for the events announced by BYTE Club. Event registration details will be shared through the club's official platforms.",
  },
  {
    question: "Can students from different branches participate?",
    answer:
      "Yes. BYTE Club encourages students from different branches and backgrounds to participate, collaborate, and learn together.",
  },
  {
    question: "How can I become a BYTE Club member?",
    answer:
      "Membership and recruitment opportunities will be announced by BYTE Club through its official announcements. Keep an eye out for upcoming opportunities.",
  },
  {
    question: "How can I collaborate with BYTE Club?",
    answer:
      "You can contact the BYTE Club team for collaborations, workshops, technical events, sponsorships, and other opportunities.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="w-full py-16 sm:py-20 md:py-24 flex flex-col items-center"
    >
      {/* Heading */}
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-sm sm:text-base font-medium text-sky-400 mb-2">
          FAQ
        </p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
          Frequently Asked Questions
        </h2>

        <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-2xl mx-auto">
          Everything you need to know about BYTE Club, our events,
          membership, and activities.
        </p>
      </div>

      {/* FAQ Container */}
      <div className="w-full max-w-3xl px-2 sm:px-0 flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`
                relative w-full overflow-hidden rounded-2xl
                border border-white/10
                bg-gradient-to-r from-[#050b18]/90 via-[#071026]/90 to-black/90
                backdrop-blur-xl
                transition-all duration-300
                ${
                  isOpen
                    ? "border-sky-400/40 shadow-[0_0_30px_rgba(56,189,248,0.08)]"
                    : "hover:border-sky-400/25"
                }
              `}
            >
              {/* Gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.04] via-transparent to-blue-500/[0.04] pointer-events-none" />

              {/* Question */}
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className="relative z-10 w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 sm:py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base md:text-lg font-medium text-white">
                  {faq.question}
                </span>

                {/* Plus Icon */}
                <span
                  className={`
                    flex-shrink-0 flex items-center justify-center
                    w-8 h-8 rounded-full
                    border border-sky-400/30
                    text-sky-400 text-xl font-light
                    transition-all duration-300
                    ${
                      isOpen
                        ? "rotate-45 bg-sky-400/10"
                        : "rotate-0"
                    }
                  `}
                >
                  +
                </span>
              </button>

              {/* Answer */}
              <div
                className={`
                  grid transition-all duration-500 ease-in-out
                  ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }
                `}
              >
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <div className="h-px w-full bg-gradient-to-r from-sky-400/30 via-blue-400/10 to-transparent mb-4" />

                    <p className="text-sm sm:text-base leading-7 text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
