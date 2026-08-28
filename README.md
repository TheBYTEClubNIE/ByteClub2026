# ByteClub 2026 — Official Website

The official website for **The Byte Club**, a technical and creative student organization. The project is a full-stack monorepo with a **Next.js** frontend (client) and an **Express.js** backend (server), deployed on Vercel and Render respectively.

---

## Repository Structure

```
ByteClub2026/
├── client/          # Next.js 16 frontend (React 19, TypeScript, Tailwind CSS)
└── server/          # Express.js backend (Node.js, Supabase, Resend)
```

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Animations| Framer Motion, Vanta.js, Three.js               |
| Backend   | Express.js v5, Node.js                          |
| Database  | Supabase (PostgreSQL)                           |
| Email     | Resend API                                      |
| Deployment| Vercel (client), Render (server)                |

---



---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- A Supabase project with a `blogs` table
- A Resend account and API key

### Clone the repository

```bash
git clone https://github.com/your-org/ByteClub2026.git
cd ByteClub2026
```

### Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### Environment setup

Create a `.env` file inside `server/` (see `server/README.md` for full details):

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
ADMIN_TOKEN=your_secret_token
PORT=5000
```

### Run locally (both services)

Open two terminals:

```bash
# Terminal 1 — start the backend
cd server
npm run dev        # uses nodemon for hot reload

# Terminal 2 — start the frontend
cd client
npm run dev        # starts Next.js on http://localhost:3000
```


---

## API Overview

The backend exposes four REST endpoints. All request and response bodies use JSON.

| Method | Endpoint  | Auth Required | Purpose                              |
|--------|-----------|:-------------:|--------------------------------------|
| `POST` | `/send`   | No            | Submit a contact form message        |
| `GET`  | `/blog`   | No            | Fetch all published blog posts       |
| `POST` | `/login`  | No            | Authenticate as admin; receive token |
| `POST` | `/admin`  | Yes (Bearer)  | Create, update, or delete blog posts |

See `server/README.md` for full request/response schemas.

---

## Supabase Database Schema

### `blogs` table

| Column        | Type        | Description                          |
|---------------|-------------|--------------------------------------|
| `blog_id`     | `int` / PK  | Auto-incremented primary key         |
| `title`       | `text`      | Title of the blog post               |
| `content`     | `text`      | Body content of the blog post        |
| `is_published`| `boolean`   | Whether the post is publicly visible |
| `author_id`   | `text/uuid` | Reference to the author (optional)   |
| `created_at`  | `timestamp` | Auto-set on insert                   |

---

## Website Sections

The homepage (`/`) renders the following sections in order:

1. **Navbar** — sticky top navigation
2. **Animated Background** — Vanta.js / Three.js particle effect
3. **Hero / Logo** — club logo and tagline
4. **Countdown Timer** — countdown to the next major event
5. **Flash Card** — rotating highlight cards
6. **Upcoming Events** — live event listings with registration links
7. **Past Events** — photo gallery of previous events
8. **About** — club mission and description
9. **Team Leads** — president, VP, and domain leads with photos
10. **Core Teams** — Tech, Management, and Creative team members
11. **Blog** — published articles fetched live from the backend
12. **Contact Form** — sends messages via the `/send` API endpoint
13. **Footer** — social links and credits

The **Admin Panel** is accessible at `/admin`:

- Password-protected login screen
- Dashboard to create, edit, publish/unpublish, and delete blog posts

---

## CORS Policy

The server allows requests **only** from `https://byte2026.vercel.app`. If you deploy the frontend under a different domain, update the `origin` value in `server/server.js`:

```js
app.use(cors({
  origin: "https://your-frontend-domain.com",
  credentials: true,
}));
```

---

## Deployment

### Client (Vercel)

```bash
cd client
npm run build   # verifies the build before pushing
```

Push to your connected GitHub repo; Vercel auto-deploys on every push to `main`.

### Server (Render)

Set all environment variables in the Render dashboard under **Environment**. The start command is:

```bash
node server.js
```

---

## Security Notes

- **Admin credentials** (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_TOKEN`) must be strong, randomly generated values in production. Never commit `.env` to version control.
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security — keep it server-side only; never expose it to the frontend.
- The `/admin` endpoint currently checks the `Authorization: Bearer <token>` header for structural purposes. For production hardening, replace the static token with JWT-based verification.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request against `main`.

---

## License

MIT — see `LICENSE` for details.
