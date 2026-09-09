"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CELL_SIZE = "clamp(48px, 11vw, 76px)";

function getCountdown(targetDate: string) {
    const diff = new Date(targetDate).getTime() - Date.now();

    if (diff <= 0) {
        return { d: 0, h: 0, m: 0, s: 0, expired: true };
    }

    return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
        expired: false,
    };
}

function FlipDigit({ value, label }: { value: number; label: string }) {
    const padded = String(value).padStart(2, "0");
    return (
        <div className="flex flex-col items-center">
            <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: 10,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--line)",
                }}
            >
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={padded}
                        initial={{ y: "-100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
                        style={{
                            position: "absolute",
                            fontFamily: "var(--font-display)",
                            fontWeight: 800,
                            fontSize: "clamp(1.4rem, 5vw, 2.4rem)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                            color: "var(--ink)",
                        }}
                    >
                        {padded}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span
                className="mt-2 uppercase"
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    color: "var(--ink-faint)",
                }}
            >
                {label}
            </span>
        </div>
    );
}

function Colon() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const id = setInterval(() => setVisible((v) => !v), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex flex-col items-center" aria-hidden="true">
            <div className="flex items-center justify-center" style={{ height: CELL_SIZE }}>
                <span
                    style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(1.2rem, 4vw, 2rem)",
                        color: "var(--accent)",
                        opacity: visible ? 0.85 : 0.2,
                        transition: "opacity 0.3s ease",
                        lineHeight: 1,
                    }}
                >
                    :
                </span>
            </div>
            {/* invisible spacer so the colon lines up with the digit cells,
                not the cell+label column as a whole */}
            <span className="mt-2" style={{ fontSize: "10px", visibility: "hidden" }}>
                :
            </span>
        </div>
    );
}

export default function Countdown({ targetDate }: { targetDate: string }) {
    const [time, setTime] = useState<ReturnType<typeof getCountdown> | null>(null);

    useEffect(() => {
        setTime(getCountdown(targetDate));

        const interval = setInterval(() => {
            setTime(getCountdown(targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!time) return null;

    return (
        <div className="flex items-start justify-center gap-1.5 sm:gap-3 w-full">
            <FlipDigit value={time.d} label="Days" />
            <Colon />
            <FlipDigit value={time.h} label="Hours" />
            <Colon />
            <FlipDigit value={time.m} label="Min" />
            <Colon />
            <FlipDigit value={time.s} label="Sec" />
        </div>
    );
}
