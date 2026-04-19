"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getAuth } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { IconSearch, IconUsers, IconWorld } from "@tabler/icons-react";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppShell } from "@/app/componenets/AppShell";
import { db } from "@/app/firebase";
import UserCard from "@/app/componenets/ui/usercard";
import { PlaceholdersAndVanishInput } from "@/app/componenets/ui/searchbar";
import { Globe } from "@/app/componenets/ui/Globe";

export function SidebarComp() {
    return (
        <AppShell>
            <Community />
        </AppShell>
    );
}

const placeholders = [
    "Eren Yeager",
    "NoobMaster69",
    "Mikasa",
    "DOGO420",
    "username1234",
];

const Community = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const auth = getAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snap = await getDocs(collection(db, "users"));
                const list = snap.docs.map((d) => d.data());
                setUsers(list);
                setFilteredUsers(list);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredUsers(
            users.filter(
                (u) =>
                    u.firstname?.toLowerCase().includes(term) ||
                    u.lastname?.toLowerCase().includes(term)
            )
        );
    }, [searchTerm, users]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(e.target.value);
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

    const handleAddFriend = async (uid: string) => {
        try {
            const currentUser = auth.currentUser?.uid;
            if (!currentUser) return;

            const friendsCollection = collection(db, "friends");
            const q = query(
                friendsCollection,
                where("userId", "==", currentUser),
                where("friendId", "==", uid)
            );
            const snap = await getDocs(q);

            if (snap.empty) {
                await addDoc(friendsCollection, { userId: currentUser, friendId: uid });
                toast.success("Friend added", {
                    position: "bottom-right",
                    autoClose: 2500,
                    transition: Slide,
                });
            }
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 md:py-10">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative mb-10 overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/70 p-8 md:p-12"
            >
                <div className="pointer-events-none absolute inset-0 bg-aurora" />
                <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-30" />
                <div className="relative z-10">
                    <span className="chip mb-4">
                        <IconWorld className="h-3.5 w-3.5" />
                        community
                    </span>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        A world of conversations.
                    </h1>
                    <p className="mt-3 max-w-xl text-sm text-white/55 md:text-base">
                        Discover new people, spark friendships, and start chats across
                        borders.
                    </p>
                </div>
            </motion.section>

            {/* Two column */}
            <div className="grid gap-5 lg:grid-cols-5">
                {/* Left: globe panel */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/60 p-6 lg:col-span-2 lg:p-8"
                >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="relative">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                            connected
                        </p>
                        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">
                            People, everywhere.
                        </h2>
                        <p className="mt-1.5 max-w-sm text-sm text-white/55">
                            Real-time presence across continents. Tap a node to see who&apos;s
                            online.
                        </p>
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                        <Globe className="mt-2" />
                    </div>
                </motion.div>

                {/* Right: users */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/60 p-6 lg:col-span-3 lg:p-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                                browse
                            </p>
                            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">
                                Everyone
                            </h2>
                        </div>
                        <span className="chip">
                            <IconUsers className="h-3.5 w-3.5" />
                            {users.length}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="relative">
                        <PlaceholdersAndVanishInput
                            placeholders={placeholders}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                        />
                    </form>

                    <div className="-mr-2 max-h-[560px] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-surface-2/40 p-3"
                                    >
                                        <div className="h-11 w-11 animate-pulse rounded-full bg-white/[0.06]" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-32 animate-pulse rounded-full bg-white/[0.06]" />
                                            <div className="h-2 w-20 animate-pulse rounded-full bg-white/[0.04]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface-2/60">
                                    <IconSearch className="h-5 w-5 text-white/50" />
                                </span>
                                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                                    no matches
                                </p>
                                <p className="max-w-xs text-sm text-white/55">
                                    Try a different name or clear your search.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
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
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Community;
