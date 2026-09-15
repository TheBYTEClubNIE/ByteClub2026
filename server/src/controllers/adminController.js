const {
    createBlog,
    updateBlog,
    deleteBlog
} = require("../models/blogModel");

const {
    BLOG_CATEGORIES
} = require("../utils/constants");


const adminAction = async (req, res) => {

    const {
        action,
        blog_id,
        title,
        content,
        category,
        is_published,
        author_id
    } = req.body;


    try {

        // =========================
        // CREATE BLOG
        // =========================

        if (action === "create") {

            // Check required fields
            if (!title || !content) {
                return res.status(400).json({
                    error: "Title and content are required"
                });
            }


            // Validate category
            if (
                category &&
                !BLOG_CATEGORIES.includes(category)
            ) {
                return res.status(400).json({
                    error: `category must be one of ${BLOG_CATEGORIES.join(", ")}`
                });
            }


            // Create blog
            const blog = await createBlog({

                title: title,

                content: content,

                category: category || "webdev",

                is_published:
                    is_published !== undefined
                        ? is_published
                        : false,

                author_id: author_id || null
            });


            return res.status(201).json({
                success: true,
                blog: blog
            });
        }


        // =========================
        // UPDATE BLOG
        // =========================

        if (action === "update") {

            // blog_id required
            if (!blog_id) {
                return res.status(400).json({
                    error: "blog_id is required for update"
                });
            }


            // Validate category
            if (
                category &&
                !BLOG_CATEGORIES.includes(category)
            ) {
                return res.status(400).json({
                    error: `category must be one of ${BLOG_CATEGORIES.join(", ")}`
                });
            }


            // Create object containing
            // only fields that need updating
            const updates = {};


            if (title !== undefined) {
                updates.title = title;
            }


            if (content !== undefined) {
                updates.content = content;
            }


            if (category !== undefined) {
                updates.category = category;
            }


            if (is_published !== undefined) {
                updates.is_published = is_published;
            }


            // Update blog
            const blog = await updateBlog(
                blog_id,
                updates
            );


            return res.status(200).json({
                success: true,
                blog: blog
            });
        }


        // =========================
        // DELETE BLOG
        // =========================

        if (action === "delete") {

            // blog_id required
            if (!blog_id) {
                return res.status(400).json({
                    error: "blog_id is required for delete"
                });
            }


            // Delete blog
            await deleteBlog(blog_id);


            return res.status(200).json({
                success: true,
                message: "Blog deleted successfully"
            });
        }


        // =========================
        // INVALID ACTION
        // =========================

        return res.status(400).json({
            error:
                "Invalid action. Use 'create', 'update', or 'delete'"
        });

    } catch (error) {

        console.log(
            "ADMIN ROUTE ERROR:",
            error
        );


        return res.status(500).json({
            error: "Admin action failed",
            details: error.message
        });
    }
};


module.exports = {
    adminAction
};