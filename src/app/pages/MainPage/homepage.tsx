"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconWorld
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Bento } from "./bentogrid";
import { Logo } from "@/app/componenets/logo";
import { LogoIcon } from "@/app/componenets/LogoIcon";
import { Bento2 } from "./bento2";
import { toast, Bounce } from "react-toastify";

export function SidebarComp() {

    const clearIndexedDB = async () => {
        const databases = [
            '/firebaseLocalStorageDb',
            'firebaselocalstorage',
        ];

        // Delete known databases
        databases.forEach((dbName) => {
            if (dbName) {
                const request = indexedDB.deleteDatabase(dbName);
                request.onsuccess = () => {
                    console.log(`IndexedDB ${dbName} cleared`);
                };
                request.onerror = (event) => {
                    console.error(`Error clearing IndexedDB ${dbName}:`, event);
                };
            }
        });

        // List and delete all databases
        try {
            const dbs = await indexedDB.databases();
            dbs.forEach((dbInfo) => {
                const dbName = dbInfo.name;
                if (dbName) {
                    const request = indexedDB.deleteDatabase(dbName);
                    request.onsuccess = () => {
                        console.log(`IndexedDB ${dbName} cleared`);
                    };
                    request.onerror = (event) => {
                        console.error(`Error clearing IndexedDB ${dbName}:`, event);
                    };
                }
            });
        } catch (error) {
            console.error('Error listing databases:', error);
        }
    };

    const handleLogout = async () => {
        // Remove auth token
        localStorage.removeItem('authToken');

        // Clear IndexedDB
        await clearIndexedDB();

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Notify user
        toast.success("Signed out successfully", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
        });

        // Redirect to Login page
        window.location.href = '/pages/LoginPage'; // Immediate redirection
    };

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
            label: "Community",
            href: "/pages/CommunityPage",
            icon: (
                <IconWorld className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
            onClick: handleLogout,
        },
    ];

    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "flex flex-col md:flex-row bg-gray-100 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 w-full h-screen overflow-hidden"
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
            <div className="flex-1 overflow-y-scroll dark:custom-scrollbar">
                <div className="flex-1 overflow-auto">
                    <Dashboard />
                </div>
            </div>
        </div>
    );
}

const Dashboard = () => {
    return (
        <div className="flex flex-col w-full h-full bg-neutral-50 dark:bg-gradient-to-b from-emerald-950 to-neutral-950">
            <div className="p-2 md:px-20 md:py-10 rounded-tl-2xl border-2 border-neutral-700 dark:border-2 dark:border-neutral-950 bg-gray-100 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 flex flex-col gap-2 flex-1 w-full h-full">
                <div className="relative w-full h-52 rounded-lg mb-10">
                    <div className="absolute inset-0 bg-white dark:bg-neutral-950 animate-pulse "></div>
                    <div className="absolute inset-0 dark:bg-inherit bg-opacity-50 flex items-center justify-center rounded-sm">
                        <h1 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-green-400 via-emerald-600 to-teal-700 text-5xl md:text-6xl mt-6 font-bold">
                            Dashboard
                        </h1>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="">
                    <Bento />
                </div>
                <div className=" mt-10">
                    <Bento2 />
                </div>
            </div>
        </div>
    );
};
