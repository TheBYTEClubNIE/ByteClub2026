import Hero from "./components/Hero";
import About from "./components/About";
import EventsBoard from "./components/EventsBoard";
import TeamLeads from "./components/TeamLeads";
import CoreTeams from "./components/CoreTeams";
import PastEvents from "./components/PastEvents";
import BlogTeaser from "./components/BlogTeaser";
import ByteId from "./components/ByteId";
import Bytle from "./components/Bytle";
import Join from "./components/Join";
import Footer from "./components/Footer";
import StoryCorridor from "./components/StoryCorridor";
import SiteNav from "./components/SiteNav";
import { KineticBand } from "./components/effects";
import { excerpt, readPosts } from "@/lib/posts";

const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12";

export default function Home() {
  // Build time. Client components start from this so the first render
  // matches the server HTML, then switch to the visitor's clock.
  const builtAt = Date.now();
  const posts = readPosts().map(({ slug, title, category, date, minutes, content }) => ({
    slug,
    title,
    category,
    date,
    minutes,
    excerpt: excerpt(content),
  }));

  return (
    <div className="relative min-h-screen" style={{ color: "var(--ink)" }}>
      <StoryCorridor />
      <SiteNav />

      <main>
        <div className={CONTAINER}>
          <Hero builtAt={builtAt} />
          <About />
        </div>

        <KineticBand items={["Write code", "Build things", "Ship it", "Show up"]} />

        <div className={CONTAINER}>
          <EventsBoard builtAt={builtAt} />

          <section id="team" className="section">
            <header className="section-head">
              <h2 className="section-title">The people behind it</h2>
              <p className="section-lede">
                The leads steer the club; the core team runs tech, management
                and creative. Flip through the book, then meet everyone else.
              </p>
            </header>
            <TeamLeads />
            <CoreTeams />
          </section>
        </div>

        {/* full-bleed: the changelog pins a full-screen stage */}
        <PastEvents />

        <div className={CONTAINER}>
          <BlogTeaser posts={posts} />
          <Bytle />
        </div>

        <KineticBand items={["No experience needed", "All years welcome", "Just show up"]} reverse tilt={1.5} />

        <div className={CONTAINER}>
          <ByteId />
          <Join />
        </div>
      </main>

      <Footer />
    </div>
  );
}
