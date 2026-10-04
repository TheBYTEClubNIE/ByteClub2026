import { Resend } from "resend";
import { jsonBody, tooMany } from "@/lib/security";

// Visitors' text goes into an HTML email, so it is escaped: nobody can inject
// links, images or markup into the club's inbox.
const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const text = (v: unknown, max: number) => (typeof v === "string" && v.trim().length <= max ? v.trim() : "");

export async function POST(request: Request) {
    if (tooMany(request, "send", 5, 10 * 60_000)) {
        return Response.json({ error: "Too many messages. Try again in a few minutes." }, { status: 429 });
    }
    const body = await jsonBody(request);
    // limits match the form (the message box takes 1000 characters)
    const name = text(body?.name, 100).replace(/[\r\n]+/g, " ");
    const email = text(body?.email, 254);
    const message = text(body?.message, 1000);

    if (!name || !email || !message) {
        return Response.json({ error: "All fields required" }, { status: 400 });
    }
    if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
        return Response.json({ error: "Enter a valid email" }, { status: 400 });
    }

    try {
        // Constructed per-request (not at module scope): Resend's constructor
        // throws when the key is missing, and Next.js evaluates route modules
        // during the build's page-data collection step, which crashed the
        // build outright rather than just failing at request time.
        const resend = new Resend(process.env.RESEND_API_KEY);
        // The Resend SDK resolves with { data, error } instead of throwing on
        // API-level failures (e.g. the sandbox sender's recipient
        // restriction), so checking the resolved value is required - awaiting
        // the call alone silently "succeeds" even when nothing was sent.
        const { error } = await resend.emails.send({
            from: "Byte Club <onboarding@resend.dev>",
            // Resend's sandbox sender (onboarding@resend.dev) can only
            // deliver to the account's own verified address until a real
            // domain is verified at resend.com/domains. The current
            // RESEND_API_KEY's account is verified for thebyteclub@nie.ac.in
            // itself, so this is the correct recipient for this key.
            to: "thebyteclub@nie.ac.in",
            replyTo: email,
            subject: `New Message from ${name}`,
            html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b><br/>${escapeHtml(message).replace(/\r?\n/g, "<br/>")}</p>
      `,
        });

        if (error) {
            console.error("RESEND ERROR:", error);
            return Response.json({ error: "Email failed to send" }, { status: 500 });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("RESEND ERROR:", error);
        return Response.json({ error: "Email failed to send" }, { status: 500 });
    }
}
