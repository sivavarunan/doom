"use client";
import React from "react";
import { motion } from "framer-motion";
import {
    IconMessage,
    IconPaperclip,
    IconSparkles,
    IconWorld,
    IconMicrophone,
} from "@tabler/icons-react";
import { BentoGrid, BentoGridItem } from "@/app/componenets/ui/bento-grid";
import { cn } from "@/lib/utils";

export function Bento() {
    return (
        <BentoGrid>
            {items.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    className={cn(item.className)}
                    icon={item.icon}
                />
            ))}
        </BentoGrid>
    );
}

const ChatPreview = () => {
    const variants = {
        initial: { x: 0 },
        animate: { x: 6, rotate: 1.2, transition: { duration: 0.3 } },
    };
    const variantsAlt = {
        initial: { x: 0 },
        animate: { x: -6, rotate: -1.2, transition: { duration: 0.3 } },
    };
    return (
        <motion.div
            initial="initial"
            whileHover="animate"
            className="flex h-full w-full flex-col justify-center gap-2.5 p-4"
        >
            <motion.div
                variants={variants}
                className="flex max-w-[82%] items-center gap-2 rounded-xl rounded-tl-sm border border-white/[0.06] bg-surface-2/80 p-2.5"
            >
                <span className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" />
                <span className="h-1.5 w-24 rounded-full bg-white/15" />
            </motion.div>
            <motion.div
                variants={variantsAlt}
                className="flex max-w-[68%] items-center gap-2 self-end rounded-xl rounded-tr-sm bg-gradient-to-br from-emerald-400/90 to-teal-500/90 p-2.5"
            >
                <span className="h-1.5 w-20 rounded-full bg-black/25" />
                <span className="h-1.5 w-10 rounded-full bg-black/25" />
            </motion.div>
            <motion.div
                variants={variants}
                className="flex max-w-[75%] items-center gap-2 rounded-xl rounded-tl-sm border border-white/[0.06] bg-surface-2/80 p-2.5"
            >
                <span className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" />
                <span className="h-1.5 w-32 rounded-full bg-white/15" />
            </motion.div>
        </motion.div>
    );
};

const FilePreview = () => {
    const lines = [
        { w: "70%", delay: 0 },
        { w: "46%", delay: 0.05 },
        { w: "82%", delay: 0.1 },
        { w: "58%", delay: 0.15 },
        { w: "34%", delay: 0.2 },
    ];
    return (
        <motion.div
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="flex h-full w-full flex-col justify-center gap-2 p-4"
        >
            {lines.map((l, i) => (
                <motion.div
                    key={i}
                    variants={{
                        initial: { width: 0 },
                        animate: { width: l.w },
                        hover: { width: ["0%", l.w] },
                    }}
                    transition={{ duration: 0.6, delay: l.delay }}
                    style={{ maxWidth: l.w }}
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400/70 via-emerald-500/40 to-transparent"
                />
            ))}
        </motion.div>
    );
};

const AIShimmer = () => {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <motion.div
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 30%, rgba(52,211,153,0.45), transparent 60%)",
                        "radial-gradient(circle at 80% 70%, rgba(20,184,166,0.45), transparent 60%)",
                        "radial-gradient(circle at 30% 80%, rgba(110,231,183,0.45), transparent 60%)",
                        "radial-gradient(circle at 20% 30%, rgba(52,211,153,0.45), transparent 60%)",
                    ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-surface-2/80 backdrop-blur-xl">
                <IconSparkles className="h-6 w-6 text-emerald-300" />
            </div>
        </div>
    );
};

const ProfilesPreview = () => {
    const first = {
        initial: { x: 16, rotate: -4 },
        hover: { x: 0, rotate: 0 },
    };
    const second = {
        initial: { x: -16, rotate: 4 },
        hover: { x: 0, rotate: 0 },
    };
    const profiles = [
        { name: "Eren", role: "Designer", color: "from-emerald-400 to-teal-500" },
        { name: "Mikasa", role: "Engineer", color: "from-teal-400 to-cyan-500" },
        { name: "Armin", role: "Writer", color: "from-emerald-300 to-green-500" },
    ];
    return (
        <motion.div
            initial="initial"
            whileHover="hover"
            className="flex h-full w-full items-center justify-center gap-2 p-4"
        >
            <motion.div
                variants={first}
                className="flex w-1/3 flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-surface-2/60 p-3"
            >
                <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${profiles[0].color}`} />
                <p className="text-xs font-medium text-white">{profiles[0].name}</p>
                <p className="font-mono text-[10px] text-white/40">{profiles[0].role}</p>
            </motion.div>
            <motion.div className="relative z-10 flex w-1/3 flex-col items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-surface-2/80 p-3 shadow-glow">
                <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${profiles[1].color}`} />
                <p className="text-xs font-medium text-white">{profiles[1].name}</p>
                <p className="font-mono text-[10px] text-emerald-300">online</p>
            </motion.div>
            <motion.div
                variants={second}
                className="flex w-1/3 flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-surface-2/60 p-3"
            >
                <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${profiles[2].color}`} />
                <p className="text-xs font-medium text-white">{profiles[2].name}</p>
                <p className="font-mono text-[10px] text-white/40">{profiles[2].role}</p>
            </motion.div>
        </motion.div>
    );
};

const VoicePreview = () => {
    const bars = Array.from({ length: 22 });
    return (
        <div className="flex h-full w-full items-center justify-center gap-1 p-4">
            {bars.map((_, i) => (
                <motion.span
                    key={i}
                    animate={{
                        height: [
                            `${8 + Math.sin(i) * 12}px`,
                            `${24 + Math.cos(i * 0.8) * 18}px`,
                            `${8 + Math.sin(i) * 12}px`,
                        ],
                    }}
                    transition={{
                        duration: 1.2 + (i % 4) * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.04,
                    }}
                    className="w-1 rounded-full bg-gradient-to-t from-emerald-400/30 to-emerald-300"
                />
            ))}
        </div>
    );
};

const items = [
    {
        title: "Send messages",
        description: "Real-time conversations with anyone, anywhere on the planet.",
        header: <ChatPreview />,
        className: "md:col-span-1",
        icon: <IconMessage className="h-3.5 w-3.5" />,
    },
    {
        title: "File sharing",
        description: "Drop a file into chat. It's there. No cold-start, no friction.",
        header: <FilePreview />,
        className: "md:col-span-1",
        icon: <IconPaperclip className="h-3.5 w-3.5" />,
    },
    {
        title: "AI assist",
        description: "Contextual suggestions and smart replies when you need them.",
        header: <AIShimmer />,
        className: "md:col-span-1",
        icon: <IconSparkles className="h-3.5 w-3.5" />,
    },
    {
        title: "A global community",
        description: "Find people, build friendships, and spark conversations across borders.",
        header: <ProfilesPreview />,
        className: "md:col-span-2",
        icon: <IconWorld className="h-3.5 w-3.5" />,
    },
    {
        title: "Voice messages",
        description: "When typing isn't enough, speak your mind in a single tap.",
        header: <VoicePreview />,
        className: "md:col-span-1",
        icon: <IconMicrophone className="h-3.5 w-3.5" />,
    },
];
