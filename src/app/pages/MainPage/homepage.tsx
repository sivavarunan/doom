"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SidebarComp() {
    const links = [
        {
            label: "Dashboard",
            href: "/pages/MainPage",
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Profile",
            href: "/pages/Profile",
            icon: (
                <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Settings",
            href: "/pages/Settings",
            icon: (
                <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Logout",
            href: "/pages/LoginPage",
            icon: (
                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "flex flex-col md:flex-row bg-gray-100 dark:bg-gradient-to-t from-neutral-800 to-neutral-900 w-full h-screen overflow-hidden"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "About",
                                href: "/pages/AboutPage",
                                icon: (
                                    <Image
                                        src="/anime.jpg"
                                        className="h-7 w-7 flex-shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard />
        </div>
    );
}
export const Logo = () => {
    return (
        <Link
            href="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                DOOM
            </motion.span>
        </Link>
    );
};
export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};

const Dashboard = () => {
    return (
        <div className="flex flex-col w-full h-full  bg-neutral-800">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-gradient-to-t from-neutral-800 to-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                <div className="relative w-full h-52 rounded-lg mb-10">
                    <div className="absolute inset-0 bg-gray-300 dark:bg-neutral-800 animate-pulse "></div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-sm">
                        <h1 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-green-400 via-emerald-600 to-teal-700 text-5xl md:text-6xl mt-6 font-bold">
                            Dashboard
                        </h1>
                    </div>
                    {/* Hero Section */}
                </div>
            </div>
        </div>
    );
};





// Dummy dashboard component with content

//  <div className="flex flex-1">
//     <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
//         <div className="flex gap-2">
//             {[...new Array(4)].map((i) => (
//                 <div
//                     key={"first-array" + i}
//                     className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//                 ></div>
//             ))}
//         </div>
//         <div className="flex gap-2 flex-1">
//             {[...new Array(2)].map((i) => (
//                 <div
//                     key={"second-array" + i}
//                     className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//                 ></div>
//             ))}
//         </div>
//     </div>
// </div> 

