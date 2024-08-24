"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/app/componenets/ui/label";
import { Input } from "@/app/componenets/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/app/firebase";

export function SignupForm() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        general: "",
    });

    const router = useRouter();

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = { firstname: "", lastname: "", email: "", password: "", confirmPassword: "", general: "" };

        // First name validation
        if (!firstname.trim()) {
            newErrors.firstname = "First name is required.";
            formIsValid = false;
        }

        // Last name validation
        if (!lastname.trim()) {
            newErrors.lastname = "Last name is required.";
            formIsValid = false;
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Email is required.";
            formIsValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = "Invalid email address.";
            formIsValid = false;
        }

        // Password validation
        if (!password.trim()) {
            newErrors.password = "Password is required.";
            formIsValid = false;
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
            formIsValid = false;
        }

        // Confirm password validation
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password.";
            formIsValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            formIsValid = false;
        }

        setErrors(newErrors);

        if (formIsValid) {
            console.log("Form submitted");
            console.log(firstname, lastname, email, password, confirmPassword);
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("User registered:", user);
                router.push("/pages/LoginPage");

            } catch (error: any) {
                console.error("Error signing up:", error);
                if (error.code === "auth/email-already-in-use") {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: "Email is already in use.",
                    }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        general: "An error occurred during signup. Please try again.",
                    }));
                }
                // Handle other errors
            }
        }
    };
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User signed in with Google:", user);
            router.push("/pages/LoginPage");
        } catch (error: any) {
            console.error("Error signing in with Google:", error);
            alert(`Error: ${error.message}`); // Display the error message to the user
            // Handle Google Sign-In errors
        }
    };
    

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
                Create an Account
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Sign Up for free or if you have account <a href="/pages/LoginPage" className="text-green-300">Login</a>
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="firstname">First name</Label>
                        <Input
                            id="firstname"
                            placeholder="John"
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                        {errors.firstname && <p className="text-red-600 text-sm font-mono">{errors.firstname}</p>}
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input
                            id="lastname"
                            placeholder="Doe"
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                        {errors.lastname && <p className="text-red-600 text-sm font-mono">{errors.lastname}</p>}
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        placeholder="example@gmail.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-red-600 text-sm font-mono">{errors.email}</p>}
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-red-600 text-sm font-mono">{errors.password}</p>}
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="confirmPassword">Retype the password</Label>
                    <Input
                        id="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <p className="text-red-600 text-sm font-mono">{errors.confirmPassword}</p>}
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    Sign up &rarr;
                    <BottomGradient />
                </button>
                {errors.general && <p className="text-red-600 text-sm font-mono mt-4">{errors.general}</p>}

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-col space-y-4">
                    <button
                        className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                            GitHub
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                        onClick={handleGoogleSignIn}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                            Google
                        </span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </>
    );
};


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