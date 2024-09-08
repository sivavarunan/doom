'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconWorld,
    IconSend,
    IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/app/firebase';
import { collection, doc, getDoc, onSnapshot, query, where, orderBy, addDoc, serverTimestamp, Timestamp, deleteDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { FloatingDockComp } from "@/app/componenets/ui/floatingdockcomp";
import { Logo } from "@/app/componenets/logo";
import { LogoIcon } from '@/app/componenets/LogoIcon';
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
                "flex flex-col md:flex-row bg-gray-100 dark:bg-gradient-to-b from-emerald-950 to-neutral-900 w-full h-screen overflow-hidden"
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

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    message?: string; 
    timestamp: Timestamp;
    type?: 'text' | 'file'; 
    content?: string; 
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
    const previousMessagesLength = useRef<number>(0); // Track previous message count


    // Track authentication state
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

    // Fetch messages from Firestore
    useEffect(() => {
        if (currentUserId && chatWithUserId) {
            const q = query(
                collection(db, 'messages'),
                where('senderId', 'in', [currentUserId, chatWithUserId]),
                where('receiverId', 'in', [currentUserId, chatWithUserId]),
                orderBy('timestamp')
            );
    
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Message[];
                setMessages(msgs);
            });
    
            return () => unsubscribe();
        }
    }, [currentUserId, chatWithUserId]);

    // Notification for new messages
    useEffect(() => {
        if (messages.length > previousMessagesLength.current) {
            const lastMessage = messages[messages.length - 1];

            // Show notification for new message
            if (lastMessage && lastMessage.senderId !== currentUserId) {
                toast.info(`New message from ${receiverName}: ${lastMessage.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }

        // Update previous message count
        previousMessagesLength.current = messages.length;
    }, [messages, currentUserId, receiverName]);



    // Fetch user data for receiver
    useEffect(() => {
        if (chatWithUserId) {
            const fetchUserData = async () => {
                const userRef = doc(db, 'users', chatWithUserId);
                try {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as User;
                        const fullName = `${data.firstname || ''} ${data.lastname || ''}`.trim();
                        setReceiverName(fullName || 'Unknown User');
                    } else {
                        setReceiverName('Unknown User');
                    }
                } catch (error) {
                    setReceiverName('Error fetching name');
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [chatWithUserId]);

    // Send a new message
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

    // Delete a message
    const handleDeleteMessage = async (messageId: string) => {
        if (!messageId) return;

        try {
            await deleteDoc(doc(db, 'messages', messageId));
            toast.success("Message deleted successfully", { position: "top-right" });
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error("Failed to delete message", { position: "top-right" });
        }
    };

    // Spinner component for loading
    const Spinner = () => (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-solid border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Send message on pressing Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Format Firestore timestamp
    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return 'Invalid date';

        let date;
        // Check if it's a Firestore timestamp
        if (timestamp instanceof Timestamp) {
            date = timestamp.toDate();
        } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
            date = new Date(timestamp);
        } else if (timestamp instanceof Date) {
            date = timestamp;
        } else {
            return 'Invalid date';
        }

        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }

        return format(date, 'p, MMM d');
    };

    // Scroll to the bottom of the chat on new message
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

    const handleSendFile = async (fileURLs: string[]) => {
        if (!currentUserId || !chatWithUserId) return;

        // Store each file's URL in Firestore
        const newMessages = fileURLs.map((url) => ({
            type: "file",
            content: url,
            senderId: currentUserId,
            receiverId: chatWithUserId,
            timestamp: serverTimestamp(),
        }));

        try {
            for (const message of newMessages) {
                await addDoc(collection(db, 'messages'), message);
            }
        } catch (error) {
            console.error("Error sending file:", error);
            toast.error("Failed to send file", { position: "top-right" });
        }
    };


    return (
        <div className="dark:bg-gradient-to-b from-emerald-950 to-neutral-900 bg-neutral-50 flex flex-col h-screen">
            {/* Sticky Header */}
            <div className="rounded-tl-2xl border-2 border-neutral-700 dark:border-neutral-950 bg-gray-100 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 flex flex-col gap-2 flex-1 w-full h-full">
                <header className="sticky top-0 p-4 rounded-tl-2xl flex items-center justify-between border-b-2 border-b-neutral-950 dark:bg-black dark:bg-opacity-40">
                    <h1 className="text-lg font-semibold text-black dark:text-white">{receiverName}</h1>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div className={`relative ${msg.senderId === currentUserId ? 'ml-auto' : 'mr-auto'} group`}>
                                    <div className={`bg-${msg.senderId === currentUserId ? 'emerald-700' : 'gray-300'} text-md text-black px-10 py-2 rounded-3xl font-mono`}>
                                        {msg.type === 'file' ? (
                                            <a href={msg.content} download>
                                                <button className="bg-blue-500 text-white px-2 py-1 rounded">Download File</button>
                                            </a>
                                        ) : (
                                            <span>{msg.message}</span>
                                        )}
                                    </div>

                                    <div className={`flex items-end ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'} mt-1`}>
                                        {msg.senderId === currentUserId && (
                                            <button
                                                className="text-red-600 hover:text-red-800 ml-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                onClick={() => handleDeleteMessage(msg.id)}
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        )}
                                        <span className="text-xs dark:text-white bg-black bg-opacity-5 px-2 py-1 rounded-3xl whitespace-nowrap">
                                            {formatTimestamp(msg.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={endOfMessagesRef} />

                    <div className="p-4 flex items-center bg-transparent border-t-2 border-neutral-700 dark:border-neutral-950 mb-10 md:mb-0">
                        <input
                            type="text"
                            className="flex-1 p-2 border-2 border-green-800 rounded-3xl focus:outline-none focus:ring-4 dark:bg-neutral-950 focus:ring-emerald-700"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="ml-4 p-2 bg-emerald-700 text-white rounded-3xl hover:bg-emerald-900"
                            onClick={handleSendMessage}
                        >
                            <IconSend stroke={2} className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                        </button>
                        <FloatingDockComp onSendFileToChat={handleSendFile} className="ml-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;