import "./globals.css";


import Hero from "./components/Hero";
import UpcomingEvents from "./components/UpcomingEvents";
import PastEvents from "./components/PastEvents";
import TeamLeads from "./components/TeamLeads";
import CoreTeams from "./components/CoreTeams";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactForm";
import NewCard from "./components/About";
import StoryCorridor from "./components/StoryCorridor";
import ChapterMarker from "./components/ChapterMarker";
import BlogTeaser from "./components/BlogTeaser";
import Countdown from "./components/CountDowntimer";
import GooeyNav from "./components/Navbar";
import ScrollRing from "./components/ScrollRing";
import SplitFlapText from "@/components/SplitFlapText";
import {
  Home as HomeIcon,
  Calendar,
  Users,
  History,
  BookOpen,
  Mail,
  Info,
} from "lucide-react";

const SECTION_LABEL_PROPS = {
  flipDuration: 0.1,
  stagger: 0.04,
  cycleDelay: 3200,
  charset: "alphanumeric" as const,
  flipsPerChar: 6,
  tileColor: "#101317",
  textColor: "#5fe3c8",
  tileRadius: "clamp(4px, 0.6vw, 7px)",
  gap: "clamp(2px, 0.4vw, 5px)",
  loop: true,
};

const navItems = [
  { label: "Home", href: "#home", icon: <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Story", href: "#idea", icon: <Info className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Events", href: "#info", icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Leads", href: "#cores", icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Past Events", href: "#pastevents", icon: <History className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Blogs", href: "#blogs", icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Contact", href: "#write", icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" /> },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ color: "var(--ink)" }}>
      <StoryCorridor />

      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none pt-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="pointer-events-auto">
            <ScrollRing />
          </div>
          <div className="pointer-events-auto flex-1 flex justify-center">
            <GooeyNav
              items={navItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
          <a
            href="#write"
            className="pointer-events-auto hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-xs font-semibold shrink-0"
            style={{ background: "var(--ink)", color: "var(--bg)", fontFamily: "var(--font-body)" }}
          >
            Join
          </a>
        </div>
      </div>


      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* ───────────────── HOME ───────────────── */}
        <Hero />

        <ChapterMarker index="01" title="Why We Exist" />

        {/* ───────────────── STORY ───────────────── */}
        <section
          id="idea"
          className="w-full py-12 sm:py-16 md:py-20 flex flex-col items-center"
        >
          <div className="mb-10 sm:mb-14">
            <SplitFlapText
              words={["WHO WE ARE", "OUR STORY", "WHY BYTE CLUB"]}
              {...SECTION_LABEL_PROPS}
              fontSize="clamp(20px, 3.4vw, 36px)"
              padTo={13}
            />
          </div>

          <NewCard />
        </section>

        <ChapterMarker index="02" title="What We Do" />

        {/* ───────────────── EVENTS SECTION ───────────────── */}
        <section
          id="info"
          className="w-full py-12 sm:py-16 md:py-20 flex flex-col lg:flex-row items-start justify-between gap-10 sm:gap-16"
        >

          {/* Upcoming Events */}
          <div className="w-full lg:w-2/3">

            <div className="mb-8 sm:mb-12">
              <SplitFlapText
                words={["UPCOMING EVENTS", "LEARN BY DOING", "SHOW UP + BUILD"]}
                {...SECTION_LABEL_PROPS}
                fontSize="clamp(20px, 3.4vw, 36px)"
                padTo={15}
              />
            </div>

            <UpcomingEvents />
          </div>

          {/* Countdown */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end">

            <div className="mb-8 sm:mb-10 text-center lg:text-right w-full">
              <SplitFlapText
                words={["NEXT SESSION", "CLOCK'S TICKING", "BE THERE"]}
                {...SECTION_LABEL_PROPS}
                fontSize="clamp(18px, 2.8vw, 30px)"
                padTo={15}
              />
            </div>

            <Countdown targetDate="2026-04-08T14:30:00" />
          </div>

        </section>

        <ChapterMarker index="03" title="Who's Behind It" />

        {/* ───────────────── OUR LEADS ───────────────── */}
        <section id="cores" className="w-full py-12 sm:py-16 md:py-20">

          <div className="flex justify-center mb-10 sm:mb-14">
            <SplitFlapText
              words={["THE LEADS", "WHO RUNS THIS", "MEET THE TEAM"]}
              {...SECTION_LABEL_PROPS}
              fontSize="clamp(20px, 3.4vw, 36px)"
              padTo={18}
            />
          </div>

          <TeamLeads />
        </section>

        {/* ───────────────── CORE TEAMS ───────────────── */}
        <section className="w-full py-12 sm:py-16 md:py-20">

          <div className="flex justify-center mb-10 sm:mb-14">
            <SplitFlapText
              words={["CORE TEAMS", "TECH · OPS · CREATIVE", "THE PEOPLE BEHIND IT"]}
              {...SECTION_LABEL_PROPS}
              fontSize="clamp(20px, 3.4vw, 36px)"
              padTo={21}
            />
          </div>

          <CoreTeams />
        </section>

        <ChapterMarker index="04" title="Where We've Been" />

        {/* ───────────────── PAST EVENTS ───────────────── */}
        <section id="pastevents" className="w-full py-12 sm:py-16 md:py-20">
          <PastEvents />
        </section>

        {/* ───────────────── BLOGS ───────────────── */}
        <section id="blogs" className="w-full py-12 sm:py-16 md:py-20">

          <div className="flex justify-center mb-10 sm:mb-14">
            <SplitFlapText
              words={["FROM THE CLUB", "BYTE BLOG", "WHAT WE'RE WRITING"]}
              {...SECTION_LABEL_PROPS}
              fontSize="clamp(20px, 3.4vw, 36px)"
              padTo={18}
            />
          </div>

          <BlogTeaser />
        </section>

        <ChapterMarker
          index="05"
          title="Join The Loop"
          quote="You don't need to already know how to code. You just need to show up."
        />

        {/* ───────────────── CONTACT ───────────────── */}
        <section
          id="write"
          className="w-full py-12 sm:py-16 md:py-20 flex flex-col items-center"
        >

          <div className="mb-10 sm:mb-14">
            <SplitFlapText
              words={["SAY HELLO", "GET IN TOUCH", "JOIN THE CLUB"]}
              {...SECTION_LABEL_PROPS}
              fontSize="clamp(20px, 3.4vw, 36px)"
              padTo={14}
            />
          </div>

          <ContactForm />
        </section>

      </div>

      {/* ───────────────── FOOTER ───────────────── */}
      <section className="mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </section>

    </div>
  );
}
