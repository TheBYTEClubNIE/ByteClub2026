# ByteClub 2026 — Client

The Next.js frontend for the ByteClub official website. Built with React 19, TypeScript, and Tailwind CSS v4, featuring animated backgrounds, a public-facing homepage, and a protected admin panel for blog management.

---

## Table of Contents

- [Stack](#stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Environment & API Configuration](#environment--api-configuration)
- [Running the App](#running-the-app)
- [Pages](#pages)
  - [Homepage `/`](#homepage-)
  - [Admin Panel `/admin`](#admin-panel-admin)
- [Component Reference](#component-reference)
- [API Calls Made by the Client](#api-calls-made-by-the-client)
- [Static Assets](#static-assets)
- [Styling](#styling)
- [Build & Deployment](#build--deployment)

---

## Stack

| Technology        | Version    | Purpose                                     |
|-------------------|------------|---------------------------------------------|
| Next.js           | 16.2.2     | React framework (App Router)                |
| React             | 19.2.4     | UI library                                  |
| TypeScript        | ^5         | Static typing                               |
| Tailwind CSS      | ^4.2.2     | Utility-first styling                       |
| Framer Motion     | ^12.38.0   | Declarative animations                      |
| Three.js          | ^0.183.2   | 3D WebGL rendering (used by Vanta)          |
| Vanta.js          | ^0.5.24    | Animated particle/wave backgrounds          |
| Axios             | ^1.14.0    | HTTP client for API calls                   |
| Lucide React      | ^1.7.0     | Icon library                                |

---

## Project Structure

```
client/
├── app/
│   ├── layout.tsx              # Root layout (wraps all pages)
│   ├── page.tsx                # Homepage — assembles all sections
│   ├── globals.css             # Global CSS reset and base styles
│   ├── config.js               # (Placeholder config file)
│   ├── postcss.config.js       # PostCSS config for Tailwind
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── admin/
│   │   └── page.tsx            # Admin panel (login + dashboard)
│   └── components/
│       ├── AnimatedBackground.tsx  # Vanta.js particle background
│       ├── Navbar.tsx              # Sticky top navigation bar
│       ├── LogoComponent.tsx       # Club logo display
│       ├── FlashCard.tsx           # Rotating highlight cards
│       ├── CountDowntimer.tsx      # Countdown to next event
│       ├── UpcomingEvents.tsx      # Upcoming event listings
│       ├── PastEvents.tsx          # Past events photo gallery
│       ├── About.tsx               # Club about/mission section
│       ├── TeamLeads.tsx           # President, VP & domain leads
│       ├── CoreTeams.tsx           # Tech, Management, Creative teams
│       ├── DisplayCore.tsx         # Team member grid renderer
│       ├── Blog.tsx                # Fetches and displays blog posts
│       ├── ContactForm.tsx         # Contact form with API submission
│       ├── Events.tsx              # Events wrapper component
│       ├── Header.tsx              # Desktop notice/header banner
│       └── Footer.tsx              # Site footer with social links
├── public/
│   ├── Core/
│   │   ├── Tech/                   # Tech team member photos
│   │   ├── Managment/              # Management team member photos
│   │   └── Creativity/             # Creativity team member photos
│   ├── Leads/                      # Team lead photos
│   ├── Events/                     # Event photos and banners
│   └── Logo/                       # Club logo assets
├── next.config.ts              # Next.js configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
└── package.json
```

---

## Setup

```bash
cd client
npm install
```

---


### Switching to a local backend during development

To point the frontend at your locally running server (`http://localhost:5000`), update the URL in each component:

**`ContactForm.tsx`** — line with `axios.post(...)`:
```ts
await axios.post("http://localhost:5000/send", form);
```

**`Blog.tsx`** — line with `axios.get(...)`:
```ts
const res = await axios.get("http://localhost:5000/blog");
```

**`admin/page.tsx`** — top of file:
```ts
const API = "http://localhost:5000";
```

> A cleaner approach for future maintainability is to add `NEXT_PUBLIC_API_URL` to a `.env.local` file and reference it as `process.env.NEXT_PUBLIC_API_URL` in all three components.

---

## Running the App

```bash
# Development (hot reload at http://localhost:3000)
npm run dev

# Production build check
npm run build

# Serve production build locally
npm start

# Lint
npm run lint
```

---

## Pages

### Homepage `/`

**File:** `app/page.tsx`

The homepage is a single-page layout that renders all website sections sequentially. It is a **Server Component** (no `"use client"` directive) that imports and composes all section components.

**Section render order:**

```
<DesktopNotice />       ← Desktop-only notice banner
<StaticSpaceBackground />  ← Vanta.js animated background
<Navbar />              ← Sticky navigation
<ModernImage />         ← Club logo
<Countdown />           ← Event countdown timer
<FlashCard />           ← Rotating highlight cards
<UpcomingEvents />      ← Upcoming event cards
<NewCard />             ← About section
<PastEvents />          ← Past events gallery
<TeamLeads />           ← Club leadership profiles
<CoreTeams />           ← All team members
<BlogsPage />           ← Live blog feed
<ContactForm />         ← Contact us form
<Footer />              ← Footer
```

---

### Admin Panel `/admin`

**File:** `app/admin/page.tsx`  
**Directive:** `"use client"` (fully client-side rendered)

A protected single-page admin panel with two views:

#### Login View

Displayed when no valid session token exists. Submits credentials to `POST /login` on the backend.

- Shows a shake animation on failed login
- On success, saves the returned token to `sessionStorage` under the key `admin_token`
- Automatically restores session from `sessionStorage` on page reload

#### Dashboard View

Shown after a successful login. Features:

- **Blog list** — Fetches all blogs from `GET /blog` and lists them with title, date, publish status, edit, and delete actions
- **Create post** — Opens an editor modal; submits to `POST /admin` with `action: "create"`
- **Edit post** — Populates the editor with existing post data; submits to `POST /admin` with `action: "update"`
- **Publish/Unpublish toggle** — Updates `is_published` via `POST /admin` with `action: "update"`
- **Delete post** — Shows a confirmation prompt; submits to `POST /admin` with `action: "delete"`
- **Toast notifications** — Brief success/error messages shown after each API action
- **Logout** — Clears `sessionStorage` and returns to the login screen

**Session storage key:**

```
Key:   admin_token
Value: token string returned by POST /login
```

---

## Component Reference

### `AnimatedBackground.tsx`
Renders a full-screen Vanta.js particle animation (using Three.js). Positioned absolutely behind all page content. Does not accept props.

---

### `Navbar.tsx`
Sticky navigation bar at the top of the page. Contains the club logo and navigation links to page sections (About, Events, Team, Blog, Contact). Includes a mobile hamburger menu.

---

### `LogoComponent.tsx`
Displays the Byte Club logo image (`/Logo/blue.webp`) with optional animation. Used as the hero element at the top of the homepage.

---

### `FlashCard.tsx`
A rotating card carousel that highlights key club features or announcements. Fully client-side with auto-rotation. Uses Framer Motion for transitions.

---

### `CountDowntimer.tsx`
Displays a live countdown (days, hours, minutes, seconds) to a hardcoded upcoming event date. Client-side component using `setInterval`.

---

### `UpcomingEvents.tsx`
Renders a list of upcoming events from a **hardcoded static array** (`EVENTS`) defined inside the component. Each event card links out to an external Google Form for registration.

**Current event data (hardcoded):**

| Field    | Value                          |
|----------|--------------------------------|
| Name     | Beyond The Labs                |
| Location | North Auditorium               |
| Time     | 8th April, 2:30 PM – 4:30 PM  |
| Link     | Google Form registration link  |

> To add or edit upcoming events, update the `EVENTS` array directly in `UpcomingEvents.tsx`.

---

### `PastEvents.tsx`
A photo gallery of previous club events, sourced from images in `public/Events/`. Supports a lightbox-style expanded view. Images are statically referenced.

---

### `About.tsx`
Describes the club's mission, vision, and activity areas. Purely static content styled as an info card.

---

### `TeamLeads.tsx`
Displays the club's leadership team — President, Vice-President, and domain leads (Tech, Management, Creative, Sponsorship). Data and photos are hardcoded in the component. Photos are sourced from `public/Leads/`.

---

### `CoreTeams.tsx`
Renders a tabbed selector for the three teams: **Tech**, **Management**, and **Creative**. Clicking a team label expands to show the team members via `DisplayCore.tsx`. Team data (names, roles, photo paths) is hardcoded.

---

### `DisplayCore.tsx`
A reusable grid renderer used by `CoreTeams.tsx`. Accepts an array of team member objects and renders a photo grid with names and roles. Photos are sourced from `public/Core/{team}/`.

---

### `Blog.tsx`

**API call:** 

Fetches and displays published blog posts on page load. Each post is rendered as an expandable card showing the title, author ("Byte Club"), date, and full content on expansion.

**State:**

| State     | Type     | Description                            |
|-----------|----------|----------------------------------------|
| `blogs`   | `Blog[]` | Array of blog posts from the API       |
| `loading` | boolean  | Shows a loading state during fetch     |

**Blog object type:**

```ts
interface Blog {
  blog_id: number;
  title: string;
  content: string;
  created_at: string;
  full_name: string;  // Always "Byte Club"
}
```

---

### `ContactForm.tsx`


A contact form with three fields: **Name**, **Email**, and **Message**. Submits via `axios.post()` to the server's `/send` endpoint.

**State:**

| State    | Type     | Values                                    |
|----------|----------|-------------------------------------------|
| `form`   | object   | `{ name, email, message }`               |
| `status` | string   | `null` · `"sending"` · `"success"` · `"error"` |

**UX behaviors:**
- Button is disabled and shows "TRANSMITTING..." while the request is in flight
- On success: form fields clear, success message displayed
- On error: error message displayed with retry option

---

### `Events.tsx`
A lightweight wrapper component. Renders its children (used for layout grouping). Currently minimal.

---

### `Header.tsx`
A desktop-only notice banner rendered at the very top of the page (above the navbar). Typically shows a brief announcement or "best viewed on desktop" notice.

---

### `Footer.tsx`
Site footer containing social media links (GitHub, LinkedIn, Instagram), copyright notice, and the club tagline.

---

## API Calls Made by the Client

| Component       | Method | Endpoint                                    | Trigger              |
|-----------------|--------|---------------------------------------------|----------------------|
| `Blog.tsx`      | GET    | `/blog`                                     | On component mount   |
| `ContactForm.tsx`| POST  | `/send`                                     | On form submit       |
| `admin/page.tsx`| POST   | `/login`                                    | On login form submit |
| `admin/page.tsx`| GET    | `/blog`                                     | On dashboard mount   |
| `admin/page.tsx`| POST   | `/admin` (`action: "create"`)               | On create form save  |
| `admin/page.tsx`| POST   | `/admin` (`action: "update"`)               | On edit form save    |
| `admin/page.tsx`| POST   | `/admin` (`action: "update"`, publish toggle)| On publish toggle   |
| `admin/page.tsx`| POST   | `/admin` (`action: "delete"`)               | On delete confirm    |

---

## Static Assets

All static files live under `public/` and are accessible at `/` in the browser.

| Directory             | Contents                              |
|-----------------------|---------------------------------------|
| `public/Logo/`        | Club logo (`blue.webp`)               |
| `public/Leads/`       | President, VP, and domain lead photos |
| `public/Core/Tech/`   | Tech team member photos               |
| `public/Core/Managment/` | Management team member photos      |
| `public/Core/Creativity/` | Creative team member photos       |
| `public/Events/`      | Past event photos and banners         |

---

## Styling

- **Tailwind CSS v4** is the primary styling system for layout and utility classes.
- Many components use **inline styles** and **CSS-in-JS** (`<style>` tags inside JSX) for component-specific animations and visual effects.
- **Framer Motion** handles transitions and entrance animations.
- **Vanta.js** + **Three.js** power the full-screen animated background.
- Custom fonts are loaded from **Google Fonts** (`Orbitron`, `Share Tech Mono`, `DM Sans`, `Sora`) via `<link>` tags inside component `<style>` blocks.

---

## Build & Deployment

The client is deployed to **Vercel** and auto-deploys from the `main` branch.

```bash
# Verify the build passes before pushing
npm run build
```

**Next.js configuration (`next.config.ts`)** — Currently minimal (no custom rewrites or image domains configured). The `webpack` externals override in `app/config.js` excludes the `canvas` package to prevent SSR issues with Vanta.js.

**CORS note:** The backend only allows requests from `https://byte2026.vercel.app`. If you deploy the frontend under a different Vercel URL (e.g., a preview deployment), API calls will be blocked by CORS. Update the server's `origin` config accordingly.
