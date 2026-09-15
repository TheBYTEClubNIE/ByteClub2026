const resend = require("../config/resend");

const sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    // Check required fields
    if (!name || !email || !message) {
        return res.status(400).json({
            error: "All fields required"
        });
    }

    try {
        const { error: resendError } = await resend.emails.send({
            from: "Byte Club <onboarding@resend.dev>",
            to: "thebyteclub@nie.ac.in",
            replyTo: email,
            subject: `New Message from ${name}`,

            html: `
                <h2>New Contact Message</h2>

                <p>
                    <b>Name:</b> ${name}
                </p>

                <p>
                    <b>Email:</b> ${email}
                </p>

                <p>
                    <b>Message:</b><br/>
                    ${message}
                </p>
            `
        });

        if (resendError) {
            console.log("RESEND ERROR:", resendError);

            return res.status(500).json({
                error: "Email failed to send"
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        console.log("RESEND ERROR:", error);

        return res.status(500).json({
            error: "Email failed to send"
        });
    }
};

module.exports = {
    sendMessage
};