"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { Label } from "@/app/componenets/ui/label";
import { Input } from "@/app/componenets/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Errors {
    email?: string;
    password?: string;
    general?: string;
}

export function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});

    const router = useRouter();

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors: Errors = {};

        if (!email) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address.";
            valid = false;
        }

        if (!password) {
            newErrors.password = "Password is required.";
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Use Firebase Auth client SDK to sign in
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                
                if (userCredential.user) {
                    // Store the JWT token in localStorage (if needed)
                    const token = await userCredential.user.getIdToken();
                    localStorage.setItem('authToken', token);

                    // Redirect to the home page
                    router.push("/");
                } else {
                    throw new Error('No user credential received');
                }
            } catch (error: any) {
                console.error("Error logging in:", error.message);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    general: "Invalid Email or Password",
                }));
            }
        }
    };

    return (
        <div className="max-w-md w-full mx-auto my-40 rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
                Welcome to Doom
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Don&apos;t have an account? <a href="/pages/LoginPage/signup" className="text-green-300">Sign Up</a> here.
            </p>
            <form className="my-8" onSubmit={handleSubmit}>
                <h3 className="text-neutral-600 mb-3 text-xl dark:text-neutral-300 font-bold">
                    Login
                </h3>
                {errors.general && (
                    <div className="text-red-600 text-sm font-mono mb-4">{errors.general}</div>
                )}
                <div className="mb-2 space-y-2">
                    <LabelInputContainer>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            placeholder="example@gmail.com"
                            type="email"
                            aria-label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <span className="text-red-600 text-sm font-mono">{errors.email}</span>
                        )}
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            aria-label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                            <span className="text-red-600 text-sm font-mono">{errors.password}</span>
                        )}
                    </LabelInputContainer>
                    <button
                        className="bg-gradient-to-br top-4 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                    >
                        Login &rarr;
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
}

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </>
    );
};
