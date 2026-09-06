import "./globals.css";


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
import AnimatedBackground from "./components/AnimatedBackground";
import BlogsPage from "./components/Blog";
import Countdown from "./components/CountDowntimer";
import GooeyNav from "./components/Navbar";
import SplitFlapText from "@/components/SplitFlapText";
import FAQSection from "./components/FAQSection";
import {
  Home as HomeIcon,
  Calendar,
  Users,
  History,
  BookOpen,
  Mail,
  Info,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "#home", icon: <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Events", href: "#info", icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Leads", href: "#cores", icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Past Events", href: "#pastevents", icon: <History className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Blogs", href: "#blogs", icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Contact", href: "#write", icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "About", href: "#idea", icon: <Info className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "FAQ", href: "#faq", icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" /> },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <AnimatedBackground />

      {/* Floating Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto">
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
      </div>
      

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
              <SplitFlapText
                words={["UPCOMING EVENTS", "TECH WORKSHOPS", "HACKATHONS LIVE"]}
                flipDuration={0.1}
                stagger={0.04}
                cycleDelay={2800}
                charset="alphanumeric"
                flipsPerChar={6}
                tileColor="#071026"
                textColor="#38bdf8"
                tileRadius="clamp(4px, 0.8vw, 8px)"
                gap="clamp(3px, 0.5vw, 6px)"
                fontSize="clamp(22px, 3.8vw, 42px)"
                loop
                padTo={15}
              />
            </div>

            <UpcomingEvents />
          </div>

          {/* Countdown */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end">

            <div className="mb-8 sm:mb-10 text-center lg:text-right w-full">
              <SplitFlapText
                words={["COUNTDOWN TIMER", "EVENT TICKING", "TIME REMAINING"]}
                flipDuration={0.1}
                stagger={0.04}
                cycleDelay={2800}
                charset="alphanumeric"
                flipsPerChar={6}
                tileColor="#071026"
                textColor="#38bdf8"
                tileRadius="clamp(4px, 0.8vw, 8px)"
                gap="clamp(3px, 0.5vw, 6px)"
                fontSize="clamp(20px, 3.2vw, 36px)"
                loop
                padTo={15}
              />
            </div>

            <Countdown targetDate="2026-04-08T14:30:00" />
          </div>

        </section>

        {/* ───────────────── OUR LEADS ───────────────── */}
        <section id="cores" className="w-full py-12 sm:py-16 md:py-20">

          <div className="flex justify-center mb-10 sm:mb-14">
            <SplitFlapText
              words={["OUR LEADS", "LEADERSHIP 2026", "DOMAINS IN CHARGE"]}
              flipDuration={0.1}
              stagger={0.04}
              cycleDelay={2800}
              charset="alphanumeric"
              flipsPerChar={6}
              tileColor="#071026"
              textColor="#38bdf8"
              tileRadius="clamp(4px, 0.8vw, 8px)"
              gap="clamp(3px, 0.5vw, 6px)"
              fontSize="clamp(22px, 3.8vw, 42px)"
              loop
              padTo={18}
            />
          </div>

          <TeamLeads />
        </section>

        {/* ───────────────── CORE TEAMS ───────────────── */}
        <section className="w-full py-12 sm:py-16 md:py-20">

          <div className="flex justify-center mb-10 sm:mb-14">
            <SplitFlapText
              words={["CORE TEAMS", "COMMUNITY SQUAD", "BYTE BUILDERS"]}
              flipDuration={0.1}
              stagger={0.04}
              cycleDelay={2800}
              charset="alphanumeric"
              flipsPerChar={6}
              tileColor="#071026"
              textColor="#38bdf8"
              tileRadius="clamp(4px, 0.8vw, 8px)"
              gap="clamp(3px, 0.5vw, 6px)"
              fontSize="clamp(22px, 3.8vw, 42px)"
              loop
              padTo={15}
            />
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
            <SplitFlapText
              words={["BYTE BLOGS", "TECH ARTICLES", "LATEST STORIES"]}
              flipDuration={0.1}
              stagger={0.04}
              cycleDelay={2800}
              charset="alphanumeric"
              flipsPerChar={6}
              tileColor="#071026"
              textColor="#38bdf8"
              tileRadius="clamp(4px, 0.8vw, 8px)"
              gap="clamp(3px, 0.5vw, 6px)"
              fontSize="clamp(22px, 3.8vw, 42px)"
              loop
              padTo={14}
            />
          </div>

          <BlogsPage />
        </section>

        {/* ───────────────── CONTACT ───────────────── */}
        <section
          id="write"
          className="w-full py-12 sm:py-16 md:py-20 flex flex-col items-center"
        >

          <div className="mb-10 sm:mb-14">
            <SplitFlapText
              words={["CONTACT US", "GET IN TOUCH", "JOIN BYTE CLUB"]}
              flipDuration={0.1}
              stagger={0.04}
              cycleDelay={2800}
              charset="alphanumeric"
              flipsPerChar={6}
              tileColor="#071026"
              textColor="#38bdf8"
              tileRadius="clamp(4px, 0.8vw, 8px)"
              gap="clamp(3px, 0.5vw, 6px)"
              fontSize="clamp(22px, 3.8vw, 42px)"
              loop
              padTo={14}
            />
          </div>

          <ContactForm />
        </section>

        {/* ───────────────── OUR VIEW ───────────────── */}
        <section
          id="idea"
          className="w-full py-12 sm:py-16 md:py-20 flex flex-col items-center"
        >

          <div className="mb-10 sm:mb-14">
            <SplitFlapText
              words={["OUR VIEW", "BYTE MISSION", "FUTURE VISION"]}
              flipDuration={0.1}
              stagger={0.04}
              cycleDelay={2800}
              charset="alphanumeric"
              flipsPerChar={6}
              tileColor="#071026"
              textColor="#38bdf8"
              tileRadius="clamp(4px, 0.8vw, 8px)"
              gap="clamp(3px, 0.5vw, 6px)"
              fontSize="clamp(22px, 3.8vw, 42px)"
              loop
              padTo={13}
            />
          </div>

          <NewCard />
        </section>
               <FAQSection />
      </div>

      {/* ───────────────── FOOTER ───────────────── */}
      <section className="mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </section>

    </div>
  );
}
