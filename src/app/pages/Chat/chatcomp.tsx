"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    IconSend,
    IconTrash,
    IconDownload,
    IconFile,
    IconUser,
    IconArrowLeft,
    IconDots,
    IconCheck,
} from "@tabler/icons-react";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    addDoc,
    serverTimestamp,
    Timestamp,
    deleteDoc,
    FieldValue,
} from "firebase/firestore";
import {
    getStorage,
    ref,
    deleteObject,
    getDownloadURL,
} from "firebase/storage";
import { useParams, useRouter } from "next/navigation";
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Image from "next/image";

import { auth, db } from "@/app/firebase";
import { FloatingDockComp } from "@/app/componenets/ui/floatingdockcomp";
import { AudioMessage } from "@/app/componenets/audiomsg";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    message?: string;
    timestamp: Timestamp | FieldValue;
    type?: "text" | "file" | "voice";
    content?: string;
}

interface User {
    firstname: string;
    lastname: string;
    profileImage?: string;
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [receiver, setReceiver] = useState<User | null>(null);
    const params = useParams();
    const router = useRouter();
    const chatWithUserId = typeof params?.id === "string" ? params.id : "";
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const previousMessagesLength = useRef<number>(0);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) =>
            setCurrentUserId(user?.uid ?? null)
        );
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!currentUserId || !chatWithUserId) return;
        setLoading(true);

        const q = query(
            collection(db, "messages"),
            where("senderId", "in", [currentUserId, chatWithUserId]),
            where("receiverId", "in", [currentUserId, chatWithUserId]),
            orderBy("timestamp")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as Message[];
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUserId, chatWithUserId]);

    useEffect(() => {
        if (
            messages.length > previousMessagesLength.current &&
            messages.length > 0
        ) {
            const last = messages[messages.length - 1];
            if (last && last.senderId !== currentUserId && receiver) {
                toast.info(`${receiver.firstname}: ${last.message ?? "sent a message"}`);
            }
        }
        previousMessagesLength.current = messages.length;
    }, [messages, currentUserId, receiver]);

    useEffect(() => {
        if (!chatWithUserId) return;
        (async () => {
            try {
                const snap = await getDoc(doc(db, "users", chatWithUserId));
                if (snap.exists()) setReceiver(snap.data() as User);
            } catch {
                /* ignore */
            } finally {
                setLoading(false);
            }
        })();
    }, [chatWithUserId]);

    const handleSendMessage = async () => {
        const text = newMessage.trim();
        if (!text || !currentUserId || !chatWithUserId) return;
        await addDoc(collection(db, "messages"), {
            senderId: currentUserId,
            receiverId: chatWithUserId,
            message: text,
            type: "text",
            timestamp: serverTimestamp(),
        });
        setNewMessage("");
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage((prev) => prev + emoji);
    };

    const handleDeleteMessage = async (messageId: string, audioURL: string) => {
        if (!messageId) return;

        if (audioURL) {
            try {
                const decodedURL = decodeURIComponent(audioURL);
                const fileName = decodedURL.split("/").pop()?.split("?")[0];
                if (fileName) {
                    const storage = getStorage();
                    const audioRef = ref(storage, `voice-messages/${fileName}`);
                    try {
                        await getDownloadURL(audioRef);
                        await deleteObject(audioRef);
                    } catch {
                        /* file may not exist */
                    }
                }
            } catch {
                toast.error("Failed to remove audio file");
            }
        }

        try {
            await deleteDoc(doc(db, "messages", messageId));
            toast.success("Message deleted");
        } catch {
            toast.error("Failed to delete message");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return "";
        let date: Date;
        if (timestamp instanceof Timestamp) date = timestamp.toDate();
        else if (typeof timestamp === "string" || typeof timestamp === "number")
            date = new Date(timestamp);
        else if (timestamp instanceof Date) date = timestamp;
        else return "";
        if (isNaN(date.getTime())) return "";
        return format(date, "p");
    };

    const formatDayLabel = (timestamp: any) => {
        if (!timestamp) return "";
        let date: Date;
        if (timestamp instanceof Timestamp) date = timestamp.toDate();
        else if (typeof timestamp === "string" || typeof timestamp === "number")
            date = new Date(timestamp);
        else if (timestamp instanceof Date) date = timestamp;
        else return "";
        return format(date, "EEEE · MMM d");
    };

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendFile = async (fileURLs: string[]) => {
        if (!currentUserId || !chatWithUserId) return;
        try {
            await Promise.all(
                fileURLs.map((url) =>
                    addDoc(collection(db, "messages"), {
                        type: "file",
                        content: url,
                        senderId: currentUserId,
                        receiverId: chatWithUserId,
                        timestamp: serverTimestamp(),
                    })
                )
            );
        } catch {
            toast.error("Failed to send file");
        }
    };

    const handleSendAudioMessage = async (audioURL: string) => {
        if (!currentUserId || !chatWithUserId) return;
        try {
            await addDoc(collection(db, "messages"), {
                senderId: currentUserId,
                receiverId: chatWithUserId,
                timestamp: serverTimestamp(),
                type: "voice",
                content: audioURL,
            });
            toast.success("Voice message sent");
        } catch {
            toast.error("Failed to send voice message");
        }
    };

    const receiverName = useMemo(() => {
        if (!receiver) return "…";
        return `${receiver.firstname ?? ""} ${receiver.lastname ?? ""}`.trim() || "Unknown";
    }, [receiver]);

    const grouped = useMemo(() => {
        const groups: { date: any; items: Message[] }[] = [];
        messages.forEach((m) => {
            const ts = m.timestamp;
            const last = groups[groups.length - 1];
            const tsDate =
                ts instanceof Timestamp ? ts.toDate() : ts instanceof Date ? ts : null;
            const lastDate =
                last?.date instanceof Timestamp
                    ? last.date.toDate()
                    : last?.date instanceof Date
                    ? last.date
                    : null;
            if (!last || !tsDate || !lastDate || !isSameDay(tsDate, lastDate)) {
                groups.push({ date: ts, items: [m] });
            } else {
                last.items.push(m);
            }
        });
        return groups;
    }, [messages]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
                        loading conversation
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-surface-0/70 px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.04] hover:text-white"
                        aria-label="Back"
                    >
                        <IconArrowLeft className="h-4 w-4" />
                    </button>
                    <Avatar user={receiver} />
                    <div className="min-w-0">
                        <p className="font-display text-[15px] font-semibold text-white">
                            {receiverName}
                        </p>
                        <p className="flex items-center gap-1.5 font-mono text-[11px] text-white/40">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            online
                        </p>
                    </div>
                </div>
                <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 hover:bg-white/[0.04] hover:text-white"
                    aria-label="More"
                >
                    <IconDots className="h-4 w-4" />
                </button>
            </header>

            {/* Messages */}
            <div className="relative flex-1 overflow-y-auto custom-scrollbar px-4 py-6 md:px-8">
                <div className="pointer-events-none absolute inset-0 bg-aurora opacity-40" />
                <div className="relative mx-auto flex max-w-3xl flex-col gap-6">
                    {grouped.length === 0 ? (
                        <EmptyState name={receiverName} />
                    ) : (
                        grouped.map((group, gi) => (
                            <div key={gi} className="flex flex-col gap-2">
                                <div className="my-2 flex items-center gap-3">
                                    <div className="h-px flex-1 bg-white/[0.06]" />
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                                        {formatDayLabel(group.date)}
                                    </span>
                                    <div className="h-px flex-1 bg-white/[0.06]" />
                                </div>
                                {group.items.map((msg, idx) => {
                                    const mine = msg.senderId === currentUserId;
                                    const prev = group.items[idx - 1];
                                    const sameSender = prev && prev.senderId === msg.senderId;
                                    return (
                                        <MessageRow
                                            key={msg.id}
                                            msg={msg}
                                            mine={mine}
                                            showAvatar={!sameSender && !mine}
                                            user={receiver}
                                            timeLabel={formatTimestamp(msg.timestamp)}
                                            onDelete={() =>
                                                handleDeleteMessage(msg.id, msg.content ?? "")
                                            }
                                        />
                                    );
                                })}
                            </div>
                        ))
                    )}
                    <div ref={endOfMessagesRef} />
                </div>
            </div>

            {/* Composer */}
            <div className="relative border-t border-white/[0.06] bg-surface-0/70 px-4 py-3 backdrop-blur-xl md:px-8 md:py-4">
                <div className="mx-auto flex max-w-3xl items-center gap-2 md:gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message ${receiverName}…`}
                            className="w-full rounded-xl border border-white/[0.08] bg-surface-2/80 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className={cn(
                            "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all",
                            newMessage.trim()
                                ? "bg-gradient-to-br from-emerald-300 to-emerald-500 text-black shadow-[0_0_0_1px_rgba(52,211,153,0.3),0_8px_24px_-8px_rgba(16,185,129,0.55)] hover:from-emerald-200 hover:to-emerald-400"
                                : "bg-white/[0.04] text-white/30"
                        )}
                        aria-label="Send message"
                    >
                        <IconSend className="h-4 w-4" />
                    </button>
                    <div className="hidden md:block">
                        <FloatingDockComp
                            onSendFileToChat={handleSendFile}
                            onEmojiSelect={handleEmojiSelect}
                            onSendAudioMessage={handleSendAudioMessage}
                            message={currentMessage}
                            setMessage={setCurrentMessage}
                            currentUserId={currentUserId ?? ""}
                            receiverId={chatWithUserId}
                        />
                    </div>
                </div>
                <div className="mx-auto mt-2 max-w-3xl md:hidden">
                    <FloatingDockComp
                        onSendFileToChat={handleSendFile}
                        onEmojiSelect={handleEmojiSelect}
                        onSendAudioMessage={handleSendAudioMessage}
                        message={currentMessage}
                        setMessage={setCurrentMessage}
                        currentUserId={currentUserId ?? ""}
                        receiverId={chatWithUserId}
                    />
                </div>
            </div>
        </div>
    );
};

const Avatar = ({ user }: { user: User | null }) => {
    if (user?.profileImage) {
        return (
            <Image
                src={user.profileImage}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border border-white/10 object-cover"
            />
        );
    }
    return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 text-emerald-300">
            <IconUser className="h-4 w-4" />
        </div>
    );
};

const EmptyState = ({ name }: { name: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex flex-col items-center gap-4 text-center"
    >
        <div className="relative">
            <div className="absolute inset-0 animate-pulse-ring rounded-2xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                <IconUser className="h-6 w-6" />
            </div>
        </div>
        <div>
            <p className="font-display text-lg font-semibold text-white">
                Say hi to {name}
            </p>
            <p className="mt-1 text-sm text-white/50">
                This is the start of your conversation.
            </p>
        </div>
    </motion.div>
);

const MessageRow = ({
    msg,
    mine,
    showAvatar,
    user,
    timeLabel,
    onDelete,
}: {
    msg: Message;
    mine: boolean;
    showAvatar: boolean;
    user: User | null;
    timeLabel: string;
    onDelete: () => void;
}) => {
    const isImage =
        msg.type === "file" &&
        !!msg.content &&
        /\.(png|jpe?g|gif|webp)$/i.test(msg.content);
    const isPdf =
        msg.type === "file" && !!msg.content && /\.pdf$/i.test(msg.content);
    const isTxt =
        msg.type === "file" && !!msg.content && /\.txt$/i.test(msg.content);

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={cn("group flex items-end gap-2", mine && "justify-end")}
        >
            {!mine && (
                <div className="w-8">
                    {showAvatar ? (
                        <Avatar user={user} />
                    ) : (
                        <div className="h-8 w-8" />
                    )}
                </div>
            )}
            <div className={cn("flex max-w-[78%] flex-col", mine && "items-end")}>
                {msg.type === "file" ? (
                    <div
                        className={cn(
                            "overflow-hidden rounded-2xl border",
                            mine
                                ? "border-emerald-400/20 bg-emerald-500/10"
                                : "border-white/[0.06] bg-surface-2/80"
                        )}
                    >
                        {isImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={msg.content}
                                alt="attachment"
                                className="max-h-72 max-w-xs rounded-2xl object-cover"
                            />
                        )}
                        {isPdf && (
                            <div className="flex flex-col">
                                <iframe
                                    src={msg.content}
                                    title="PDF"
                                    className="h-56 w-72 border-0"
                                />
                                <a
                                    href={msg.content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 border-t border-white/5 bg-surface-2/60 px-3 py-2 text-xs text-emerald-300 hover:bg-surface-2"
                                >
                                    <IconDownload className="h-3.5 w-3.5" />
                                    Open PDF
                                </a>
                            </div>
                        )}
                        {isTxt && (
                            <a
                                href={msg.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-white/85"
                            >
                                <IconFile className="h-5 w-5 text-emerald-300" />
                                <span className="truncate">text attachment</span>
                                <IconDownload className="ml-auto h-3.5 w-3.5 text-emerald-300" />
                            </a>
                        )}
                        {!isImage && !isPdf && !isTxt && (
                            <a
                                href={msg.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-white/85"
                            >
                                <IconFile className="h-5 w-5 text-emerald-300" />
                                <span className="truncate max-w-[180px]">attachment</span>
                                <IconDownload className="ml-auto h-3.5 w-3.5 text-emerald-300" />
                            </a>
                        )}
                    </div>
                ) : msg.type === "voice" ? (
                    <div
                        className={cn(
                            "rounded-2xl border px-3 py-2",
                            mine
                                ? "border-emerald-400/20 bg-emerald-500/10"
                                : "border-white/[0.06] bg-surface-2/80"
                        )}
                    >
                        <AudioMessage audioURL={msg.content ?? ""} />
                    </div>
                ) : (
                    <div
                        className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                            mine
                                ? "rounded-br-md bg-gradient-to-br from-emerald-300 to-emerald-500 text-black"
                                : "rounded-bl-md border border-white/[0.06] bg-surface-2/80 text-white/90"
                        )}
                    >
                        {msg.message}
                    </div>
                )}

                <div
                    className={cn(
                        "mt-1 flex items-center gap-2 font-mono text-[10px] text-white/30",
                        mine && "flex-row-reverse"
                    )}
                >
                    <span>{timeLabel}</span>
                    {mine && (
                        <>
                            <IconCheck className="h-3 w-3 text-emerald-300/70" />
                            <button
                                onClick={onDelete}
                                className="opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100"
                                aria-label="Delete message"
                            >
                                <IconTrash className="h-3 w-3" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Chat;
