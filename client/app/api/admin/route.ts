const BLOG_CATEGORIES = ["webdev", "ml", "agentic-ai", "opensource"];

// Mirrors server/src/controllers/adminController.js's create/update/delete
// actions, gated with the same static ADMIN_TOKEN, so the /admin panel works
// without depending on the separately-deployed Express backend.
export async function POST(request: Request) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token || token !== process.env.ADMIN_TOKEN) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, blog_id, title, content, category, is_published } = await request.json();

    const supabaseUrl = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    const headers = {
        apikey: key as string,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
    };

    try {
        if (action === "create") {
            if (!title || !content) {
                return Response.json({ error: "Title and content are required" }, { status: 400 });
            }
            if (category && !BLOG_CATEGORIES.includes(category)) {
                return Response.json({ error: `category must be one of ${BLOG_CATEGORIES.join(", ")}` }, { status: 400 });
            }

            const res = await fetch(`${supabaseUrl}/rest/v1/blogs`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    title,
                    content,
                    category: category || "webdev",
                    is_published: is_published !== undefined ? is_published : false,
                }),
            });
            if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
            const data = await res.json();
            return Response.json({ success: true, blog: data[0] }, { status: 201 });

        } else if (action === "update") {
            if (!blog_id) return Response.json({ error: "blog_id is required for update" }, { status: 400 });
            if (category && !BLOG_CATEGORIES.includes(category)) {
                return Response.json({ error: `category must be one of ${BLOG_CATEGORIES.join(", ")}` }, { status: 400 });
            }

            const updates: Record<string, unknown> = {};
            if (title !== undefined) updates.title = title;
            if (content !== undefined) updates.content = content;
            if (category !== undefined) updates.category = category;
            if (is_published !== undefined) updates.is_published = is_published;

            const res = await fetch(`${supabaseUrl}/rest/v1/blogs?blog_id=eq.${blog_id}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
            const data = await res.json();
            return Response.json({ success: true, blog: data[0] ?? null });

        } else if (action === "delete") {
            if (!blog_id) return Response.json({ error: "blog_id is required for delete" }, { status: 400 });

            const res = await fetch(`${supabaseUrl}/rest/v1/blogs?blog_id=eq.${blog_id}`, {
                method: "DELETE",
                headers,
            });
            if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
            return Response.json({ success: true, message: "Blog deleted successfully" });

        } else {
            return Response.json({ error: "Invalid action. Use 'create', 'update', or 'delete'" }, { status: 400 });
        }
    } catch (error) {
        console.error("ADMIN ROUTE ERROR:", error);
        return Response.json({ error: "Admin action failed" }, { status: 500 });
    }
}
