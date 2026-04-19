"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export const Logo = () => {
    return (
        <Link
            href="/"
            aria-label="DOOM home"
            className="group/logo relative flex items-center gap-2.5 py-1 pl-1"
        >
            <LogoMark />
            <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="font-display text-[15px] font-semibold tracking-[0.18em] text-white/95"
            >
                DOOM
            </motion.span>
        </Link>
    );
};

export const LogoMark = () => {
    return (
        <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-[9px] bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-600 shadow-[0_0_0_1px_rgba(52,211,153,0.3),0_8px_24px_-8px_rgba(16,185,129,0.55)]">
            <span className="absolute inset-[2px] rounded-[7px] bg-[rgb(var(--surface-1))]" />
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="relative h-3.5 w-3.5 text-emerald-300"
                aria-hidden
            >
                <path
                    d="M4 7.5C4 5.01472 6.01472 3 8.5 3H15.5C17.9853 3 20 5.01472 20 7.5V13.5C20 15.9853 17.9853 18 15.5 18H10L6.5 21V18C5.11929 18 4 16.8807 4 15.5V7.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
                <circle cx="9" cy="11" r="1" fill="currentColor" />
                <circle cx="12" cy="11" r="1" fill="currentColor" />
                <circle cx="15" cy="11" r="1" fill="currentColor" />
            </svg>
        </span>
    );
};
