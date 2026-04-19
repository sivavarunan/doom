"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    IconBrandGithub,
    IconBrandGoogle,
    IconArrowRight,
    IconAlertTriangle,
} from "@tabler/icons-react";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import { auth, db } from "@/app/firebase";
import { Label } from "@/app/componenets/ui/label";
import { Input } from "@/app/componenets/ui/input";
import { Logo } from "@/app/componenets/logo";
import {
    AuthShell,
    LabelInputContainer,
    FieldError,
} from "../login/login";
import { toast, Bounce, Zoom } from "react-toastify";

export function SignupForm() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        general: "",
    });

    const router = useRouter();
    const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const next = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
            general: "",
        };

        if (!firstname.trim()) next.firstname = "Required";
        if (!lastname.trim()) next.lastname = "Required";
        if (!email.trim()) next.email = "Required";
        else if (!validateEmail(email)) next.email = "Invalid email";
        if (!password.trim()) next.password = "Required";
        else if (password.length < 8) next.password = "Minimum 8 characters";
        if (!confirmPassword.trim()) next.confirmPassword = "Required";
        else if (password !== confirmPassword)
            next.confirmPassword = "Passwords don't match";

        setErrors(next);
        const hasErr = Object.values(next).some((v) => v);
        if (hasErr) return;

        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const user = cred.user;
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstname,
                lastname,
                email,
            });
            toast.success("Account created", { transition: Zoom });
            router.push("/pages/LoginPage");
        } catch (err: any) {
            toast.error("Sign up failed", { transition: Bounce });
            if (err.code === "auth/email-already-in-use") {
                setErrors((p) => ({ ...p, email: "Email already in use" }));
            } else {
                setErrors((p) => ({
                    ...p,
                    general: "Something went wrong. Try again.",
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/pages/LoginPage");
        } catch (err: any) {
            toast.error("Google sign-in failed", { transition: Bounce });
        }
    };

    return (
        <AuthShell>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <div className="mb-8 flex items-center justify-between">
                    <Logo />
                    <span className="chip">sign up</span>
                </div>

                <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Create your account.
                </h1>
                <p className="mt-2 text-sm text-white/55">
                    Already a member?{" "}
                    <Link
                        href="/pages/LoginPage"
                        className="font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                    >
                        Sign in →
                    </Link>
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {errors.general && (
                        <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/[0.08] px-3 py-2.5 text-sm text-rose-200">
                            <IconAlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <LabelInputContainer>
                            <Label htmlFor="firstname">First name</Label>
                            <Input
                                id="firstname"
                                placeholder="Eren"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                            {errors.firstname && (
                                <FieldError>{errors.firstname}</FieldError>
                            )}
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="lastname">Last name</Label>
                            <Input
                                id="lastname"
                                placeholder="Yeager"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                            {errors.lastname && (
                                <FieldError>{errors.lastname}</FieldError>
                            )}
                        </LabelInputContainer>
                    </div>

                    <LabelInputContainer>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="you@doom.app"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <FieldError>{errors.email}</FieldError>}
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <FieldError>{errors.password}</FieldError>}
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && (
                            <FieldError>{errors.confirmPassword}</FieldError>
                        )}
                    </LabelInputContainer>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary group w-full !py-3"
                    >
                        {loading ? "Creating account…" : "Create account"}
                        {!loading && (
                            <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        )}
                    </button>

                    <div className="relative my-6 flex items-center">
                        <div className="h-px flex-1 bg-white/[0.08]" />
                        <span className="px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                            or
                        </span>
                        <div className="h-px flex-1 bg-white/[0.08]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="btn-ghost !py-2.5"
                            onClick={handleGoogleSignIn}
                        >
                            <IconBrandGoogle className="h-4 w-4" />
                            Google
                        </button>
                        <button type="button" className="btn-ghost !py-2.5">
                            <IconBrandGithub className="h-4 w-4" />
                            GitHub
                        </button>
                    </div>
                </form>
            </motion.div>
        </AuthShell>
    );
}
