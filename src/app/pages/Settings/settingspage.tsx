"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    IconBell,
    IconLock,
    IconPalette,
    IconShieldLock,
    IconUser,
} from "@tabler/icons-react";
import { AppShell } from "@/app/componenets/AppShell";
import { cn } from "@/lib/utils";

export function SidebarComp() {
    return (
        <AppShell>
            <Settings />
        </AppShell>
    );
}

type SectionDef = {
    id: string;
    title: string;
    description: string;
    icon: typeof IconUser;
    items: { label: string; description: string; toggle?: boolean }[];
};

const sections: SectionDef[] = [
    {
        id: "account",
        title: "Account",
        description: "Manage your identity and credentials.",
        icon: IconUser,
        items: [
            { label: "Change Email", description: "Update your email address." },
            { label: "Change Password", description: "Rotate your account password." },
        ],
    },
    {
        id: "privacy",
        title: "Privacy",
        description: "Control how your data is protected.",
        icon: IconShieldLock,
        items: [
            {
                label: "Two-Factor Authentication",
                description: "Require a second factor on sign-in.",
                toggle: true,
            },
            {
                label: "Manage Sessions",
                description: "Review active devices and sessions.",
            },
        ],
    },
    {
        id: "notifications",
        title: "Notifications",
        description: "Tune how and when DOOM reaches you.",
        icon: IconBell,
        items: [
            {
                label: "Email Notifications",
                description: "Summary and security alerts via email.",
                toggle: true,
            },
            {
                label: "Push Notifications",
                description: "Realtime alerts on this device.",
                toggle: true,
            },
        ],
    },
    {
        id: "appearance",
        title: "Appearance",
        description: "General preferences across the app.",
        icon: IconPalette,
        items: [
            { label: "Dark Mode", description: "Use the dark theme.", toggle: true },
            {
                label: "Language",
                description: "Select your preferred language.",
            },
        ],
    },
];

const Settings = () => {
    return (
        <div className="mx-auto w-full max-w-5xl px-5 py-6 md:px-10 md:py-10">
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative mb-10 overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/70 p-8 md:p-10"
            >
                <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
                <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-25" />
                <div className="relative z-10">
                    <span className="chip mb-4">
                        <IconLock className="h-3.5 w-3.5" />
                        settings
                    </span>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        Make it yours.
                    </h1>
                    <p className="mt-3 max-w-xl text-sm text-white/55 md:text-base">
                        Fine-tune account, privacy, notifications and appearance. All changes
                        save instantly.
                    </p>
                </div>
            </motion.section>

            <div className="space-y-6">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05, duration: 0.45 }}
                        className="rounded-3xl border border-white/[0.06] bg-surface-1/60 p-6 md:p-8"
                    >
                        <div className="flex items-start gap-4 border-b border-white/[0.05] pb-5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                                <section.icon className="h-4 w-4" />
                            </span>
                            <div className="flex-1">
                                <h3 className="font-display text-lg font-semibold text-white">
                                    {section.title}
                                </h3>
                                <p className="mt-0.5 text-sm text-white/50">
                                    {section.description}
                                </p>
                            </div>
                            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 md:inline">
                                #{section.id}
                            </span>
                        </div>

                        <div className="mt-5 divide-y divide-white/[0.04]">
                            {section.items.map((item) => (
                                <SettingItem key={item.label} {...item} />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const SettingItem = ({
    label,
    description,
    toggle,
}: {
    label: string;
    description: string;
    toggle?: boolean;
}) => {
    const [isToggled, setIsToggled] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(label);
        if (stored) setIsToggled(stored === "true");
    }, [label]);

    const handleToggle = () => {
        const next = !isToggled;
        setIsToggled(next);
        localStorage.setItem(label, String(next));
        if (label === "Dark Mode") {
            document.documentElement.classList.toggle("dark", next);
        }
    };

    return (
        <div className="flex items-center justify-between gap-5 py-4">
            <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-white">{label}</h4>
                <p className="mt-0.5 text-[13px] text-white/50">{description}</p>
            </div>
            {toggle ? (
                <label className="relative inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={isToggled}
                        onChange={handleToggle}
                    />
                    <div
                        className={cn(
                            "h-6 w-11 rounded-full border border-white/[0.08] bg-white/[0.05] transition-colors",
                            "peer-checked:border-emerald-400/40 peer-checked:bg-emerald-500/80",
                            "after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-all after:content-['']",
                            "peer-checked:after:translate-x-5"
                        )}
                    />
                </label>
            ) : (
                <button className="btn-ghost text-xs">Open</button>
            )}
        </div>
    );
};
