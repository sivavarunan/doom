"use client";
import Link from "next/link";
import { LogoMark } from "./logo";

export const LogoIcon = () => {
    return (
        <Link
            href="/"
            aria-label="DOOM home"
            className="flex items-center py-1 pl-1"
        >
            <LogoMark />
        </Link>
    );
};
