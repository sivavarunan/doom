"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt, IconWorld, } from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Profile from './profile';
import { Logo } from "@/app/componenets/logo";
import { LogoIcon } from "@/app/componenets/LogoIcon";

export function SidebarComp() {
    const links = [
        {
            label: "Dashboard",
            href: "/pages/MainPage",
            icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Profile",
            href: "/pages/Profile",
            icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
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
            icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Logout",
            href: "/pages/LoginPage",
            icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
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
            <div className="flex-1 overflow-y-scroll dark:custom-scrollbar">
                <div className="flex-1 overflow-auto">
                    <Profile />
                </div>
            </div>
        </div>
    );
}


