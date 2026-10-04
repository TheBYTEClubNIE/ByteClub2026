import { isAdmin, jsonBody } from "@/lib/security";

const BLOG_CATEGORIES = ["webdev", "ml", "agentic-ai", "opensource"];
// a row id goes into the PostgREST URL, so it must be a plain id and nothing else
const ID = /^(\d{1,18}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

const bad = (error: string) => Response.json({ error }, { status: 400 });

// Create/update/delete blog posts for the /admin panel, for signed-in admins only.
export async function POST(request: Request) {
    if (!isAdmin(request)) {
        return Response.json({ error: "Session expired. Log out and sign in again." }, { status: 401 });
    }

    const body = await jsonBody(request);
    if (!body) return bad("Expected a JSON object");
    const { action, blog_id, title, content, category, is_published } = body;

    if (title !== undefined && (typeof title !== "string" || title.length > 300)) return bad("title must be text, up to 300 characters");
    if (content !== undefined && (typeof content !== "string" || content.length > 200_000)) return bad("content must be text");
    if (category !== undefined && !BLOG_CATEGORIES.includes(category as string)) {
        return bad(`category must be one of ${BLOG_CATEGORIES.join(", ")}`);
    }
    if (is_published !== undefined && typeof is_published !== "boolean") return bad("is_published must be true or false");
    if (action !== "create" && !ID.test(String(blog_id ?? ""))) return bad("A valid blog_id is required");

    const supabaseUrl = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    const headers = {
        apikey: key as string,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
    };
    const row = `${supabaseUrl}/rest/v1/blogs?blog_id=eq.${encodeURIComponent(String(blog_id))}`;

    try {
        if (action === "create") {
            if (!title || !content) return bad("Title and content are required");

            const res = await fetch(`${supabaseUrl}/rest/v1/blogs`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    title,
                    content,
                    category: category || "webdev",
                    is_published: is_published ?? false,
                }),
            });
            if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
            const data = await res.json();
            return Response.json({ success: true, blog: data[0] }, { status: 201 });

        } else if (action === "update") {
            const updates: Record<string, unknown> = {};
            if (title !== undefined) updates.title = title;
            if (content !== undefined) updates.content = content;
            if (category !== undefined) updates.category = category;
            if (is_published !== undefined) updates.is_published = is_published;

            const res = await fetch(row, { method: "PATCH", headers, body: JSON.stringify(updates) });
            if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
            const data = await res.json();
            return Response.json({ success: true, blog: data[0] ?? null });

        } else if (action === "delete") {
            const res = await fetch(row, { method: "DELETE", headers });
            if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
            return Response.json({ success: true, message: "Blog deleted successfully" });

        } else {
            return bad("Invalid action. Use 'create', 'update', or 'delete'");
        }
    } catch (error) {
        console.error("ADMIN ROUTE ERROR:", error);
        return Response.json({ error: "Admin action failed" }, { status: 500 });
    }
}
