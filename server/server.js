const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URI ,
    credentials: true,
  })
);

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);



app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    // The Resend SDK resolves with { data, error } instead of throwing on
    // API-level failures (e.g. the sandbox sender's recipient restriction),
    // so the resolved value must be checked - awaiting alone silently
    // "succeeds" even when nothing was actually sent.
    const { error: resendError } = await resend.emails.send({
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

    if (resendError) {
      console.log("RESEND ERROR:", resendError);
      return res.status(500).json({ error: "Email failed to send" });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.log("RESEND ERROR:", error);
    res.status(500).json({ error: "Email failed to send" });
  }
});



const BLOG_CATEGORIES = ["webdev", "ml", "agentic-ai", "opensource"];

app.get("/blog", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select(`
        blog_id,
        title,
        content,
        category,
        created_at,
        author_id
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedBlogs = data.map((blog) => ({
      blog_id: blog.blog_id,
      title: blog.title,
      content: blog.content,
      category: blog.category || "webdev",
      created_at: blog.created_at,
      full_name: "Byte Club",
    }));

    res.status(200).json(formattedBlogs);

  } catch (error) {
    console.log("BLOG ERROR:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});



app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({ token: process.env.ADMIN_TOKEN });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});



app.post("/admin", async (req, res) => {
  const { action, blog_id, title, content, category, is_published, author_id } = req.body;

  try {
    if (action === "create") {
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }
      if (category && !BLOG_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: `category must be one of ${BLOG_CATEGORIES.join(", ")}` });
      }
      const { data, error } = await supabase
        .from("blogs")
        .insert([{
          title,
          content,
          category: category || "webdev",
          is_published: is_published !== undefined ? is_published : false,
          author_id: author_id || null,
        }])
        .select();
      if (error) throw error;
      return res.status(201).json({ success: true, blog: data[0] });

    } else if (action === "update") {
      if (!blog_id) return res.status(400).json({ error: "blog_id is required for update" });
      if (category && !BLOG_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: `category must be one of ${BLOG_CATEGORIES.join(", ")}` });
      }
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (content !== undefined) updates.content = content;
      if (category !== undefined) updates.category = category;
      if (is_published !== undefined) updates.is_published = is_published;

      const { data, error } = await supabase
        .from("blogs")
        .update(updates)
        .eq("blog_id", blog_id)
        .select();
      if (error) throw error;
      return res.status(200).json({ success: true, blog: data ? data[0] : null });

    } else if (action === "delete") {
      if (!blog_id) return res.status(400).json({ error: "blog_id is required for delete" });
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("blog_id", blog_id);
      if (error) throw error;
      return res.status(200).json({ success: true, message: "Blog deleted successfully" });

    } else {
      return res.status(400).json({ error: "Invalid action. Use 'create', 'update', or 'delete'" });
    }

  } catch (error) {
    console.log("ADMIN ROUTE ERROR:", error);
    res.status(500).json({ error: "Admin action failed", details: error.message });
  }
});


const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
