import "./globals.css";

import Navbar from "./components/Navbar";
import ModernImage from "./components/LogoComponent";
import FlashCard from "./components/FlashCard";
import UpcomingEvents from "./components/UpcomingEvents";
import PastEvents from "./components/PastEvents";
import TeamLeads from "./components/TeamLeads";
import CoreTeams from "./components/CoreTeams";
import Footer from "./components/Footer";
import DesktopNotice from "./components/Header";
import ContactForm from "./components/ContactForm";
import NewCard from "./components/About";
Countdown
import StaticSpaceBackground from "./components/AnimatedBackground";
import BlogsPage from "./components/Blog";
import Countdown from "./components/CountDowntimer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">

      {/* Background */}
      <StaticSpaceBackground />

      {/* Navbar */}
      <div className="p-8"><Navbar /></div>
      

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* ───────────────── HOME ───────────────── */}
        <main
          id="home"
          className="relative flex items-center justify-center min-h-screen py-16 sm:py-20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 w-full">

            {/* Logo */}
            <div className="flex items-center justify-center w-full md:w-1/3">
              <ModernImage />
            </div>

            {/* Hero Card */}
            <div className="flex items-center justify-center w-full md:w-2/3">
              <FlashCard />
            </div>

          </div>
        </main>

        {/* ───────────────── EVENTS SECTION ───────────────── */}
        <section
          id="info"
          className="w-full py-12 sm:py-16 md:py-20 flex flex-col lg:flex-row items-start justify-between gap-10 sm:gap-16"
        >

          {/* Upcoming Events */}
          <div className="w-full lg:w-2/3">

            <div className="mb-8 sm:mb-12">
              <h2
                className="
                  relative inline-block
                  text-3xl sm:text-4xl md:text-5xl
                  font-bold
                  text-white
                  after:content-['']
                  after:absolute
                  after:left-0
                  after:-bottom-2
                  after:h-[3px]
                  after:w-0
                  hover:after:w-full
                  after:bg-cyan-400
                  after:transition-all
                  after:duration-700
                  hover:tracking-wide
                  transition-all
                  duration-500
                "
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow:
                    "0 0 12px rgba(255,255,255,0.22), 0 0 30px rgba(0,212,255,0.15)",
                }}
              >
                Upcoming Events
              </h2>
            </div>

            <UpcomingEvents />
          </div>

          {/* Countdown */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end">

            <div className="mb-8 sm:mb-10 text-center lg:text-right w-full">
              <h2
                className="
                  relative inline-block
                  text-2xl sm:text-3xl md:text-4xl
                  font-bold
                  text-white
                  after:content-['']
                  after:absolute
                  after:left-0
                  after:-bottom-2
                  after:h-[3px]
                  after:w-0
                  hover:after:w-full
                  after:bg-cyan-400
                  after:transition-all
                  after:duration-700
                  hover:tracking-wide
                  transition-all
                  duration-500
                "
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow:
                    "0 0 12px rgba(255,255,255,0.22), 0 0 30px rgba(0,212,255,0.15)",
                }}
              >
                Countdown Timer
              </h2>
            </div>

            <Countdown targetDate="2026-04-08T14:30:00" />
          </div>

        </section>

        {/* ───────────────── OUR LEADS ───────────────── */}
        <section id="cores" className="w-full py-12 sm:py-16 md:py-20">

          <div className="flex justify-center mb-10 sm:mb-14">
            <h2
              className="
                relative inline-block
                text-3xl sm:text-4xl md:text-5xl
                font-bold
                text-white
                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[3px]
                after:w-0
                hover:after:w-full
                after:bg-cyan-400
                after:transition-all
                after:duration-700
                hover:tracking-wide
                transition-all
                duration-500
              "
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow:
                  "0 0 12px rgba(255,255,255,0.25), 0 0 30px rgba(0,212,255,0.15)",
              }}
            >
              Our Leads
            </h2>
          </div>

          <TeamLeads />
        </section>

        {/* ───────────────── CORE TEAMS ───────────────── */}
        <section className="w-full py-12 sm:py-16 md:py-20">

          <div className="flex justify-center mb-10 sm:mb-14">
            <h2
              className="
                relative inline-block
                text-3xl sm:text-4xl md:text-5xl
                font-bold
                text-white
                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[3px]
                after:w-0
                hover:after:w-full
                after:bg-cyan-400
                after:transition-all
                after:duration-700
                hover:tracking-wide
                transition-all
                duration-500
              "
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow:
                  "0 0 12px rgba(255,255,255,0.22), 0 0 30px rgba(0,212,255,0.15)",
              }}
            >
              Core Teams
            </h2>
          </div>

          <CoreTeams />
        </section>

        {/* ───────────────── PAST EVENTS ───────────────── */}
        <section id="pastevents" className="w-full py-12 sm:py-16 md:py-20">
          <PastEvents />
        </section>

        {/* ───────────────── BLOGS ───────────────── */}
        <section id="blogs" className="w-full py-12 sm:py-16 md:py-20">

          <div className="flex justify-center mb-10 sm:mb-14">
            <h2
              className="
                relative inline-block
                text-3xl sm:text-4xl md:text-5xl
                font-bold
                text-white
                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[3px]
                after:w-0
                hover:after:w-full
                after:bg-cyan-400
                after:transition-all
                after:duration-700
                hover:tracking-wide
                transition-all
                duration-500
              "
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow:
                  "0 0 12px rgba(255,255,255,0.25), 0 0 30px rgba(0,212,255,0.15)",
              }}
            >
              Byte Blogs
            </h2>
          </div>

          <BlogsPage />
        </section>

        {/* ───────────────── CONTACT ───────────────── */}
        <section
          id="write"
          className="w-full py-12 sm:py-16 md:py-20 flex flex-col items-center"
        >

          <div className="mb-10 sm:mb-14">
            <h2
              className="
                relative inline-block
                text-3xl sm:text-4xl md:text-5xl
                font-bold
                text-white
                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[3px]
                after:w-0
                hover:after:w-full
                after:bg-cyan-400
                after:transition-all
                after:duration-700
                hover:tracking-wide
                transition-all
                duration-500
              "
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow:
                  "0 0 12px rgba(255,255,255,0.25), 0 0 30px rgba(0,212,255,0.15)",
              }}
            >
              Contact Us
            </h2>
          </div>

          <ContactForm />
        </section>

        {/* ───────────────── OUR VIEW ───────────────── */}
        <section
          id="idea"
          className="w-full py-12 sm:py-16 md:py-20 flex flex-col items-center"
        >

          <div className="mb-10 sm:mb-14">
            <h2
              className="
                relative inline-block
                text-3xl sm:text-4xl md:text-5xl
                font-bold
                text-white
                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[3px]
                after:w-0
                hover:after:w-full
                after:bg-cyan-400
                after:transition-all
                after:duration-700
                hover:tracking-wide
                transition-all
                duration-500
              "
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow:
                  "0 0 12px rgba(255,255,255,0.25), 0 0 30px rgba(0,212,255,0.15)",
              }}
            >
              Our View
            </h2>
          </div>

          <NewCard />
        </section>

      </div>

      {/* ───────────────── FOOTER ───────────────── */}
      <section className="mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </section>

    </div>
  );
}
