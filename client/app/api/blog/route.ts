const BLOG_CATEGORIES = ["webdev", "ml", "agentic-ai", "opensource"];

export async function GET() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    try {
        const res = await fetch(
            `${supabaseUrl}/rest/v1/blogs?select=blog_id,title,content,category,created_at,author_id&is_published=eq.true&order=created_at.desc`,
            {
                headers: {
                    apikey: key as string,
                    Authorization: `Bearer ${key}`,
                },
                cache: "no-store",
            }
        );

        if (!res.ok) {
            throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        const formattedBlogs = data.map((blog: { blog_id: number; title: string; content: string; category: string; created_at: string }) => ({
            blog_id: blog.blog_id,
            title: blog.title,
            content: blog.content,
            category: blog.category || "webdev",
            created_at: blog.created_at,
            full_name: "Byte Club",
        }));

        return Response.json(formattedBlogs);
    } catch (error) {
        console.error("BLOG ERROR:", error);
        return Response.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

// Mirrors the "create" action from server/server.js's /admin endpoint, gated
// with the same static ADMIN_TOKEN so the admin panel can create posts
// without depending on the never-deployed Express backend.
export async function POST(request: Request) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token || token !== process.env.ADMIN_TOKEN) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, category, is_published } = await request.json();

    if (!title || !content) {
        return Response.json({ error: "Title and content are required" }, { status: 400 });
    }
    if (category && !BLOG_CATEGORIES.includes(category)) {
        return Response.json({ error: `category must be one of ${BLOG_CATEGORIES.join(", ")}` }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/blogs`, {
            method: "POST",
            headers: {
                apikey: key as string,
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
            },
            body: JSON.stringify({
                title,
                content,
                category: category || "webdev",
                is_published: is_published !== undefined ? is_published : false,
            }),
        });

        if (!res.ok) {
            throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        return Response.json({ success: true, blog: data[0] }, { status: 201 });
    } catch (error) {
        console.error("BLOG CREATE ERROR:", error);
        return Response.json({ error: "Admin action failed" }, { status: 500 });
    }
}
