const express = require("express");

const {
    getBlogs
} = require("../controllers/blogController");

const router = express.Router();

router.get("/", getBlogs);

module.exports = router;