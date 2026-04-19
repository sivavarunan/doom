import { cn } from "@/lib/utils";
import {
    IconTerminal2,
    IconBolt,
    IconShieldLock,
    IconCloud,
    IconRouteAltLeft,
    IconHeadset,
    IconAdjustmentsBolt,
    IconHeart,
} from "@tabler/icons-react";

export function Bento2() {
    const features = [
        {
            title: "Built for builders",
            description: "Made for engineers, designers, and everyone in between.",
            icon: <IconTerminal2 className="h-4 w-4" />,
        },
        {
            title: "Ridiculously fast",
            description: "Under 50ms message delivery. No waiting, no jank.",
            icon: <IconBolt className="h-4 w-4" />,
        },
        {
            title: "Private by default",
            description: "Your chats are yours. End-to-end, always.",
            icon: <IconShieldLock className="h-4 w-4" />,
        },
        {
            title: "Built on Firebase",
            description: "Rock-solid infrastructure. 99.99% uptime.",
            icon: <IconCloud className="h-4 w-4" />,
        },
        {
            title: "Multi-device sync",
            description: "Pick up where you left off, on any device.",
            icon: <IconRouteAltLeft className="h-4 w-4" />,
        },
        {
            title: "Human support",
            description: "Real people, ready to help. Not bots.",
            icon: <IconHeadset className="h-4 w-4" />,
        },
        {
            title: "Thoughtful defaults",
            description: "Works beautifully out of the box — and bends to your will.",
            icon: <IconAdjustmentsBolt className="h-4 w-4" />,
        },
        {
            title: "Crafted with love",
            description: "Every pixel considered. Every interaction felt.",
            icon: <IconHeart className="h-4 w-4" />,
        },
    ];

    return (
        <div className="relative grid grid-cols-1 overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1/40 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "group/feature relative flex flex-col gap-3 p-7 transition-colors duration-300",
                "border-white/[0.05]",
                index % 4 !== 3 && "lg:border-r",
                index % 2 !== 1 && "md:border-r lg:border-r",
                index < 4 && "lg:border-b",
                index < 4 && index >= 2 && "md:border-b",
                index === 1 && "md:border-b lg:border-b-0"
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-500/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/feature:opacity-100" />
            <div className="pointer-events-none absolute inset-y-6 left-0 w-[2px] rounded-r-full bg-gradient-to-b from-emerald-300 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover/feature:opacity-100" />

            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300 transition-colors group-hover/feature:bg-emerald-500/15">
                {icon}
            </div>

            <div className="relative">
                <h3 className="font-display text-base font-semibold text-white transition-transform duration-300 group-hover/feature:translate-x-1">
                    {title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
                    {description}
                </p>
            </div>
        </div>
    );
};
