"use client";
import { useEffect, useState } from "react";

function getCountdown(targetDate: string) {
    const diff = new Date(targetDate).getTime() - Date.now();

    if (diff <= 0) {
        return { d: 0, h: 0, m: 0, s: 0 };
    }

    return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
    };
}

export default function Countdown({
    targetDate,
}: {
    targetDate: string;
}) {
    const [time, setTime] = useState<{
        d: number;
        h: number;
        m: number;
        s: number;
    } | null>(null);

    useEffect(() => {
        setTime(getCountdown(targetDate));

        const interval = setInterval(() => {
            setTime(getCountdown(targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!time) return null;

    const data = [
        { label: "Days", value: time.d },
        { label: "Hours", value: time.h },
        { label: "Minutes", value: time.m },
        { label: "Seconds", value: time.s },
    ];

    return (
        <div className="flex flex-col items-center gap-8 text-center w-full">
            <div className="flex gap-2 sm:gap-4 md:gap-6 w-full justify-center px-2">
                {data.map((item, i) => (
                    <div
                        key={i}
                        className="
                            flex flex-col items-center justify-center
                            bg-gradient-to-br from-gray-900 to-black
                            text-white
                            rounded-xl sm:rounded-2xl
                            shadow-xl border border-gray-700
                            hover:scale-105 transition-transform duration-300
                            flex-1 min-w-0
                            py-3 sm:py-5
                            px-1 sm:px-4 md:px-6
                            max-w-[90px] sm:max-w-none
                        "
                    >
                        <span
                            className="font-bold tracking-wide animate-bounce leading-none"
                            style={{ fontSize: "clamp(1.5rem, 6vw, 3rem)" }}
                        >
                            {String(item.value).padStart(2, "0")}
                        </span>

                        <span
                            className="mt-1 sm:mt-2 text-gray-400 uppercase tracking-widest font-medium"
                            style={{ fontSize: "clamp(0.5rem, 2vw, 0.75rem)" }}
                        >
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
