"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-xl font-bold text-white">THE BYTE CLUB</h2>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              Building the future, one byte at a time.
              A community of developers, creators, and innovators.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <Link href="/#home" className="hover:text-white transition cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#events" className="hover:text-white transition cursor-pointer">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/#cores" className="hover:text-white transition cursor-pointer">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/#write" className="hover:text-white transition cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/#pastevents" className="hover:text-white transition cursor-pointer">
                  Past Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Connect</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/thebyteclubnie?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">🌐</a>
              <a href="https://www.linkedin.com/company/thebyteclubnie" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">💼</a>
              <a href="https://github.com/The-Byte-Club" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">🐙</a>
              <a href="https://www.facebook.com/thebyteclubnie" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">📸</a>
            </div>
          </div>
        </div>

        <div className="my-8 h-px bg-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© {new Date().getFullYear()} The Byte Club. All rights reserved.</p>

         
        </div>
      </div>
    </footer>
  );
}