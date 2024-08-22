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
                "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen overflow-hidden"
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
            <Settings />
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

// Dummy Profile component with content
const Settings = () => {
    return (
      <div className="flex flex-col md:flex-row flex-1 p-4 md:p-10">
        {/* Sidebar or Navigation */}
        <div className="flex flex-col p-4 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 md:w-1/4 w-full h-full">
          {/* Settings Categories */}
          {[...Array(5)].map((_, i) => (
            <div
              key={"settings-category" + i}
              className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 mb-4 animate-pulse"
            ></div>
          ))}
        </div>
  
        {/* Main Content Area */}
        <div className="flex flex-col gap-4 md:gap-8 flex-1 p-4 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-full h-full">
          {/* Section 1 - Account Settings */}
          <div className="flex flex-col gap-2">
            <div className="h-6 w-1/3 rounded-lg bg-gray-100 dark:bg-neutral-800 mb-2 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
          </div>
  
          {/* Section 2 - Privacy Settings */}
          <div className="flex flex-col gap-2">
            <div className="h-6 w-1/3 rounded-lg bg-gray-100 dark:bg-neutral-800 mb-2 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
          </div>
  
          {/* Section 3 - Notification Settings */}
          <div className="flex flex-col gap-2">
            <div className="h-6 w-1/3 rounded-lg bg-gray-100 dark:bg-neutral-800 mb-2 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
          </div>
  
          {/* Section 4 - Other Settings */}
          <div className="flex flex-col gap-2">
            <div className="h-6 w-1/3 rounded-lg bg-gray-100 dark:bg-neutral-800 mb-2 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  };
  

