import Hero from "./components/Hero";
import About from "./components/About";
import EventsBoard from "./components/EventsBoard";
import TeamLeads from "./components/TeamLeads";
import CoreTeams from "./components/CoreTeams";
import PastEvents from "./components/PastEvents";
import BlogTeaser from "./components/BlogTeaser";
import Join from "./components/Join";
import Footer from "./components/Footer";
import StoryCorridor from "./components/StoryCorridor";
import SiteNav from "./components/SiteNav";
import { readPosts } from "@/lib/posts";

export default function Home() {
  // Build time. Client components start from this so the first render
  // matches the server HTML, then switch to the visitor's clock.
  const builtAt = Date.now();
  const latestPosts = readPosts()
    .slice(0, 3)
    .map(({ slug, title, category, date }) => ({ slug, title, category, date }));

  return (
    <div className="relative min-h-screen" style={{ color: "var(--ink)" }}>
      <StoryCorridor />
      <SiteNav />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
        <Hero builtAt={builtAt} />
        <About />
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

        <PastEvents />
        <BlogTeaser posts={latestPosts} />
        <Join />
      </main>

      <Footer />
    </div>
  );
}
