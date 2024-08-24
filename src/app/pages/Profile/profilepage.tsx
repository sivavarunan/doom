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

// Mock function to simulate fetching user data
const fetchUserData = async () => {
    return {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
    };
};

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
            <Profile />
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
const Profile = () => {
    return (
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar or Profile Summary */}
        <div className="flex flex-col items-center  p-4 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 md:w-1/3 w-full h-full">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-neutral-800 mb-4 animate-pulse"></div>
          
          {/* User Name */}
          <div className="h-6 w-3/4 rounded-lg bg-gray-100 dark:bg-neutral-800 mb-2 animate-pulse"></div>
          
          {/* Bio */}
          <div className="h-4 w-2/3 rounded-lg bg-gray-100 dark:bg-neutral-800 mb-4 animate-pulse"></div>
          
          {/* Additional Info */}
          <div className="flex gap-2 w-full justify-around">
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
          </div>
        </div>
  
        {/* Main Content Area */}
        <div className="flex flex-col gap-4 md:gap-8 flex-1 p-4 md:p-6  border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-full h-full">
          {/* Section 1 */}
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={"first-array" + i}
                className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
              ></div>
            ))}
          </div>
  
          {/* Section 2 */}
          <div className="flex gap-4 flex-1">
            {[...Array(2)].map((_, i) => (
              <div
                key={"second-array" + i}
                className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
              ></div>
            ))}
          </div>
  
          {/* Section 3 - Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={"third-array" + i}
                className="h-32 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  

