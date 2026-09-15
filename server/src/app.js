const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const contactRoutes = require("./routes/contactRoutes");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URI,
        credentials: true
    })
);

app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/auth/login", authRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;