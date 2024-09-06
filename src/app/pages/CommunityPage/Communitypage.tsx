"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconWorld,
} from "@tabler/icons-react";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase';
import UserCard from '@/app/componenets/ui/usercard';
import { PlaceholdersAndVanishInput } from "@/app/componenets/ui/searchbar";
import { toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Globe } from "@/app/componenets/ui/Globe"
import { Logo } from "@/app/componenets/logo";
import { LogoIcon } from "@/app/componenets/LogoIcon";

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
                    <Community />
                </div>
            </div>
        </div>

    );
}

const Community = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const auth = getAuth();

    const placeholders = [
        "Eren Yeager",
        "NoobMaster69",
        "Mikasa",
        "DOGO420",
        "username1234",
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const userSnapshot = await getDocs(usersCollection);
                const userList = userSnapshot.docs.map((doc) => doc.data());
                setUsers(userList);
                setFilteredUsers(userList);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const Spinner = () => (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-solid border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    const handleAddFriend = async (uid: string) => {
        try {
            const currentUser = auth.currentUser?.uid;

            if (!currentUser) {
                console.error('No current user found.');
                return;
            }

            const friendsCollection = collection(db, 'friends');
            const q = query(friendsCollection, where('userId', '==', currentUser), where('friendId', '==', uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(friendsCollection, { userId: currentUser, friendId: uid });
                console.log(`Added friend with UID: ${uid}`);
                toast.success("Freind added", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide,
                });
            } else {
                console.log('Friendship already exists');
            }
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="dark:bg-gradient-to-b from-emerald-950 to-neutral-950 bg-neutral-50">
            <div className="p-2 md:p-10 rounded-tl-2xl border-2 border-neutral-700 dark:border-neutral-950 bg-gray-100 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 flex flex-col gap-2 flex-1 w-full h-full">
                <div className="flex flex-col w-full h-full">
                    <div className="relative w-full h-52 rounded-lg mb-10">
                        <div className="absolute inset-0 bg-white dark:bg-neutral-950 animate-pulse rounded-2xl"></div>
                        <div className="absolute inset-0  dark:bg-inherit  bg-opacity-50 flex items-center justify-center rounded-2xl">
                            <h1 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-green-400 via-emerald-600 to-teal-700 text-5xl md:text-6xl mt-6 font-bold">
                                Community
                            </h1>
                        </div>
                    </div>

                    {/* Main Content Layout */}
                    <div className="flex flex-col md:flex-row gap-4 w-full h-full">
                        {/* Left Section */}
                        <div className="flex-1 bg-gray-100 dark:bg-neutral-900 dark:bg-opacity-40 p-4 rounded-lg">
                            <h1 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-3 from-green-500 via-emerald-600 to-teal-700 text-4xl md:text-3xl font-bold">
                                Welcome to the Community Page
                            </h1>
                            <p className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r  from-green-200 via-emerald-400 to-teal-600 text-2xl md:text-xl font-bold">We connect people all around the Globe</p>
                            <div className=" flex justify-center items-center">
                                <Globe className="mt-4" />
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-neutral-900 dark:bg-opacity-40 p-4 rounded-lg">
                            <h2 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-3 from-green-400 via-emerald-600 to-teal-700 text-4xl md:text-3xl font-bold">Users</h2>
                            <form onSubmit={handleSubmit} className="mb-4">
                                <PlaceholdersAndVanishInput
                                    placeholders={placeholders}
                                    onChange={handleChange}
                                    onSubmit={handleSubmit}
                                />
                            </form>
                            <div className="grid grid-cols-1 gap-4">
                                {filteredUsers.map((user) => (
                                    <UserCard
                                        key={user.uid}
                                        uid={user.uid}
                                        profileImage={user.profileImage}
                                        firstname={user.firstname}
                                        lastname={user.lastname}
                                        online={user.online}
                                        onAddFriend={() => handleAddFriend(user.uid)}
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