"use client";

import Link from "next/link";
import React from "react";

interface TechEvent {
  id: number;
  name: string;
  about: string;
  location: string;
  time: string;
  link: string;
}

const EVENTS: TechEvent[] = [
  {
    id: 1,
    name: "Beyond The Labs",
    about:
      "Use powerful tools like Opal and Stitch, solve a real problem, and see what you can create in just 2 hours.",
    location: "North Auditorium",
    time: "8th April ⏰ 2:30 PM to 4:30 PM",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSesIVFQ6eHJcF4IgJrr2dmxLVfVOS_TR35nWEBjFIOLAGXLtQ/viewform",
  },
];

export default function UpcomingEvents() {
  return (
    <>
      <style>{`
        .events-wrapper { padding: 1rem 0; }
        .events-list { display: flex; flex-wrap: wrap; gap: 1.25rem; }
        .event-card {
          position: relative;
          width: 300px;
          border-radius: 18px;
          padding: 1.5rem;
          background: var(--bg-elevated);
          border: 1px solid var(--line);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease;
        }
        .event-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent-border);
        }
        .event-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--accent);
          border: 1px solid var(--accent-border);
          background: var(--accent-soft);
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 0.9rem;
        }
        .event-name {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 0.5rem;
        }
        .event-about {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--ink-muted);
          line-height: 1.65;
          margin-bottom: 1.1rem;
        }
        .event-meta { display: flex; flex-wrap: wrap; gap: 1rem; }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--ink-faint);
        }
        .meta-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }
      `}</style>

      <div className="events-wrapper">
        <div className="events-list">
          {EVENTS.map((event) => (
            <Link
              key={event.id}
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="event-card">
                <span className="event-tag">REGISTRATION OPEN</span>
                <p className="event-name">{event.name}</p>
                <p className="event-about">{event.about}</p>

                <div className="event-meta">
                  <span className="meta-item">
                    <span className="meta-dot" />
                    {event.time}
                  </span>
                  <span className="meta-item">
                    <span className="meta-dot" />
                    {event.location}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
