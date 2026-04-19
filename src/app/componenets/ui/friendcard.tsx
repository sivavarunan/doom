import React from "react";
import Image from "next/image";
import { IconMessage, IconTrash, IconUser } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface FriendCardProps {
    uid: string;
    profileImage: string;
    firstname: string;
    lastname: string;
    online: boolean;
    onChatStart: () => void;
    onRemoveFriend: (uid: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
    uid,
    profileImage,
    firstname,
    lastname,
    online,
    onChatStart,
    onRemoveFriend,
}) => {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onChatStart}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChatStart();
                }
            }}
            className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-2/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-surface-2/80"
        >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative shrink-0">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/10 bg-surface-3">
                    {profileImage ? (
                        <Image
                            src={profileImage}
                            alt={`${firstname} ${lastname}`}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/40">
                            <IconUser stroke={1.5} className="h-5 w-5" />
                        </div>
                    )}
                </div>
                <span
                    className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink",
                        online ? "bg-emerald-400 shadow-glow" : "bg-white/20"
                    )}
                />
            </div>

            <div className="relative min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                    {firstname} {lastname}
                </p>
                <p
                    className={cn(
                        "mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em]",
                        online ? "text-emerald-300" : "text-white/40"
                    )}
                >
                    {online ? "online" : "offline"}
                </p>
            </div>

            <div className="relative flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-white/60 transition-colors hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        onChatStart();
                    }}
                    aria-label={`Chat with ${firstname}`}
                >
                    <IconMessage size={16} />
                </button>
                <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-white/50 transition-colors hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFriend(uid);
                    }}
                    aria-label={`Remove ${firstname}`}
                >
                    <IconTrash size={16} />
                </button>
            </div>
        </div>
    );
};

export default FriendCard;
