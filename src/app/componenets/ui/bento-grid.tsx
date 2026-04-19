import { cn } from "@/lib/utils";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "group/bento relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-1/70 p-5 transition-all duration-300 hover:border-emerald-400/20 hover:bg-surface-1",
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100" />

            <div className="relative flex-1 overflow-hidden rounded-xl">{header}</div>

            <div className="relative mt-4 transition-transform duration-300 group-hover/bento:translate-y-[-2px]">
                <div className="flex items-center gap-2">
                    {icon && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                            {icon}
                        </span>
                    )}
                    <h3 className="font-display text-[15px] font-medium text-white">
                        {title}
                    </h3>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
                    {description}
                </p>
            </div>
        </div>
    );
};
