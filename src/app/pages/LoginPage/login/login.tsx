"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { IconArrowRight, IconAlertTriangle } from "@tabler/icons-react";

import { auth } from "@/app/firebase";
import { Label } from "@/app/componenets/ui/label";
import { Input } from "@/app/componenets/ui/input";
import { Logo } from "@/app/componenets/logo";
import { cn } from "@/lib/utils";
import { toast, Bounce, Zoom } from "react-toastify";

interface Errors {
    email?: string;
    password?: string;
    general?: string;
}

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const validateForm = () => {
        const next: Errors = {};
        if (!email) next.email = "Email is required";
        else if (!validateEmail(email)) next.email = "Enter a valid email";
        if (!password) next.password = "Password is required";
        else if (password.length < 6) next.password = "Minimum 6 characters";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            if (cred.user) {
                const token = await cred.user.getIdToken();
                localStorage.setItem("authToken", token);
                toast.success("Welcome back", { transition: Zoom });
                router.push("/pages/MainPage");
            }
        } catch (err: any) {
            toast.error("Login failed", { transition: Bounce });
            setErrors((p) => ({ ...p, general: "Invalid email or password" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="mb-10 flex items-center justify-between">
                    <Logo />
                    <span className="chip">login</span>
                </div>

                <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Welcome back.
                </h1>
                <p className="mt-2 text-sm text-white/55">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/pages/LoginPage/signup"
                        className="font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                    >
                        Create one →
                    </Link>
                </p>

                <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                    {errors.general && (
                        <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/[0.08] px-3 py-2.5 text-sm text-rose-200">
                            <IconAlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <LabelInputContainer>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="you@doom.app"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? "!ring-1 !ring-rose-500/40" : ""}
                        />
                        {errors.email && <FieldError>{errors.email}</FieldError>}
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <a
                                href="#"
                                className="text-[11px] text-white/40 hover:text-white/70"
                            >
                                Forgot?
                            </a>
                        </div>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? "!ring-1 !ring-rose-500/40" : ""}
                        />
                        {errors.password && <FieldError>{errors.password}</FieldError>}
                    </LabelInputContainer>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary group mt-2 w-full !py-3"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                        {!loading && (
                            <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center font-mono text-[11px] text-white/30">
                    secured · firebase · tls 1.3
                </p>
            </motion.div>
        </AuthShell>
    );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-12">
            <div className="pointer-events-none absolute inset-0 bg-aurora" />
            <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-30" />
            <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/[0.06] bg-surface-1/60 p-8 shadow-card backdrop-blur-xl md:p-10">
                {children}
            </div>
        </div>
    );
}

export const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
        {children}
    </div>
);

export const FieldError = ({ children }: { children: React.ReactNode }) => (
    <span className="font-mono text-[11px] text-rose-300/80">{children}</span>
);
