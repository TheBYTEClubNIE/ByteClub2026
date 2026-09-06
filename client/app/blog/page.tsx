import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StaticSpaceBackground from "../components/AnimatedBackground";
import BlogsPage from "../components/Blog";

export default function BlogRoute() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Background */}
      <StaticSpaceBackground />

      {/* Navbar */}
      <div className="p-8"><Navbar /></div>
      
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
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
      </div>

      {/* ───────────────── FOOTER ───────────────── */}
      <section className="mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </section>
    </div>
  );
}
