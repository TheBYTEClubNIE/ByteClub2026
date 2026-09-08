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
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--ink-faint)",
          letterSpacing: "0.14em",
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
        .contact-card {
          position: relative;
          background: var(--bg-elevated);
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 2.25rem;
          width: 100%;
          max-width: 640px;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .contact-line { height: 1px; width: 100%; background: var(--line); }
        .contact-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 13px 16px;
          color: var(--ink);
          font-family: var(--font-body);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        .contact-input:focus { border-color: var(--accent-border); }
        .contact-input::placeholder { color: var(--ink-faint); }
        .contact-btn {
          height: 50px;
          border: none;
          border-radius: 12px;
          background: var(--ink);
          color: var(--bg);
          font-family: var(--font-body);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .contact-btn:hover { transform: translateY(-2px); }
        .toast { padding: 13px 16px; border-radius: 12px; font-family: var(--font-body); font-size: 13.5px; }
      `}</style>

      <div className="w-full flex items-center justify-center py-4">
        <div className="contact-card">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--accent)",
              letterSpacing: "0.18em",
              margin: "0 0 8px",
            }}
          >
            SAY HELLO
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.7rem,4.4vw,2.4rem)",
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Got a question, idea, or want to join?
          </h2>

          <p
            style={{
              marginTop: "0.9rem",
              color: "var(--ink-muted)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              lineHeight: 1.75,
              maxWidth: "520px",
            }}
          >
            Whether you want to join the club, collaborate on something, or
            just have a question about an upcoming event — drop us a line and
            we&apos;ll get back to you.
          </p>

          <div className="contact-line" style={{ margin: "1.5rem 0" }} />

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
          >
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <Field label="YOUR NAME">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rahul Kumar"
                    required
                    className="contact-input"
                  />
                </Field>
              </div>

              <div style={{ flex: 1, minWidth: "220px" }}>
                <Field label="EMAIL ADDRESS">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="contact-input"
                  />
                </Field>
              </div>
            </div>

            <Field label={`MESSAGE (${form.message.length}/1000)`}>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                required
                maxLength={1000}
                placeholder="Write your message here..."
                className="contact-input"
                style={{ resize: "none", lineHeight: 1.7 }}
              />
            </Field>

            <button
              type="submit"
              disabled={status === "sending"}
              className="contact-btn"
              style={{
                opacity: status === "sending" ? 0.7 : 1,
                cursor: status === "sending" ? "not-allowed" : "pointer",
              }}
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>

            {status === "success" && (
              <div
                className="toast"
                style={{
                  background: "rgba(40,194,255,0.1)",
                  color: "var(--accent-strong)",
                  border: "1px solid var(--accent-border)",
                }}
              >
                Message sent — we&apos;ll get back to you soon.
              </div>
            )}

            {status === "error" && (
              <div
                className="toast"
                style={{
                  background: "rgba(255,90,90,0.1)",
                  color: "#ff8a8a",
                  border: "1px solid rgba(255,90,90,0.25)",
                }}
              >
                Something went wrong — please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
