const {
    getPublishedBlogs
} = require("../models/blogModel");


const getBlogs = async (req, res) => {
    try {

        const data = await getPublishedBlogs();

        const formattedBlogs = data.map((blog) => ({
            blog_id: blog.blog_id,
            title: blog.title,
            content: blog.content,
            category: blog.category || "webdev",
            created_at: blog.created_at,
            full_name: "Byte Club"
        }));

        return res.status(200).json(formattedBlogs);

    } catch (error) {

        console.log("BLOG ERROR:", error);

        return res.status(500).json({
            error: "Failed to fetch blogs"
        });
    }
};


module.exports = {
    getBlogs
};