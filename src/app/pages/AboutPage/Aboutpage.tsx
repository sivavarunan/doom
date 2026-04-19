"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandX,
    IconCloud,
    IconMail,
    IconMapPin,
    IconPhone,
    IconRocket,
    IconShieldLock,
    IconSparkles,
} from "@tabler/icons-react";
import { AppShell } from "@/app/componenets/AppShell";

export function SidebarComp() {
    return (
        <AppShell>
            <About />
        </AppShell>
    );
}

const values = [
    {
        title: "Security",
        description:
            "User data first. Firebase Auth, strict rules, no leaks in transit or at rest.",
        icon: IconShieldLock,
    },
    {
        title: "Performance",
        description:
            "Edge-hosted on Vercel. Sub-50ms delivery, instant cold starts, snappy UX.",
        icon: IconRocket,
    },
    {
        title: "Craft",
        description:
            "Every pixel considered. Every interaction felt. Details that reward attention.",
        icon: IconSparkles,
    },
];

const socials = [
    {
        label: "Facebook",
        href: "https://facebook.com/sivavarunan.siva",
        icon: IconBrandFacebook,
    },
    { label: "X", href: "https://twitter.com", icon: IconBrandX },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/thevarasa-sivavarunan-0b587a266",
        icon: IconBrandLinkedin,
    },
    {
        label: "Instagram",
        href: "https://instagram.com/sivavarunan",
        icon: IconBrandInstagram,
    },
];

const About = () => {
    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-6 md:px-10 md:py-10">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative mb-10 overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/70 p-8 md:p-14"
            >
                <div className="pointer-events-none absolute inset-0 bg-aurora" />
                <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-30" />
                <div className="relative z-10 max-w-2xl">
                    <span className="chip mb-4">
                        <IconCloud className="h-3.5 w-3.5" />
                        about
                    </span>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
                        A chat app, <span className="text-gradient-accent">reimagined</span>.
                    </h1>
                    <p className="mt-4 max-w-xl text-sm text-white/60 md:text-base">
                        DOOM is a Next.js + Firebase-powered messenger built on Vercel&apos;s
                        edge. Secure, fast, and quietly beautiful.
                    </p>
                </div>
            </motion.section>

            {/* Mission + Values */}
            <div className="mb-10 grid gap-5 lg:grid-cols-5">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/60 p-8 lg:col-span-2"
                >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                        mission
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
                        Build a messenger worth using every day.
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-white/60">
                        A robust Next.js web application, integrated with Firebase for secure
                        authentication and realtime data — hosted on Vercel for effortless
                        global performance. DOOM ships a seamless chat platform where
                        conversations flow, files share cleanly, and trust is the default.
                    </p>
                </motion.div>

                <div className="grid gap-4 lg:col-span-3">
                    {values.map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.05, duration: 0.45 }}
                            className="group flex items-start gap-5 rounded-3xl border border-white/[0.06] bg-surface-1/60 p-6 transition-colors hover:border-emerald-400/20"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 transition-colors group-hover:bg-emerald-500/20">
                                <v.icon className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-display text-lg font-semibold text-white">
                                    {v.title}
                                </h3>
                                <p className="mt-1 text-sm text-white/55">{v.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Contact */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/60 p-8 md:p-10"
            >
                <div className="pointer-events-none absolute inset-0 bg-aurora opacity-50" />
                <div className="relative grid gap-8 md:grid-cols-[auto,1fr] md:items-center">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-white/10 md:h-44 md:w-44">
                            <Image
                                src="/myphoto.jpg"
                                fill
                                sizes="176px"
                                className="object-cover"
                                alt="T.Sivavarunan"
                            />
                        </div>
                        <h3 className="mt-4 font-display text-lg font-semibold text-white">
                            T. Sivavarunan
                        </h3>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                            software engineer
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                                contact
                            </p>
                            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
                                Get in touch.
                            </h2>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <ContactRow
                                icon={<IconMail className="h-4 w-4" />}
                                label="email"
                                value={
                                    <a
                                        href="mailto:Tharagan2001@gmail.com"
                                        className="text-emerald-300 hover:underline"
                                    >
                                        Tharagan2001@gmail.com
                                    </a>
                                }
                            />
                            <ContactRow
                                icon={<IconPhone className="h-4 w-4" />}
                                label="phone"
                                value="+94 768 359 459"
                            />
                            <ContactRow
                                icon={<IconMapPin className="h-4 w-4" />}
                                label="address"
                                value="12th, 36th lane, Colombo 6, Sri Lanka"
                                wide
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/60 transition-all hover:-translate-y-0.5 hover:border-emerald-400/30 hover:text-emerald-300"
                                >
                                    <s.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

const ContactRow = ({
    icon,
    label,
    value,
    wide,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    wide?: boolean;
}) => (
    <div
        className={`flex items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5 ${
            wide ? "sm:col-span-2" : ""
        }`}
    >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
            {icon}
        </span>
        <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {label}
            </p>
            <p className="mt-0.5 truncate text-sm text-white/80">{value}</p>
        </div>
    </div>
);
