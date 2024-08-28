"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconWorld,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import UserCard from '@/app/componenets/ui/usercard';

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
            <div className="flex-1 overflow-y-scroll custom-scrollbar">
                <div className="flex-1 overflow-auto">
                    <Community />
                </div>
            </div>
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

// Community component with content
const Community = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const validUsers = users.filter(user => user.uid);
    console.log(users);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const userSnapshot = await getDocs(usersCollection);
                const userList = userSnapshot.docs.map((doc) => doc.data());
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const Spinner = () => (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
    );

    const handleAddFriend = (uid: string) => {
        // add friend logic here
        console.log(`Add friend with UID: ${uid}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="dark:bg-neutral-800 bg-neutral-50">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-gradient-to-t from-neutral-800 to-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                <div className="flex flex-col w-full h-full ">

                    {/* Header Section */}
                    <div className="relative w-full h-52 rounded-lg mb-10">
                        <div className="absolute inset-0 bg-gray-300 dark:bg-neutral-800 animate-pulse"></div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-sm">
                            <h1 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-green-400 via-emerald-600 to-teal-700 text-5xl md:text-6xl mt-6 font-bold">
                                Community
                            </h1>
                        </div>
                    </div>

                    {/* Main Content Layout */}
                    <div className="flex flex-col md:flex-row gap-4 w-full h-full">
                        {/* Left Section */}
                        <div className="flex-1 bg-gray-100 dark:bg-neutral-900 p-4 rounded-lg">
                            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Welcome to the Community</h1>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                This is the left section.
                            </p>
                        </div>

                        {/* Right Section */}
                        <div className="flex-1 bg-gray-200 dark:bg-neutral-800 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Users</h2>
                            <div className="grid grid-cols-1   gap-4">
                                {validUsers.map((user) => (
                                    <UserCard
                                        key={user.uid}
                                        uid={user.uid}
                                        profileImage={user.profileImage}
                                        firstname={user.firstname}
                                        lastname={user.lastname}
                                        online={user.online}
                                        onAddFriend={handleAddFriend}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Community;

