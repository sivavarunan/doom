"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const [focused, setFocused] = React.useState(false);
        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        function handleMouseMove({
            currentTarget,
            clientX,
            clientY,
        }: React.MouseEvent<HTMLDivElement>) {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
        }

        return (
            <motion.div
                onMouseMove={handleMouseMove}
                style={{
                    background: useMotionTemplate`radial-gradient(180px circle at ${mouseX}px ${mouseY}px, rgba(52,211,153,0.22), transparent 70%)`,
                }}
                className={cn(
                    "group/input relative rounded-xl p-[1px] transition-all duration-200",
                    focused
                        ? "bg-gradient-to-br from-emerald-400/40 via-emerald-500/10 to-transparent"
                        : "bg-white/[0.06]"
                )}
            >
                <input
                    ref={ref}
                    type={type}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={cn(
                        "flex h-11 w-full rounded-[11px] border-none bg-[rgb(var(--surface-2))] px-4 text-sm text-white placeholder:text-white/30",
                        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-colors duration-200",
                        className
                    )}
                    {...props}
                />
            </motion.div>
        );
    }
);
Input.displayName = "Input";

export { Input };
