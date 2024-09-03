"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconWorld,
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/componenets/logo";
import { LogoIcon } from "@/app/componenets/LogoIcon";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
            <Settings />
        </div>
    );
}

// Dummy Profile component with content
const Settings = () => {
    return (
        <div className="flex flex-col md:flex-row flex-1 ">
            {/* Sidebar or Navigation */}
            <div className="flex flex-col p-4 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 md:w-1/4 w-full h-full">
                {/* Settings Categories */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={"settings-category" + i}
                        className="h-10 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 mb-4 animate-pulse"
                    ></div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-4 md:gap-8 flex-1 p-4 md:p-6  border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-full h-full">
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


