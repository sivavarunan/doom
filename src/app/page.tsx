"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    IconArrowRight,
    IconBolt,
    IconMessage2,
    IconShieldLock,
    IconSparkles,
} from "@tabler/icons-react";
import { Logo } from "@/app/componenets/logo";

export default function Home() {
    const router = useRouter();

    const features = [
        {
            icon: <IconMessage2 className="h-4 w-4" />,
            label: "Real-time messaging",
        },
        {
            icon: <IconBolt className="h-4 w-4" />,
            label: "Voice & files",
        },
        {
            icon: <IconSparkles className="h-4 w-4" />,
            label: "AI assist",
        },
        {
            icon: <IconShieldLock className="h-4 w-4" />,
            label: "End-to-end",
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-ink">
            {/* Ambient backdrop */}
            <div className="pointer-events-none absolute inset-0 bg-aurora" />
            <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-40" />
            <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

            {/* Nav */}
            <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <Logo />
                <nav className="hidden items-center gap-6 md:flex">
                    <a
                        href="#features"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                        Features
                    </a>
                    <a
                        href="/pages/AboutPage"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                        About
                    </a>
                </nav>
                <div className="flex items-center gap-2">
                    <Link
                        href="/pages/LoginPage"
                        className="rounded-xl px-3.5 py-1.5 text-sm text-white/70 transition-colors hover:text-white"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/pages/LoginPage/signup"
                        className="btn-primary !px-4 !py-1.5 !text-sm"
                    >
                        Get started
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-16 md:pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-white/60 backdrop-blur"
                >
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    now in beta
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.6 }}
                    className="font-display text-center text-[clamp(2.75rem,8vw,5.25rem)] font-semibold leading-[1.02] tracking-tight text-white"
                >
                    Conversations,
                    <br />
                    <span className="text-gradient-accent">reimagined.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.6 }}
                    className="mt-6 max-w-xl text-center text-base text-white/60 md:text-lg"
                >
                    DOOM is a quiet, fast, private messenger for people who care
                    about craft. Talk, share, ship — without the noise.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
                >
                    <button
                        onClick={() => router.push("/pages/MainPage")}
                        className="group btn-primary !px-6 !py-3 !text-base"
                    >
                        Enter DOOM
                        <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                    <Link
                        href="/pages/LoginPage/signup"
                        className="btn-ghost !px-6 !py-3 !text-base"
                    >
                        Create an account
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    id="features"
                    className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4"
                >
                    {features.map((f) => (
                        <div
                            key={f.label}
                            className="group flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 text-sm text-white/70 backdrop-blur-sm transition-colors hover:border-emerald-400/30 hover:text-white"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300 transition-colors group-hover:bg-emerald-500/15">
                                {f.icon}
                            </span>
                            <span className="font-medium">{f.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Preview frame */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative mt-20 w-full max-w-5xl"
                >
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-emerald-400/20 opacity-60 blur-2xl" />
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface-1/80 shadow-card backdrop-blur-xl">
                        <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                            <span className="ml-3 font-mono text-[11px] text-white/40">
                                doom.app / chat
                            </span>
                        </div>
                        <div className="grid grid-cols-[1fr] gap-3 p-6 md:grid-cols-[220px_1fr]">
                            <aside className="hidden flex-col gap-2 md:flex">
                                {["@eren", "@mikasa", "@armin", "@levi"].map((n, i) => (
                                    <div
                                        key={n}
                                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${
                                            i === 0
                                                ? "bg-emerald-500/10 text-white"
                                                : "text-white/50"
                                        }`}
                                    >
                                        <span className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" />
                                        <span className="font-mono">{n}</span>
                                    </div>
                                ))}
                            </aside>
                            <div className="flex flex-col gap-3">
                                <div className="max-w-[70%] self-start rounded-2xl rounded-tl-md border border-white/5 bg-white/[0.03] px-4 py-2.5 text-sm text-white/85">
                                    hey — pushed the new design, want a look?
                                </div>
                                <div className="max-w-[70%] self-end rounded-2xl rounded-tr-md bg-gradient-to-br from-emerald-400 to-teal-600 px-4 py-2.5 text-sm text-black">
                                    shipping it. 🚀
                                </div>
                                <div className="max-w-[70%] self-start rounded-2xl rounded-tl-md border border-white/5 bg-white/[0.03] px-4 py-2.5 text-sm text-white/85">
                                    let&apos;s go.
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <footer className="relative z-10 border-t border-white/[0.05] py-8 text-center font-mono text-[11px] text-white/30">
                © {new Date().getFullYear()} DOOM · built with care
            </footer>
        </div>
    );
}
