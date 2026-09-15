const supabase = require("../config/supabase");

// Get all published blogs
const getPublishedBlogs = async () => {
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

    return data;
};


// Create blog
const createBlog = async (blogData) => {
    const { data, error } = await supabase
        .from("blogs")
        .insert([blogData])
        .select();

    if (error) throw error;

    return data[0];
};


// Update blog
const updateBlog = async (blog_id, updates) => {
    const { data, error } = await supabase
        .from("blogs")
        .update(updates)
        .eq("blog_id", blog_id)
        .select();

    if (error) throw error;

    return data ? data[0] : null;
};


// Delete blog
const deleteBlog = async (blog_id) => {
    const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("blog_id", blog_id);

    if (error) throw error;

    return true;
};


module.exports = {
    getPublishedBlogs,
    createBlog,
    updateBlog,
    deleteBlog
};