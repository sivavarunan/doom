"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
    IconArrowLeft,
    IconLayoutDashboard,
    IconUserBolt,
    IconWorld,
    IconSettings,
    IconInfoCircle,
} from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import { Logo } from "@/app/componenets/logo";
import { LogoIcon } from "@/app/componenets/LogoIcon";
import { toast, Bounce } from "react-toastify";
import { cn } from "@/lib/utils";

async function clearIndexedDB() {
    const knownDbs = ["/firebaseLocalStorageDb", "firebaselocalstorage"];
    knownDbs.forEach((dbName) => {
        try {
            indexedDB.deleteDatabase(dbName);
        } catch {
            /* ignore */
        }
    });
    try {
        const dbs = await indexedDB.databases();
        dbs.forEach((dbInfo) => {
            if (dbInfo.name) indexedDB.deleteDatabase(dbInfo.name);
        });
    } catch {
        /* ignore */
    }
}

export function AppShell({
    children,
    contentClassName,
}: {
    children: React.ReactNode;
    contentClassName?: string;
}) {
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        localStorage.removeItem("authToken");
        await clearIndexedDB();
        localStorage.clear();
        sessionStorage.clear();

        toast.success("Signed out", { transition: Bounce });
        window.location.href = "/pages/LoginPage";
    };

    const iconCls = "h-[18px] w-[18px]";

    const links = [
        {
            label: "Dashboard",
            href: "/pages/MainPage",
            icon: <IconLayoutDashboard className={iconCls} />,
        },
        {
            label: "Profile",
            href: "/pages/Profile",
            icon: <IconUserBolt className={iconCls} />,
        },
        {
            label: "Community",
            href: "/pages/CommunityPage",
            icon: <IconWorld className={iconCls} />,
        },
        {
            label: "Settings",
            href: "/pages/Settings",
            icon: <IconSettings className={iconCls} />,
        },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-ink md:h-screen md:flex-row">
            <div className="pointer-events-none absolute inset-0 bg-aurora opacity-80" />
            <div className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay" />

            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-8">
                    <div className="flex min-h-0 flex-1 flex-col">
                        <div className="px-1 pb-6">{open ? <Logo /> : <LogoIcon />}</div>

                        <div className="px-1 pb-2">
                            <span
                                className={cn(
                                    "text-[10px] font-mono uppercase tracking-[0.18em] text-white/30 transition-opacity",
                                    open ? "opacity-100" : "opacity-0"
                                )}
                            >
                                Workspace
                            </span>
                        </div>

                        <nav className="flex flex-col gap-0.5">
                            {links.map((link) => (
                                <SidebarLink key={link.href} link={link} />
                            ))}
                        </nav>
                    </div>

                    <div className="flex flex-col gap-0.5 border-t border-white/[0.06] pt-4">
                        <SidebarLink
                            link={{
                                label: "About",
                                href: "/pages/AboutPage",
                                icon: <IconInfoCircle className={iconCls} />,
                            }}
                        />
                        <SidebarLink
                            link={{
                                label: "Sign out",
                                href: "#",
                                icon: <IconArrowLeft className={iconCls} />,
                                onClick: (e?: any) => {
                                    e?.preventDefault?.();
                                    handleLogout();
                                },
                            }}
                        />

                        <div
                            className={cn(
                                "mt-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 transition-opacity",
                                open ? "opacity-100" : "opacity-0 pointer-events-none"
                            )}
                        >
                            <Image
                                src="/anime.jpg"
                                width={36}
                                height={36}
                                alt=""
                                className="h-8 w-8 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-white">
                                    Signed in
                                </p>
                                <p className="truncate text-[10px] font-mono text-white/40">
                                    doom.app
                                </p>
                            </div>
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>

            <main
                className={cn(
                    "relative z-10 flex-1 overflow-y-auto custom-scrollbar",
                    contentClassName
                )}
            >
                {children}
            </main>
        </div>
    );
}
