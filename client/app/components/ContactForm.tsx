"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = null | "sending" | "success" | "error";

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div style={{ width: "100%" }}>
      <label
        style={{
          display: "block",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "10px",
          color: "#00d4ff",
          letterSpacing: "0.15em",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<Status>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/send`, form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=DM+Sans:wght@400;500&display=swap');

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0%,100% {
            box-shadow:
              0 0 30px rgba(0,212,255,0.15),
              0 0 60px rgba(0,212,255,0.08);
          }
          50% {
            box-shadow:
              0 0 50px rgba(0,212,255,0.25),
              0 0 100px rgba(0,212,255,0.15);
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(500px);
          }
        }

        .contact-card {
          position: relative;
          overflow: hidden;
          background: rgba(2,8,18,0.94);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 26px;
          padding: 2.5rem;
          width: 100%;
          max-width: 700px;
          animation:
            fadeUp 0.9s cubic-bezier(0.16,1,0.3,1),
            pulseGlow 4s ease-in-out infinite;
          backdrop-filter: blur(16px);
        }

        .contact-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              135deg,
              rgba(0,212,255,0.06) 0%,
              transparent 50%,
              rgba(26,255,228,0.04) 100%
            );
          pointer-events: none;
        }

        .contact-card::after {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          right: 0;
          height: 35%;
          background: linear-gradient(
            transparent,
            rgba(0,212,255,0.04),
            transparent
          );
          animation: scanline 4s linear infinite;
          pointer-events: none;
        }

        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          z-index: 10;
        }

        .corner-tl {
          top: 10px;
          left: 10px;
          border-top: 2px solid #00d4ff;
          border-left: 2px solid #00d4ff;
        }

        .corner-tr {
          top: 10px;
          right: 10px;
          border-top: 2px solid #00d4ff;
          border-right: 2px solid #00d4ff;
        }

        .corner-bl {
          bottom: 10px;
          left: 10px;
          border-bottom: 2px solid #00d4ff;
          border-left: 2px solid #00d4ff;
        }

        .corner-br {
          bottom: 10px;
          right: 10px;
          border-bottom: 2px solid #00d4ff;
          border-right: 2px solid #00d4ff;
        }

        .neon-title {
          color: #00d4ff;
          text-shadow:
            0 0 12px rgba(0,212,255,0.8),
            0 0 35px rgba(0,212,255,0.4);
        }

        .cyan-line {
          height: 1px;
          width: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0,212,255,0.5),
            rgba(26,255,228,0.5),
            transparent
          );
        }

        .cyber-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 12px;
          padding: 14px 16px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }

        .cyber-input:focus {
          border-color: rgba(0,212,255,0.8);
          box-shadow: 0 0 20px rgba(0,212,255,0.18);
        }

        .cyber-input::placeholder {
          color: rgba(255,255,255,0.35);
        }

        .cyber-btn {
          height: 52px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #00d4ff,
            #1affe4
          );
          color: black;
          font-family: 'Orbitron', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .cyber-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(0,212,255,0.35);
        }

        .toast {
          padding: 14px 16px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div className="contact-card">
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#00d4ff",
                  boxShadow: "0 0 10px #00d4ff",
                }}
              />

              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "10px",
                  color: "rgba(0,212,255,0.7)",
                  letterSpacing: "0.2em",
                }}
              >
                THE.BYTE.CLUB
              </span>
            </div>

            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "10px",
                color: "#00d4ff",
                border: "1px solid rgba(0,212,255,0.3)",
                padding: "4px 10px",
                borderRadius: "999px",
                background: "rgba(0,212,255,0.08)",
              }}
            >
              CONTACT PORTAL
            </div>
          </div>

          <div className="cyan-line" style={{ marginBottom: "1.5rem" }} />

          <p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "10px",
              color: "rgba(0,212,255,0.5)",
              letterSpacing: "0.18em",
              marginBottom: "8px",
            }}
          >
            SEND TRANSMISSION
          </p>

          <h1
            className="neon-title"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem,5vw,3rem)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            CONTACT BYTE CLUB_
          </h1>

          <p
            style={{
              marginTop: "1rem",
              color: "rgba(180,220,230,0.72)",
              fontSize: "14px",
              lineHeight: 1.8,
              maxWidth: "580px",
            }}
          >
            Have an idea, project, collaboration, or recommendation?
            Connect with the Byte Club team through our secure cyber portal.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "240px" }}>
                <Field label="YOUR NAME">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rahul Kumar"
                    required
                    className="cyber-input"
                  />
                </Field>
              </div>

              <div style={{ flex: 1, minWidth: "240px" }}>
                <Field label="EMAIL ADDRESS">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="cyber-input"
                  />
                </Field>
              </div>
            </div>

            <Field label={`MESSAGE DATA (${form.message.length}/1000)`}>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                required
                maxLength={1000}
                placeholder="Write your message here..."
                className="cyber-input"
                style={{ resize: "none", lineHeight: 1.8 }}
              />
            </Field>

            <button
              type="submit"
              disabled={status === "sending"}
              className="cyber-btn"
              style={{
                opacity: status === "sending" ? 0.7 : 1,
                cursor:
                  status === "sending"
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {status === "sending"
                ? "SENDING..."
                : "SEND MESSAGE →"}
            </button>

            {status === "success" && (
              <div
                className="toast"
                style={{
                  background: "rgba(0,255,150,0.12)",
                  color: "#00ff9c",
                  border: "1px solid rgba(0,255,150,0.25)",
                }}
              >
                ✓ Transmission successful. Message delivered.
              </div>
            )}

            {status === "error" && (
              <div
                className="toast"
                style={{
                  background: "rgba(255,0,0,0.12)",
                  color: "#ff7a7a",
                  border: "1px solid rgba(255,0,0,0.25)",
                }}
              >
                ✗ Transmission failed. Retry connection.
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );

  //kjfopajw rj gofpjpawerjgpojpeorjpgo
}