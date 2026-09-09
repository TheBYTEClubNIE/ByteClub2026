import { Resend } from "resend";

export async function POST(request: Request) {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
        return Response.json({ error: "All fields required" }, { status: 400 });
    }

    try {
        // Constructed per-request (not at module scope): Resend's constructor
        // throws when the key is missing, and Next.js evaluates route modules
        // during the build's page-data collection step, which crashed the
        // build outright rather than just failing at request time.
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: "Byte Club <onboarding@resend.dev>",
            to: "thebyteclub@nie.ac.in",
            replyTo: email,
            subject: `New Message from ${name}`,
            html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error("RESEND ERROR:", error);
        return Response.json({ error: "Email failed to send" }, { status: 500 });
    }
}
