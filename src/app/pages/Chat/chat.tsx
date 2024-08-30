'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconWorld,
    IconMessage,
    IconSend,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/app/firebase';
import { collection, doc, getDoc, onSnapshot, query, where, orderBy, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { FloatingDockComp } from "@/app/componenets/ui/floatingdockcomp";



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
        // {
        //     label: "Chat",
        //     href: "/pages/Chat",
        //     icon: (
        //         <IconMessage stroke={2} className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        //     ),
        // },
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
            <div className="flex-1  custom-scrollbar">
                <div className="flex-1 overflow-auto">
                    <Chat />
                </div>
            </div>
        </div>
    );
}

const Logo = () => {
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

const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};

interface Message {
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: Timestamp;
}

interface User {
    firstname: string;
    lastname: string;
    profileImage?: string;
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [receiverName, setReceiverName] = useState<string>('');
    const params = useParams();
    const chatWithUserId = typeof params?.id === 'string' ? params.id : '';
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid);
            } else {
                setCurrentUserId(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (currentUserId && chatWithUserId) {
            const q = query(
                collection(db, 'messages'),
                where('senderId', 'in', [currentUserId, chatWithUserId]),
                where('receiverId', 'in', [currentUserId, chatWithUserId]),
                orderBy('timestamp')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => doc.data() as Message);
                setMessages(msgs);
            });

            return () => unsubscribe();
        }
    }, [currentUserId, chatWithUserId]);

    useEffect(() => {
        if (chatWithUserId) {
            const fetchUserData = async () => {
                console.log("Fetching data for user ID:", chatWithUserId);
                const userRef = doc(db, 'users', chatWithUserId);
                try {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as User;
                        const fullName = `${data.firstname || ''} ${data.lastname || ''}`.trim();
                        setReceiverName(fullName || 'Unknown User');
                    } else {
                        console.log("No user data found in Firestore for UID:", chatWithUserId);
                        setReceiverName('Unknown User');
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
                    setReceiverName('Error fetching name');
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [chatWithUserId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' || !currentUserId || !chatWithUserId) return;

        await addDoc(collection(db, 'messages'), {
            senderId: currentUserId,
            receiverId: chatWithUserId,
            message: newMessage,
            timestamp: serverTimestamp(),
        });

        setNewMessage('');
    };

    const Spinner = () => (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-solid border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };


    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return 'Invalid date'; // Handle null or undefined timestamp
        const date = timestamp.toDate(); // Convert Firestore timestamp to JS Date
        return format(date, 'p, MMM d'); // Format as "12:00 PM, Jan 1"
    };

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="dark:bg-neutral-800 bg-neutral-50 flex flex-col h-screen">
            {/* Sticky Header */}
            <div className="rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-gradient-to-t from-neutral-800 to-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                <header className="sticky top-0 p-4 rounded-tl-2xl flex items-center justify-between border-b-2 border-b-neutral-950 dark:bg-gradient-to-t from-gray-900 to-neutral-950">
                    <h1 className="text-lg font-semibold text-black dark:text-white">{receiverName}</h1>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'} mb-4`}>
                                <div className={`relative ${msg.senderId === currentUserId ? 'ml-auto' : 'mr-auto'}`}>
                                    <div className={`bg-${msg.senderId === currentUserId ? 'emerald-800' : 'gray-300'} text-md text-black px-10 py-2 rounded-3xl font-mono`}>
                                        <span>{msg.message}</span>
                                    </div>
                                    <div className={`flex items-end ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'} mt-1`}>
                                        <span className="text-xs text-white bg-black bg-opacity-5 px-2 py-1 rounded-3xl whitespace-nowrap">
                                            {formatTimestamp(msg.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div >
                        ))}
                    </div >
                    <div ref={endOfMessagesRef} />

                    <div className="p-4 flex items-center bg-transparent border-t border-neutral-200 dark:border-neutral-700 mb-10 md:mb-0">
                        <input
                            type="text"
                            className="flex-1 p-2 border-2 border-green-800 rounded-2xl focus:outline-none focus:ring-4 bg-neutral-950 focus:ring-emerald-700"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="ml-4 p-2 bg-emerald-700 text-white rounded-2xl hover:bg-emerald-900"
                            onClick={handleSendMessage}
                        >
                            <IconSend stroke={2} className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                        </button>
                        <FloatingDockComp className="ml-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;