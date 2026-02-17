"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import type { ThemeToggleProps } from "./ThemeToggle.types";

const STORAGE_KEY = "planituni-theme";

export function ThemeToggle({ className }: ThemeToggleProps) {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const current = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(current ?? "dark");
        setMounted(true);
    }, []);

    const toggle = useCallback(() => {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(STORAGE_KEY, next);
        setTheme(next);
    }, [theme]);

    // Avoid hydration mismatch — render nothing until mounted
    if (!mounted) return <div className="w-[72px] h-9" />;

    const isLight = theme === "light";

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
            className={cn(
                "relative inline-flex items-center h-8 aspect-square rounded-full p-1 transition-colors duration-300 cursor-pointer align-middle justify-center",
                "border border-[var(--color-border-subtle)]",
                isLight ? "bg-[var(--color-bg-elevated)] stroke-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]/90" : "bg-[var(--color-bg-surface)]",
                className,
            )}
        >
            {isLight ? (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M11 3V2q0-.425.288-.712T12 1t.713.288T13 2v1q0 .425-.288.713T12 4t-.712-.288T11 3m0 19v-1q0-.425.288-.712T12 20t.713.288T13 21v1q0 .425-.288.713T12 23t-.712-.288T11 22m11-9h-1q-.425 0-.712-.288T20 12t.288-.712T21 11h1q.425 0 .713.288T23 12t-.288.713T22 13M3 13H2q-.425 0-.712-.288T1 12t.288-.712T2 11h1q.425 0 .713.288T4 12t-.288.713T3 13m16.75-7.325l-.35.35q-.275.275-.687.275T18 6q-.275-.275-.288-.687t.263-.713l.375-.375q.275-.3.7-.3t.725.3t.288.725t-.313.725M6.025 19.4l-.375.375q-.275.3-.7.3t-.725-.3t-.288-.725t.313-.725l.35-.35q.275-.275.688-.275T6 18q.275.275.288.688t-.263.712m12.3.35l-.35-.35q-.275-.275-.275-.687T18 18q.275-.275.688-.287t.712.262l.375.375q.3.275.3.7t-.3.725t-.725.288t-.725-.313M4.6 6.025l-.375-.375q-.3-.275-.3-.7t.3-.725t.725-.288t.725.313l.35.35q.275.275.275.688T6 6q-.275.275-.687.288T4.6 6.025M12 18q-2.5 0-4.25-1.75T6 12t1.75-4.25T12 6t4.25 1.75T18 12t-1.75 4.25T12 18"
                    />
                </svg>
            ) : (
                // Moon icon
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white" aria-hidden>
                    <path
                        fillRule="evenodd"
                        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </button>
    );
}
