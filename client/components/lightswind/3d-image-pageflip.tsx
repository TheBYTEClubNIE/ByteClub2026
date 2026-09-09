"use client";

import React, { useState, useEffect, useCallback, CSSProperties, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export interface PageFlipLeaf {
    id?: string | number;
    frontImage?: string;
    backImage?: string;
    frontTitle?: string;
    backTitle?: string;
    frontSubtitle?: string;
    backSubtitle?: string;
    frontBadge?: string;
    backBadge?: string;
    frontDescription?: string;
    backDescription?: string;
    frontSkills?: string[];
    backSkills?: string[];
    frontSocials?: {
        insta?: string;
        linkedin?: string;
        github?: string;
    };
    backSocials?: {
        insta?: string;
        linkedin?: string;
        github?: string;
    };
    frontLogo?: string;
    backLogo?: string;
    frontIsCover?: boolean;
    backIsCover?: boolean;
}

/* ───────────────── Inline Centered Social Icons ───────────────── */

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function LinkedInIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
        </svg>
    );
}

export interface ThreeDImagePageflipProps {
    /** Array of page leaves, each containing front and back images & metadata */
    pages?: PageFlipLeaf[];
    /** Default turned page count (0 = closed book on cover) */
    defaultTurnedIndex?: number;
    /** Controlled turned page count */
    turnedIndex?: number;
    /** Callback fired when page flip changes */
    onPageChange?: (turnedCount: number, totalLeaves: number) => void;
    /** Width of a single page in pixels (default: 320) */
    pageWidth?: number;
    /** Height of a single page in pixels (default: 480) */
    pageHeight?: number;
    /** 3D perspective depth in pixels (default: 1500) */
    perspective?: number;
    /** Maximum hover peek angle in degrees (default: 14) */
    peekAngle?: number;
    /** Total turn angle in degrees (default: 180) */
    turnAngle?: number;
    /** Transition flip animation duration in seconds (default: 0.65) */
    duration?: number;
    /** Easing curve for flip animation (default: "cubic-bezier(0.4, 0, 0.2, 1)") */
    easing?: string;
    /** Shadow intensity factor (0.0 to 1.0, default: 0.45) */
    shadowIntensity?: number;
    /** Dynamically shift spine horizontally when book is open to center the 2-page spread (default: true) */
    spineShift?: boolean;
    /** Border radius for pages (default: "14px") */
    radius?: string | number;
    /** Enable page numbering tags (default: true) */
    showPageNumbers?: boolean;
    /** Enable outer book leather spine binding (default: true) */
    showSpineBinding?: boolean;
    /** Accent glow color for active elements (default: "#00F5FF") */
    accentColor?: string;
    /** Enable automatic page flipping (default: false) */
    autoplay?: boolean;
    /** Autoplay interval in milliseconds (default: 3500) */
    autoplayInterval?: number;
    /** Pause autoplay on hover (default: true) */
    pauseOnHover?: boolean;
    /** Enable interactive click on pages to flip (default: true) */
    interactive?: boolean;
    /** Enable navigation buttons (default: true) */
    showControls?: boolean;
    /** Optional container class name */
    className?: string;
    /** Optional container inline style */
    style?: CSSProperties;
}

export interface ThreeDImagePageflipHandle {
    next: () => void;
    prev: () => void;
    reset: () => void;
    goTo: (index: number) => void;
    getTurnedCount: () => number;
    getTotalLeaves: () => number;
}

interface FaceRenderProps {
    leaf: PageFlipLeaf;
    isFront: boolean;
    index: number;
    pageNumber: number;
    totalSpreads: number;
    isTurned: boolean;
    parsedRadius: string;
    shadowIntensity: number;
    accentColor: string;
    showPageNumbers: boolean;
}

function PageFace({
    leaf,
    isFront,
    index,
    pageNumber,
    totalSpreads,
    isTurned,
    parsedRadius,
    shadowIntensity,
    accentColor,
    showPageNumbers,
}: FaceRenderProps) {
    const image = isFront ? leaf.frontImage : leaf.backImage;
    const title = isFront ? leaf.frontTitle : leaf.backTitle;
    const subtitle = isFront ? leaf.frontSubtitle : leaf.backSubtitle;
    const badge = isFront ? leaf.frontBadge : leaf.backBadge;
    const description = isFront ? leaf.frontDescription : leaf.backDescription;
    const skills = isFront ? leaf.frontSkills : leaf.backSkills;
    const socials = isFront ? leaf.frontSocials : leaf.backSocials;
    const logo = isFront ? leaf.frontLogo : leaf.backLogo;
    const isCover = isFront ? (leaf.frontIsCover ?? (index === 0 && isFront)) : (leaf.backIsCover ?? false);

    return (
        <div
            className="absolute inset-0 w-full h-full bg-[#060a17] overflow-hidden select-none"
            style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: isFront ? undefined : "rotateY(180deg)",
                borderRadius: parsedRadius,
                boxShadow: `0 18px 45px rgba(0, 0, 0, ${shadowIntensity + 0.15})`,
            }}
        >
            {/* Realistic Spine Crease Depth & Book Lighting */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-40"
                style={{
                    background: isFront
                        ? "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.18) 12%, rgba(0,0,0,0.01) 32%, transparent 55%)"
                        : "linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.18) 12%, rgba(0,0,0,0.01) 32%, transparent 55%)",
                    opacity: isFront ? (isTurned ? 0 : 1) : (isTurned ? 1 : 0),
                }}
            />

            {image ? (
                /* ══════════════════════════════════════════════════════
                   1. PHOTO FACE (CLEAN & CINEMATIC PORTRAIT)
                   ══════════════════════════════════════════════════════ */
                <div className="relative w-full h-full bg-[#050811] overflow-hidden">
                    {/* Portrait Photo */}
                    <img
                        src={image}
                        alt={title ?? `Photo ${pageNumber}`}
                        className="w-full h-full object-cover pointer-events-none select-none"
                        loading="lazy"
                    />

                    {/* Natural Archival Lighting Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Subtle Editorial Inner Border */}
                    <div className="absolute inset-2.5 sm:inset-3 border border-white/15 rounded-lg pointer-events-none z-20" />

                    {/* Clean Minimalist Page Folio Tag */}
                    {showPageNumbers && (
                        <div className="absolute bottom-3.5 right-3.5 z-30 pointer-events-none">
                            <span className="px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono text-white/90 bg-black/60 border border-white/20 backdrop-blur-md shadow-sm">
                                {String(Math.ceil(pageNumber / 2)).padStart(2, "0")} / {String(totalSpreads).padStart(2, "0")}
                            </span>
                        </div>
                    )}
                </div>
            ) : isCover ? (
                isFront ? (
                    /* ══════════════════════════════════════════════════════
                       2. FRONT COVER (MATTE HARDCOVER EDITORIAL LOOKBOOK)
                       ══════════════════════════════════════════════════════ */
                    <div className="relative w-full h-full bg-gradient-to-br from-[#0c162d] via-[#081020] to-[#040711] flex flex-col justify-between p-4 sm:p-6 text-white overflow-hidden border border-blue-500/30">
                        {/* Subtle ambient lighting */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.15),transparent_65%)] pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(6,182,212,0.08),transparent_50%)] pointer-events-none" />

                        {/* Fine debossed border hairline */}
                        <div className="absolute inset-2.5 sm:inset-3 border border-blue-400/30 rounded-xl pointer-events-none z-20" />
                        <div className="absolute inset-3.5 sm:inset-4 border border-blue-500/15 rounded-lg pointer-events-none z-20" />

                        {/* Spine Hinge */}
                        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/80 via-black/30 to-transparent border-r border-blue-400/20 z-30 pointer-events-none" />

                        {/* Top Bar */}
                        <div className="relative z-20 flex items-center justify-between w-full pt-1 px-1">
                            <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-blue-300 font-semibold uppercase">
                                BYTE CLUB
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono text-blue-200 bg-blue-500/15 border border-blue-400/30">
                                {badge ?? "2025–2026"}
                            </span>
                        </div>

                        {/* Center Hero */}
                        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center py-2 sm:py-3 gap-2 sm:gap-2.5">
                            {/* Official Byte Club Emblem / Logo Plaque */}
                            <div className="relative mb-0.5 group">
                                <div className="absolute -inset-2 rounded-2xl bg-blue-500/20 blur-md group-hover:bg-blue-400/30 transition-all duration-500 pointer-events-none" />
                                {logo ? (
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/95 p-2 sm:p-2.5 border-2 border-blue-400/40 flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,1)]">
                                        <img
                                            src={logo}
                                            alt="Byte Club Logo"
                                            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#122040] to-[#070e1c] border border-blue-400/40 flex items-center justify-center text-blue-200 shadow-[0_8px_25px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                                        <span className="text-lg sm:text-2xl font-black tracking-tighter text-white font-mono">
                                            &lt;B/&gt;
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Title & Subtitle */}
                            <div className="space-y-0.5">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                                    {title ?? "Byte Club"}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-blue-300 font-medium">
                                    {subtitle ?? "Leadership Directory"}
                                </p>
                            </div>

                            {/* Subtle Hairline Divider */}
                            <div className="w-14 sm:w-20 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent my-0.5" />

                            {/* Summary Description */}
                            {description && (
                                <p className="text-[9.5px] sm:text-[11px] text-slate-300 leading-relaxed max-w-[250px] mx-auto">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* Bottom Footer */}
                        <div className="relative z-20 w-full pt-2 border-t border-blue-500/20 flex items-center justify-between text-[8px] sm:text-[9px] text-blue-300/80 font-medium">
                            <span>{Math.max(totalSpreads - 1, 0)} Leadership Domains</span>
                            <span className="flex items-center gap-1 text-blue-200 font-semibold">
                                <span>Flip to open</span>
                                <span>→</span>
                            </span>
                        </div>
                    </div>
                ) : (
                    /* ══════════════════════════════════════════════════════
                       3. BACK COVER (CONCLUDING EDITORIAL SPREAD)
                       ══════════════════════════════════════════════════════ */
                    <div className="relative w-full h-full bg-gradient-to-bl from-[#0c162d] via-[#081020] to-[#040711] flex flex-col justify-between p-4 sm:p-6 text-white overflow-hidden border border-blue-500/30">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.12),transparent_70%)] pointer-events-none" />
                        <div className="absolute inset-2.5 sm:inset-3 border border-blue-400/30 rounded-xl pointer-events-none z-20" />
                        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/80 via-black/30 to-transparent border-l border-blue-400/20 z-30 pointer-events-none" />

                        {/* Top Bar */}
                        <div className="relative z-20 flex items-center justify-between w-full pt-1 px-1">
                            <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-blue-300 font-semibold uppercase">
                                BYTE CLUB
                            </span>
                            <span className="text-[8px] sm:text-[9px] font-mono text-blue-300/70">
                                2026 Cohort
                            </span>
                        </div>

                        {/* Center Content */}
                        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center py-2 sm:py-4 gap-2.5">
                            {logo ? (
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/95 p-1.5 sm:p-2 border-2 border-blue-400/40 flex items-center justify-center shadow-lg">
                                    <img
                                        src={logo}
                                        alt="Byte Club Logo"
                                        className="w-full h-full object-contain pointer-events-none select-none"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600/15 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-sm">
                                    <span className="text-base sm:text-lg font-bold font-mono">&lt;/&gt;</span>
                                </div>
                            )}
                            <div className="space-y-1">
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                                    {title ?? "Join Byte Club"}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-blue-300 font-medium">
                                    {subtitle ?? "Innovate • Build • Excel"}
                                </p>
                            </div>
                            {description && (
                                <p className="text-[9.5px] sm:text-[11px] text-slate-300 leading-relaxed max-w-[240px]">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="relative z-20 w-full pt-2 border-t border-blue-500/20 text-center text-[8px] sm:text-[9px] text-blue-300/80">
                            <span>Byte Club Leadership Directory • 2026</span>
                        </div>
                    </div>
                )
            ) : (
                /* ══════════════════════════════════════════════════════
                   4. INNER PROFILE PAGE (HIGH CONTRAST BLUE & WHITE)
                   ══════════════════════════════════════════════════════ */
                <div className="relative w-full h-full bg-gradient-to-b from-[#070e24] via-[#050a1b] to-[#030612] flex flex-col justify-between p-3.5 sm:p-5 text-white overflow-hidden border border-blue-500/25">
                    {/* Subtle Blue & Cyan Lighting */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.12),transparent_50%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(6,182,212,0.08),transparent_55%)] pointer-events-none" />

                    {/* Clean Inner Border */}
                    <div className="absolute inset-2 sm:inset-2.5 border border-blue-400/20 rounded-lg pointer-events-none z-20" />

                    {/* RUNNING HEADER: Domain Pill & Page Folio */}
                    <div className="relative z-20 flex items-center justify-between w-full pb-1.5 border-b border-blue-500/20">
                        <div className="flex items-center gap-1.5">
                            {badge && (
                                <span className="px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-semibold tracking-wide bg-blue-500/20 text-blue-200 border border-blue-400/35">
                                    {badge}
                                </span>
                            )}
                        </div>
                        {showPageNumbers && (
                            <span className="text-[9px] sm:text-[10px] font-mono text-blue-200/80 font-medium">
                                {String(Math.ceil(pageNumber / 2)).padStart(2, "0")} / {String(totalSpreads).padStart(2, "0")}
                            </span>
                        )}
                    </div>

                    {/* MAIN PROFILE CONTENT */}
                    <div className="relative z-20 flex-1 flex flex-col justify-between py-1.5 sm:py-2 gap-2">
                        {/* Name & Subtitle / Role */}
                        <div>
                            <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                                {title}
                            </h3>
                            {subtitle && (
                                <p className="text-[10px] sm:text-xs md:text-[13px] text-blue-300 font-medium mt-0.5">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Editorial Bio Box */}
                        {description && (
                            <div className="bg-[#0b1633]/80 border border-blue-400/25 rounded-xl p-2.5 sm:p-3 shadow-sm backdrop-blur-sm">
                                <p className="text-[9px] sm:text-[11px] md:text-xs text-slate-100 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        )}

                        {/* Core Skills / Competencies */}
                        {skills && skills.length > 0 && (
                            <div className="space-y-1">
                                <span className="text-[8px] sm:text-[9px] font-semibold text-blue-300/80 tracking-wider uppercase">
                                    Core Focus
                                </span>
                                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                    {skills.map((skill, sIdx) => (
                                        <span
                                            key={sIdx}
                                            className="px-2 py-0.5 text-[8.5px] sm:text-[9.5px] rounded-md bg-blue-500/15 text-blue-100 border border-blue-400/30 font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Profile Links */}
                        {socials && (socials.insta || socials.linkedin || socials.github) && (
                            <div className="space-y-1 pt-0.5">
                                <span className="text-[8px] sm:text-[9px] font-semibold text-blue-300/80 tracking-wider uppercase">
                                    Connect
                                </span>
                                <div
                                    className="flex flex-wrap items-center gap-1.5 sm:gap-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {socials.linkedin && (
                                        <a
                                            href={socials.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="LinkedIn"
                                            className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/35 border border-blue-400/40 flex items-center gap-1 text-[8.5px] sm:text-[10px] text-white hover:border-blue-300 transition-all cursor-pointer shadow-sm"
                                        >
                                            <LinkedInIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-300" />
                                            <span className="font-medium">LinkedIn</span>
                                        </a>
                                    )}
                                    {socials.github && (
                                        <a
                                            href={socials.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="GitHub"
                                            className="px-2.5 py-1 rounded-lg bg-blue-900/30 hover:bg-blue-800/40 border border-blue-400/30 flex items-center gap-1 text-[8.5px] sm:text-[10px] text-white hover:border-blue-300 transition-all cursor-pointer shadow-sm"
                                        >
                                            <GithubIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300" />
                                            <span className="font-medium">GitHub</span>
                                        </a>
                                    )}
                                    {socials.insta && (
                                        <a
                                            href={socials.insta}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Instagram"
                                            className="px-2.5 py-1 rounded-lg bg-blue-600/15 hover:bg-pink-600/20 border border-blue-400/30 hover:border-pink-400/40 flex items-center gap-1 text-[8.5px] sm:text-[10px] text-white transition-all cursor-pointer shadow-sm"
                                        >
                                            <InstagramIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-300" />
                                            <span className="font-medium">Instagram</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="relative z-20 w-full pt-1 border-t border-blue-500/20 flex items-center justify-between text-[8px] sm:text-[9px] text-blue-300/70 font-medium">
                        <span>Byte Club</span>
                        <span>Leadership 2026</span>
                    </div>
                </div>
            )}
        </div>
    );
}

const DEFAULT_PAGES: PageFlipLeaf[] = [
    {
        id: 1,
        frontImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        frontTitle: "Villa Solarium",
        frontSubtitle: "Horizon Pool & Architecture",
        frontBadge: "Cover",
        backTitle: "Minimal Horizon",
        backSubtitle: "Geometric Water Pavilion",
        backBadge: "Plate 01",
    },
];

export const ThreeDImagePageflip = forwardRef<ThreeDImagePageflipHandle, ThreeDImagePageflipProps>(({
    pages = DEFAULT_PAGES,
    defaultTurnedIndex = 0,
    turnedIndex: controlledTurnedIndex,
    onPageChange,
    pageWidth = 320,
    pageHeight = 480,
    perspective = 1500,
    peekAngle = 14,
    turnAngle = 180,
    duration = 0.65,
    easing = "cubic-bezier(0.4, 0, 0.2, 1)",
    shadowIntensity = 0.45,
    spineShift = true,
    radius = "14px",
    showPageNumbers = true,
    showSpineBinding = true,
    accentColor = "#00F5FF",
    autoplay = false,
    autoplayInterval = 3500,
    pauseOnHover = true,
    interactive = true,
    showControls = true,
    className,
    style,
}, ref) => {
    const [internalTurned, setInternalTurned] = useState<number>(defaultTurnedIndex);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [peekingIndex, setPeekingIndex] = useState<number | null>(null);

    const totalLeaves = pages.length;
    const currentTurned = controlledTurnedIndex !== undefined ? controlledTurnedIndex : internalTurned;
    const isOpen = currentTurned > 0 && currentTurned < totalLeaves;

    const parsedRadius = typeof radius === "number" ? `${radius}px` : radius;

    const setTurned = useCallback((newCount: number) => {
        const clamped = Math.max(0, Math.min(newCount, totalLeaves));
        if (controlledTurnedIndex === undefined) {
            setInternalTurned(clamped);
        }
        if (onPageChange) {
            onPageChange(clamped, totalLeaves);
        }
    }, [controlledTurnedIndex, totalLeaves, onPageChange]);

    const flipNext = useCallback(() => {
        if (currentTurned < totalLeaves) {
            setTurned(currentTurned + 1);
        }
    }, [currentTurned, totalLeaves, setTurned]);

    const flipPrev = useCallback(() => {
        if (currentTurned > 0) {
            setTurned(currentTurned - 1);
        }
    }, [currentTurned, setTurned]);

    const resetBook = useCallback(() => {
        setTurned(0);
    }, [setTurned]);

    useImperativeHandle(ref, () => ({
        next: flipNext,
        prev: flipPrev,
        reset: resetBook,
        goTo: (idx) => setTurned(idx),
        getTurnedCount: () => currentTurned,
        getTotalLeaves: () => totalLeaves,
    }));

    // Autoplay Timer
    useEffect(() => {
        if (!autoplay || (pauseOnHover && isHovered) || totalLeaves <= 1) return;
        const timer = setInterval(() => {
            setInternalTurned((prev) => (prev >= totalLeaves ? 0 : prev + 1));
        }, autoplayInterval);
        return () => clearInterval(timer);
    }, [autoplay, autoplayInterval, pauseOnHover, isHovered, totalLeaves]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") flipNext();
            if (e.key === "ArrowLeft") flipPrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [flipNext, flipPrev]);

    const handleLeafClick = (index: number) => {
        if (!interactive) return;
        if (index === currentTurned) {
            // Click unturned top page -> flip forward
            flipNext();
        } else if (index === currentTurned - 1) {
            // Click turned top left page -> flip backward
            flipPrev();
        }
    };

    return (
        <div
            className={cn("w-full flex flex-col items-center justify-center select-none py-4", className)}
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setPeekingIndex(null);
            }}
        >
            {/* 3D Book Viewport Stage */}
            <div
                className="relative flex items-center justify-center transition-all duration-500"
                style={{
                    perspective: `${perspective}px`,
                    width: `${pageWidth * 2 + 50}px`,
                    height: `${pageHeight + 40}px`,
                    maxWidth: "100%",
                }}
            >
                {/* 3D Book Container */}
                <div
                    className="relative transition-transform"
                    style={{
                        width: `${pageWidth}px`,
                        height: `${pageHeight}px`,
                        transformStyle: "preserve-3d",
                        transition: `transform ${duration}s ${easing}`,
                        transform: spineShift
                            ? currentTurned === 0
                                ? "translateX(0)"
                                : currentTurned >= totalLeaves
                                ? `translateX(${pageWidth}px)`
                                : `translateX(${pageWidth / 2}px)`
                            : "translateX(0)",
                    }}
                >
                    {/* Spine Shadow & Binding Crease */}
                    {showSpineBinding && (
                        <div
                            className="absolute top-0 bottom-0 left-[-4px] w-[8px] rounded-l-sm bg-gradient-to-r from-black/90 via-zinc-800 to-black/50 shadow-2xl z-30 pointer-events-none"
                            style={{
                                opacity: isOpen ? 0.95 : 0.6,
                                transition: `opacity ${duration}s ease`,
                            }}
                        />
                    )}

                    {/* Ground Ambience Drop Shadow underneath the book */}
                    <div
                        className="absolute -bottom-8 left-[-15%] w-[130%] h-12 bg-black/60 rounded-full blur-2xl pointer-events-none transition-all duration-500"
                        style={{
                            opacity: isOpen ? 0.8 : 0.5,
                            transform: isOpen ? "scale(1.15)" : "scale(0.85)",
                        }}
                    />

                    {/* Book Leaves Stacking Loop */}
                    {pages.map((leaf, index) => {
                        const isTurned = index < currentTurned;
                        const isCanPeek = index === currentTurned;
                        const isPeeking = peekingIndex === index;

                        // Calculate Z-Index: turned leaves stack forward on left, unturned leaves stack backward on right
                        const zIndex = isTurned ? index + 1 : totalLeaves - index;

                        // Rotation Angle
                        let leafRotation = isTurned ? -turnAngle : 0;
                        if (!isTurned && isPeeking) {
                            leafRotation = -peekAngle;
                        }

                        return (
                            <div
                                key={leaf.id ?? index}
                                onClick={() => handleLeafClick(index)}
                                onMouseEnter={() => {
                                    if (isCanPeek) setPeekingIndex(index);
                                }}
                                onMouseLeave={() => {
                                    if (peekingIndex === index) setPeekingIndex(null);
                                }}
                                className={cn(
                                    "absolute inset-0 origin-left cursor-pointer",
                                    interactive ? "cursor-pointer" : "pointer-events-none"
                                )}
                                style={{
                                    transformStyle: "preserve-3d",
                                    transition: `transform ${duration}s ${easing}`,
                                    transform: `rotateY(${leafRotation}deg)`,
                                    zIndex,
                                    borderRadius: parsedRadius,
                                }}
                            >
                                {/* FRONT FACE (Visible when page is on the right) */}
                                <PageFace
                                    leaf={leaf}
                                    isFront={true}
                                    index={index}
                                    pageNumber={index * 2 + 1}
                                    totalSpreads={totalLeaves}
                                    isTurned={isTurned}
                                    parsedRadius={parsedRadius}
                                    shadowIntensity={shadowIntensity}
                                    accentColor={accentColor}
                                    showPageNumbers={showPageNumbers}
                                />

                                {/* BACK FACE (Visible when page is turned to the left) */}
                                <PageFace
                                    leaf={leaf}
                                    isFront={false}
                                    index={index}
                                    pageNumber={index * 2 + 2}
                                    totalSpreads={totalLeaves}
                                    isTurned={isTurned}
                                    parsedRadius={parsedRadius}
                                    shadowIntensity={shadowIntensity}
                                    accentColor={accentColor}
                                    showPageNumbers={showPageNumbers}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Book Controls & Page Progress Toolbar */}
            {/* Book Controls & Page Progress Toolbar */}
            {showControls && (
                <div className="flex items-center justify-center gap-3 mt-6 select-none">
                    <button
                        onClick={flipPrev}
                        disabled={currentTurned === 0}
                        aria-label="Previous Page"
                        className="px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold bg-white/5 border border-white/15 text-white hover:bg-blue-600/20 hover:border-blue-400/40 hover:text-blue-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md cursor-pointer backdrop-blur-md"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Prev Page</span>
                    </button>

                    <button
                        onClick={resetBook}
                        disabled={currentTurned === 0}
                        aria-label="Reset Book"
                        className="px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold bg-white/5 border border-white/15 text-white hover:bg-white/15 hover:border-white/30 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md cursor-pointer backdrop-blur-md"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Cover</span>
                    </button>

                    <div className="px-4 py-2 rounded-xl bg-black/60 border border-blue-500/30 text-xs font-mono text-blue-200 shadow-inner backdrop-blur-md">
                        <span className="font-bold text-white">{currentTurned}</span>
                        <span className="opacity-50 text-white/50"> / </span>
                        <span>{totalLeaves} leaves</span>
                    </div>

                    <button
                        onClick={flipNext}
                        disabled={currentTurned === totalLeaves}
                        aria-label="Next Page"
                        className="px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold bg-white/5 border border-white/15 text-white hover:bg-blue-600/20 hover:border-blue-400/40 hover:text-blue-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md cursor-pointer backdrop-blur-md"
                    >
                        <span>Next Page</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
});

ThreeDImagePageflip.displayName = "ThreeDImagePageflip";

export default ThreeDImagePageflip;
