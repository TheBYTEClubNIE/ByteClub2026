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
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .events-wrapper {
          padding: 5rem 1.5rem;
          font-family: 'Sora', sans-serif;
        }

        .events-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: black;
          margin-bottom: 2rem;
        }

        .events-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .event-card {
          position: relative;
          width: 280px;
          border-radius: 18px;
          padding: 1.4rem;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }

        .event-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .event-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .event-card:hover::before {
          opacity: 1;
        }

        .event-name {
          font-size: 1rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.4rem;
        }

        .event-about {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .event-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.6);
        }

        .meta-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
        }
      `}</style>

      <div className="relative events-wrapper -mt-25">
        {/* TITLE */}
       

        {/* EVENTS */}
        <div className="events-list">
          {EVENTS.map((event) => (
            <Link
              key={event.id}
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="event-card">
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