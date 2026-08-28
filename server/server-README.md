# ByteClub 2026 — Server

The Express.js backend that powers the ByteClub website. It handles contact form submissions, serves blog posts from Supabase, and exposes a protected admin API for blog management.

---

## Table of Contents

- [Stack](#stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [POST /send](#post-send)
  - [GET /blog](#get-blog)
  - [POST /login](#post-login)
  - [POST /admin](#post-admin)
- [Database Schema](#database-schema)
- [Error Codes](#error-codes)
- [Security](#security)

---

## Stack

| Package                  | Version   | Purpose                              |
|--------------------------|-----------|--------------------------------------|
| `express`                | ^5.2.1    | HTTP server and routing              |
| `cors`                   | ^2.8.6    | Cross-origin resource sharing        |
| `dotenv`                 | ^17.4.2   | Environment variable loading         |
| `@supabase/supabase-js`  | ^2.105.4  | Supabase database client             |
| `resend`                 | ^6.12.3   | Transactional email delivery         |
| `pg`                     | ^8.20.0   | PostgreSQL driver (available if needed) |

---

## Project Structure

```
server/
├── server.js        # Main application entry point (all routes defined here)
├── package.json     # Dependencies and npm scripts
├── .env             # Environment variables (do NOT commit)
└── .gitignore
```

---

## Setup

```bash
cd server
npm install
```

---

## Environment Variables

Create a `.env` file in the `server/` directory with the following keys:

```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend (email)
RESEND_API_KEY=re_your_resend_api_key

# Admin credentials (used by /login)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
ADMIN_TOKEN=your_secret_static_token

# Server
PORT=5000
```

### Variable Descriptions

| Variable                    | Required | Description                                                                 |
|-----------------------------|----------|-----------------------------------------------------------------------------|
| `SUPABASE_URL`              | Yes      | Your Supabase project URL                                                   |
| `SUPABASE_ANON_KEY`         | Yes      | Public anon key; used as fallback if service role key is absent             |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes      | Grants full DB access; bypasses RLS — **never expose to the client**        |
| `RESEND_API_KEY`            | Yes      | API key for Resend; used by the `/send` endpoint                            |
| `ADMIN_USERNAME`            | Yes      | Username for the admin login endpoint                                       |
| `ADMIN_PASSWORD`            | Yes      | Password for the admin login endpoint                                       |
| `ADMIN_TOKEN`               | Yes      | Static token returned on successful login; verified by `/admin` operations  |
| `PORT`                      | No       | Port the server listens on (defaults to `5000`)                             |

> **Production tip:** Use a long random string for `ADMIN_TOKEN` (e.g., `openssl rand -hex 32`). Rotate it if you suspect it has been compromised.

---

## Running the Server

```bash
# Development (hot reload via nodemon)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:5000` (or your configured `PORT`).

---

## API Reference

**Base URL (local):** `http://localhost:5000`

All endpoints accept and return `application/json`.

---

### POST `/send`

Sends a contact form submission as an email to the club administrators via the Resend API.

**Authentication:** None

**Request Body**

```json
{
  "name": "Ayush Anand",
  "email": "ayush@example.com",
  "message": "Hi, I'd like to join the club!"
}
```

| Field     | Type   | Required | Description                         |
|-----------|--------|----------|-------------------------------------|
| `name`    | string | Yes      | Full name of the sender             |
| `email`   | string | Yes      | Reply-to email address of the sender|
| `message` | string | Yes      | Body of the message                 |

**Success Response — `200 OK`**

```json
{
  "success": true
}
```

**Error Responses**

| Status | Condition                  | Response Body                          |
|--------|----------------------------|----------------------------------------|
| `400`  | One or more fields missing | `{ "error": "All fields required" }`   |
| `500`  | Resend API failure         | `{ "error": "Email failed to send" }` |

**Email Delivery Details**

- **From:** `Byte Club <onboarding@resend.dev>`
- **To:** `diwakarsharma1327@gmail.com` (hardcoded admin inbox)
- **Subject:** `New Message from {name}`
- **Body:** HTML-formatted with name, email, and message

---

### GET `/blog`

Returns all blog posts that have been published (`is_published = true`), sorted by creation date (newest first).

**Authentication:** None

**Request Body:** None

**Success Response — `200 OK`**

```json
[
  {
    "blog_id": 1,
    "title": "Introduction to Open Source",
    "content": "Open source is...",
    "created_at": "2026-05-10T14:32:00.000Z",
    "full_name": "Byte Club"
  }
]
```

| Field        | Type   | Description                               |
|--------------|--------|-------------------------------------------|
| `blog_id`    | number | Unique identifier for the blog post       |
| `title`      | string | Title of the blog post                    |
| `content`    | string | Full body content of the post             |
| `created_at` | string | ISO 8601 timestamp of when it was created |
| `full_name`  | string | Always `"Byte Club"` (author display name)|

**Error Response**

| Status | Condition          | Response Body                         |
|--------|--------------------|---------------------------------------|
| `500`  | Supabase DB error  | `{ "error": "Failed to fetch blogs" }`|

---

### POST `/login`

Authenticates an admin user with a username and password. Returns a static token used to authorize subsequent admin operations.

**Authentication:** None (this is the authentication endpoint)

**Request Body**

```json
{
  "username": "admin",
  "password": "your_admin_password"
}
```

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `username` | string | Yes      | Admin username       |
| `password` | string | Yes      | Admin password       |

**Success Response — `200 OK`**

```json
{
  "token": "somesecrettoken123"
}
```

The `token` value is the `ADMIN_TOKEN` environment variable. Store it in `sessionStorage` on the client and include it as a `Bearer` token in calls to `/admin`.

**Error Response**

| Status | Condition              | Response Body                       |
|--------|------------------------|-------------------------------------|
| `401`  | Wrong username/password| `{ "error": "Invalid credentials" }`|

---

### POST `/admin`

Performs create, update, or delete operations on blog posts in the Supabase database. The `action` field in the request body determines which operation is performed.

**Authentication:** Required  
Include the token from `/login` in the `Authorization` header:

```
Authorization: Bearer somesecrettoken123
```

> **Note:** The server currently reads the `Authorization` header but does not strictly validate the token value in code. This is a known area for improvement — full token validation should be added before production hardening.

---

#### Action: `"create"`

Creates a new blog post.

**Request Body**

```json
{
  "action": "create",
  "title": "My New Post",
  "content": "This is the content...",
  "is_published": false,
  "author_id": null
}
```

| Field          | Type    | Required | Description                                      |
|----------------|---------|----------|--------------------------------------------------|
| `action`       | string  | Yes      | Must be `"create"`                               |
| `title`        | string  | Yes      | Title of the post                                |
| `content`      | string  | Yes      | Body content of the post                         |
| `is_published` | boolean | No       | Whether to publish immediately (defaults to `false`) |
| `author_id`    | any     | No       | Author reference (defaults to `null`)            |

**Success Response — `201 Created`**

```json
{
  "success": true,
  "blog": {
    "blog_id": 5,
    "title": "My New Post",
    "content": "This is the content...",
    "is_published": false,
    "author_id": null,
    "created_at": "2026-06-06T10:00:00.000Z"
  }
}
```

**Error Response**

| Status | Condition               | Response Body                                  |
|--------|-------------------------|------------------------------------------------|
| `400`  | Missing title or content| `{ "error": "Title and content are required" }`|
| `500`  | Supabase insert error   | `{ "error": "Admin action failed", "details": "..." }` |

---

#### Action: `"update"`

Updates an existing blog post by `blog_id`. Only the fields provided are updated (partial updates supported).

**Request Body**

```json
{
  "action": "update",
  "blog_id": 5,
  "title": "Updated Title",
  "content": "Updated content...",
  "is_published": true
}
```

| Field          | Type    | Required | Description                                   |
|----------------|---------|----------|-----------------------------------------------|
| `action`       | string  | Yes      | Must be `"update"`                            |
| `blog_id`      | any     | Yes      | ID of the blog post to update                 |
| `title`        | string  | No       | New title (omit to leave unchanged)           |
| `content`      | string  | No       | New content (omit to leave unchanged)         |
| `is_published` | boolean | No       | New publish status (omit to leave unchanged)  |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "blog": {
    "blog_id": 5,
    "title": "Updated Title",
    "content": "Updated content...",
    "is_published": true,
    "created_at": "2026-06-06T10:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Condition             | Response Body                                        |
|--------|-----------------------|------------------------------------------------------|
| `400`  | `blog_id` missing     | `{ "error": "blog_id is required for update" }`      |
| `500`  | Supabase update error | `{ "error": "Admin action failed", "details": "..." }` |

---

#### Action: `"delete"`

Permanently deletes a blog post by `blog_id`.

**Request Body**

```json
{
  "action": "delete",
  "blog_id": 5
}
```

| Field     | Type | Required | Description                     |
|-----------|------|----------|---------------------------------|
| `action`  | string | Yes    | Must be `"delete"`              |
| `blog_id` | any  | Yes      | ID of the blog post to delete   |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

**Error Responses**

| Status | Condition             | Response Body                                        |
|--------|-----------------------|------------------------------------------------------|
| `400`  | `blog_id` missing     | `{ "error": "blog_id is required for delete" }`      |
| `400`  | Invalid action string | `{ "error": "Invalid action. Use 'create', 'update', or 'delete'" }` |
| `500`  | Supabase delete error | `{ "error": "Admin action failed", "details": "..." }` |

---

## Database Schema

### Supabase — `blogs` table

```sql
CREATE TABLE blogs (
  blog_id     SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  author_id   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

The server uses `SUPABASE_SERVICE_ROLE_KEY` to connect, which bypasses Supabase Row Level Security (RLS). If you want to enable RLS, switch the client to use `SUPABASE_ANON_KEY` and configure appropriate policies.

---

## Error Codes

| HTTP Status | Meaning                               |
|-------------|---------------------------------------|
| `200`       | Success                               |
| `201`       | Resource created successfully         |
| `400`       | Bad request — missing or invalid data |
| `401`       | Unauthorized — wrong credentials      |
| `500`       | Internal server error                 |

---

## Security

### Known Issues & Recommendations

1. **Static token auth** — The `/admin` endpoint uses a static `ADMIN_TOKEN` string. Replace this with signed JWT tokens (`jsonwebtoken` package) with expiry for production use.

2. **Service role key** — The `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS policies. Always keep this server-side only. Never expose it in client code or public repositories.

3. **Hardcoded recipient email** — The `/send` endpoint sends all contact messages to a single hardcoded address (`diwakarsharma1327@gmail.com`). Move this to an environment variable (`CONTACT_EMAIL`) for flexibility.

4. **No rate limiting** — Consider adding `express-rate-limit` to prevent abuse of the `/send` and `/login` endpoints.

5. **Input sanitization** — The `name`, `email`, and `message` fields in `/send` are injected directly into HTML. Sanitize or escape user input before placing it in email bodies to prevent HTML injection.

6. **CORS** — Currently locked to `https://byte2026.vercel.app`. Update `origin` in `server.js` when changing the frontend domain.
