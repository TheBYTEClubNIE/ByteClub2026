// Published posts for the /admin panel (writes go through /api/admin).
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
