"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    IconArrowUpRight,
    IconSparkles,
    IconUsersGroup,
    IconMessage,
    IconTrendingUp,
} from "@tabler/icons-react";

import { AppShell } from "@/app/componenets/AppShell";
import { Bento } from "./bentogrid";
import { Bento2 } from "./bento2";

export function SidebarComp() {
    return (
        <AppShell>
            <Dashboard />
        </AppShell>
    );
}

const Dashboard = () => {
    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 md:py-10">
            <PageHero />
            <StatsRow />
            <SectionHeader
                eyebrow="capabilities"
                title="What DOOM can do"
                subtitle="A focused set of tools designed for fast, expressive conversation."
            />
            <Bento />

            <div className="mt-20">
                <SectionHeader
                    eyebrow="the details"
                    title="Built for the long haul"
                    subtitle="Eight principles that shape every decision we make."
                />
                <Bento2 />
            </div>

            <FooterCTA />
        </div>
    );
};

const PageHero = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-10 overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/70 p-8 md:p-12"
        >
            <div className="pointer-events-none absolute inset-0 bg-aurora" />
            <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-30" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                    <span className="chip mb-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        dashboard
                    </span>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        Good to see you.
                    </h1>
                    <p className="mt-3 max-w-md text-sm text-white/55 md:text-base">
                        Your conversations, your people, your space. Jump back in
                        where you left off.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/pages/CommunityPage" className="btn-primary">
                            Find people
                            <IconArrowUpRight className="h-4 w-4" />
                        </Link>
                        <Link href="/pages/Profile" className="btn-ghost">
                            Your profile
                        </Link>
                    </div>
                </div>

                <div className="relative hidden aspect-square w-56 shrink-0 md:block">
                    <div className="absolute inset-0 animate-float rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent" />
                    <div className="absolute inset-6 flex items-center justify-center rounded-3xl border border-white/10 bg-surface-2/60 backdrop-blur-xl">
                        <IconSparkles className="h-10 w-10 text-emerald-300" />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

const StatsRow = () => {
    const stats = [
        { label: "Active chats", value: "12", icon: IconMessage, trend: "+3" },
        { label: "Friends online", value: "8", icon: IconUsersGroup, trend: "+2" },
        { label: "This week", value: "147", icon: IconTrendingUp, trend: "+24%" },
    ];
    return (
        <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
                <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1/60 p-5 transition-colors hover:border-emerald-400/20"
                >
                    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl transition-opacity group-hover:bg-emerald-500/15" />
                    <div className="relative flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                            <s.icon className="h-4 w-4" />
                        </span>
                        <span className="font-mono text-[11px] text-emerald-300">
                            {s.trend}
                        </span>
                    </div>
                    <p className="relative mt-5 font-display text-3xl font-semibold tracking-tight text-white">
                        {s.value}
                    </p>
                    <p className="relative mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                        {s.label}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

const SectionHeader = ({
    eyebrow,
    title,
    subtitle,
}: {
    eyebrow: string;
    title: string;
    subtitle: string;
}) => (
    <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
            {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-white/50">{subtitle}</p>
    </div>
);

const FooterCTA = () => (
    <div className="mt-24 flex flex-col items-center gap-3 border-t border-white/[0.05] pt-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            made with care · v0.1
        </p>
    </div>
);
