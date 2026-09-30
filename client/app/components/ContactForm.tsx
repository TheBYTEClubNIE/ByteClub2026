"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = null | "sending" | "success" | "error";

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium" style={{ color: "var(--ink)" }}>
          {label}
        </label>
        {hint && (
          <span className="text-xs tabular-nums" style={{ color: "var(--ink-faint)" }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status === "success" || status === "error") setStatus(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("/api/send", form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        .contact-card { background: var(--bg-elevated); border: 1px solid var(--line); border-radius: 12px; padding: clamp(1.5rem, 4vw, 2.25rem); }
        .contact-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--line-strong);
          border-radius: 10px;
          padding: 12px 14px;
          color: var(--ink);
          font-family: var(--font-body);
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .contact-input:hover { border-color: var(--ink-faint); }
        .contact-input:focus { border-color: var(--accent); background: rgba(40,194,255,0.04); }
        .contact-input::placeholder { color: var(--ink-faint); }
        .toast { padding: 12px 14px; border-radius: 10px; font-family: var(--font-body); font-size: 14px; }
      `}</style>

      <div className="contact-card">
        <h3 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)", letterSpacing: "-0.015em" }}>
          Questions?
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--ink-muted)", maxWidth: "46ch" }}>
          Ask about an event, pitch a collab, or anything else. We&apos;ll get
          back to you by email.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="contact-name">
              <input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Rahul Kumar" required className="contact-input" />
            </Field>
            <Field label="Email" htmlFor="contact-email">
              <input id="contact-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="contact-input" />
            </Field>
          </div>

          <Field label="Message" htmlFor="contact-message" hint={`${form.message.length}/1000`}>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
              maxLength={1000}
              placeholder="What would you like to know?"
              className="contact-input"
              style={{ resize: "vertical", lineHeight: 1.6, minHeight: 132 }}
            />
          </Field>

          <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full">
            {status === "sending" ? "Sending…" : "Send question"}
          </button>

          <div aria-live="polite">
            {status === "success" && (
              <p className="toast" style={{ background: "var(--accent-soft)", color: "var(--accent-strong)", border: "1px solid var(--accent-border)" }}>
                Sent. We&apos;ll reply to your email soon.
              </p>
            )}
            {status === "error" && (
              <p className="toast" style={{ background: "rgba(255,90,90,0.1)", color: "#ff9b9b", border: "1px solid rgba(255,90,90,0.3)" }}>
                That didn&apos;t send. Check your connection and try again.
              </p>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
