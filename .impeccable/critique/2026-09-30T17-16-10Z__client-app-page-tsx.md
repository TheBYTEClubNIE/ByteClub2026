---
target: homepage
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\DELL\\Desktop\\Projects\\byte-club-website-2k26\\client\\app\\page.tsx"
target_fingerprint: "sha256:17404f1da87b8c80ced15402a45880344f892a5c2857e953272d1249111ddc0c"
target_path: "C:\\Users\\DELL\\Desktop\\Projects\\byte-club-website-2k26\\client\\app\\page.tsx"
timestamp: 2026-09-30T17-16-10Z
slug: client-app-page-tsx
---
⚠️ DEGRADED: single-context (sub-agents are only spawned here when you explicitly ask; the in-browser overlay also failed to start, so there's no overlay)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | The countdown sits at 00:00:00:00 under a "NEXT SESSION" label, for an event that already happened |
| 2 | Match System / Real World | 3 | Plain copy overall; "0 / 8 leaves" is book jargon, and the nav is icon-only |
| 3 | User Control and Freedom | 2 | Blog posts have no URL: the back button leaves /blog, and refreshing loses the post |
| 4 | Consistency and Standards | 2 | Each section has a different interaction model; "MEET THE TEAM" labels two different sections |
| 5 | Error Prevention | 3 | The form has good guards, but arrow keys typed in the message box also flip the leads book |
| 6 | Recognition Rather Than Recall | 2 | Icon-only nav with desktop-only tooltips; leads and posts are hidden behind taps |
| 7 | Flexibility and Efficiency | n/a | Doesn't apply to a landing page |
| 8 | Aesthetic and Minimalist Design | 2 | Strong base look, but decorative motion everywhere and three headers per section |
| 9 | Error Recovery | 2 | "Something went wrong. Please try again." gives no cause and no fallback (input is kept, which is good) |
| 10 | Help and Documentation | n/a | Doesn't apply to a landing page |
| **Total** | | **18/32 (56%)** | **Acceptable** |

Cognitive load: 3 of 8 checks fail. Competing motion breaks single focus, section headers are stacked three deep, and the nav has 7 icons while the leads have 8 pills.

## Design Specificity Verdict

Review: The site has real brand moments that are its own. The logo globe that shrinks into the nav ring, the leadership "directory book" and the blog "bookshelf" are specific to the Byte Club. But it's built from seven different showcase components: particle globe, departure-board labels, flip card, 3D page-flip book, scroll-jacked galleries, 3D photo carousels and a 3D shelf. Each section invents a new toy, so the whole thing reads as a component gallery rather than one designed world. The dark background with cyan accents and floating wireframes is also the default look for tech clubs. The strongest brand idea (bytes and binary, from the logo) barely shows up outside the logo itself.

Detector: 5 warnings, all "bounce easing". One is in Navbar.tsx, which is dead code. The other 4 are on /blog detail-panel buttons that never render. Nothing affects users. The code-level craft is clean, so the real problems are structural, which a detector can't catch.

Visual overlays: None. The overlay server reported no port, so the injection never ran.

## Overall Impression

The first screen lands: big confident type plus the logo globe is a genuine moment. After that, the page spends its energy on effects and hides the club's real assets, its people and its events. The single biggest opportunity is making it obvious in 30 seconds that the club is active and how to join. Right now it signals the opposite.

## What's Working

- The hero hand-off: the logo globe bursting and shrinking into the nav's scroll ring is the one transition that could only belong to this club.
- Books as a metaphor: a leadership directory and a blog shelf fit a club that reads, writes and builds. It's memorable.
- A disciplined system underneath: shared colour tokens, corner-bracket cards, mono labels and a single accent family make it feel deliberate, not like a template.

## Priority Issues

[P1] The most important section says "inactive".
- What: "What We Do" shows a past event with "Registration closed" and a countdown frozen at 00:00:00:00. The hero's second button, "See Upcoming Events", sends people straight to it.
- Why it matters: a first-year deciding whether the club is alive reads this as dead.
- Fix: keep events in one data file, like the blog .md files. When nothing is upcoming, show a "Next drop" state (what's coming and roughly when) with a "Get notified" link to the WhatsApp community. Ended events move to Past Events automatically.
- Command: /impeccable harden, then /impeccable clarify

[P1] "Join the Club" has no actual join path.
- What: both "Join the Club" and the nav's "Join" pill jump to a generic contact form ("Got a question, idea, or want to join?"). On phones the "Join" pill is hidden entirely.
- Why it matters: joining is the site's number one goal, and a message box makes the student invent the next step and then wait for a reply.
- Fix: a Join section with three steps, with step 1 as the main button: (1) join the WhatsApp or Discord community, (2) follow on Instagram, (3) come to the next event. Add a persistent "Join" bar at the bottom of the screen on mobile. Keep the contact form for questions only.
- Command: /impeccable onboard

[P1] Nothing can be shared well.
- What: the site has no social preview tags (only a description), so links pasted into WhatsApp, Instagram or LinkedIn show no preview card. Blog posts have no URL of their own. There's also no custom 404 page.
- Why it matters: a student club grows through shared links, and every share today is a bare URL.
- Fix: give each post its own page at /blog/[slug] with its own metadata and a generated preview image, add a site-wide preview image, and build a branded 404.
- Command: /impeccable harden

[P1] Too many effects, and they hide the people and the work.
- What: the 7 leads take 8 page-flips to see, the 20 members sit in sideways scrollers, each event's photos are buried in a carousel, and a blog post is two taps deep.
- Why it matters: a visitor sees almost none of the club at a glance.
- Fix: keep one signature effect (the logo globe and binary identity) and let content lead everywhere else: leads as a grid of faces that expands in place; members as a dense wall of faces; each event as one full-width photo with a "view gallery" link.
- Command: /impeccable distill

[P2] Accessibility and readability gaps.
- What: nav links are icon-only with no accessible name (floating-dock.tsx:112). Small 10–11px labels in #5b6167 on #0a0b0d have ~3.1:1 contrast; the accessibility standard (WCAG AA) needs 4.5:1. The split-flap labels loop forever, so section names change while you read and show garbage mid-flip ("MEOT THE TEAM"). Framer Motion animations ignore the phone's reduced-motion setting. The page-flip book listens for arrow keys on the whole page.
- Fix: a labelled bottom tab bar on mobile with at most 5 items; labels at least 12px with at least 4.5:1 contrast; split-flaps flip once when they come into view, then hold; wrap the app in <MotionConfig reducedMotion="user">; only listen for arrow keys when the book is focused.
- Command: /impeccable adapt, then /impeccable audit

## Persona Red Flags

Jordan (first-year, first visit):
- On a phone, can't tell "Events" from "Past Events", because the calendar and clock icons have no labels.
- "See Upcoming Events" shows "Registration closed" and 00:00:00:00, so Jordan decides nothing is happening.
- "Join the Club" opens a message box, and Jordan doesn't know what to write.

Casey (phone, one hand, mobile data):
- The "Join" pill is hidden on phones, and the nav sits at the top, out of thumb reach.
- Seeing all 7 leads takes 8 taps on "Next Page".
- 10px grey labels are hard to read outdoors.

Riley (tries to break things):
- Opens a post, presses back, and leaves /blog entirely. Refreshing loses the post, and there's no link to share it.
- Arrow keys typed in the message box flip the leads book.
- A post created in /admin never appears on /blog. The admin panel still writes to the database, but the shelf now reads .md files, so the feature looks like it works and silently doesn't.

## Minor Observations

- Every section has three headers stacked: the chapter marker ("03 Who's Behind It"), the split-flap label ("THE LEADS") and the card title ("Leadership Directory").
- Footer quick links (Home, Events, Team) don't match the nav's 7 sections.
- /admin has its own "cyber" look with glows and different fonts.
- Dead files are still in the repo: Navbar.tsx, GooeyNav.tsx, AnimatedBackground.tsx and LogoComponent.tsx.
- "0 / 8 leaves" would read better as "Lead 1 of 7".

## Bold Directions (the out-of-the-box part)

1. Members are the globe. Each point in the logo globe is a real member: tap one to see a name, and the globe grows as people join. Brand and social proof in one.
2. Events as a real departures board. You already have split-flap tiles, so make them the events section instead of decoration: BTL-02 · BEYOND THE LABS · 14:30 · NORTH AUD · BOARDING. Registration becomes a "boarding pass" with Add to Calendar, and past events become "Arrivals".
3. $ join byteclub. A terminal-style join flow in the hero, with tappable commands on mobile. It asks for year and interest (web, ML, AI, open source) and sends each student to the right group.
4. "What we're shipping." A strip of live GitHub activity from the club org. For a dev club this is the strongest proof of being active.
5. Share cards. Auto-generated preview images per event and per post ("I'm going to Beyond The Labs"), sized for Instagram stories.

## Questions to Consider

- What if the homepage had one job: getting a first-year into the WhatsApp community in under 30 seconds?
- Does a student need to flip 8 pages to see 7 faces?
- If you could keep only one "wow" moment, which one is the Byte Club's?
- What does the site say in a week with no upcoming event, and is that most weeks?
