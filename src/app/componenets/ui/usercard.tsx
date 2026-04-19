import React from "react";
import Image from "next/image";
import { IconMessageCircle, IconUser, IconUserPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface UserCardProps {
    uid: string;
    profileImage: string;
    firstname: string;
    lastname: string;
    online: boolean;
    onAddFriend?: (uid: string) => void;
    onChatStart?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
    uid,
    profileImage,
    firstname,
    lastname,
    online,
    onAddFriend,
    onChatStart,
}) => {
    return (
        <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-2/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-surface-2/80">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative shrink-0">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-surface-3">
                    {profileImage ? (
                        <Image
                            src={profileImage}
                            width={96}
                            height={96}
                            alt={`${firstname} ${lastname}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/40">
                            <IconUser stroke={1.5} className="h-6 w-6" />
                        </div>
                    )}
                </div>
                <span
                    className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink",
                        online ? "bg-emerald-400 shadow-glow" : "bg-white/20"
                    )}
                    aria-label={online ? "Online" : "Offline"}
                />
            </div>

            <div className="min-w-0 flex-1">
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

            <div className="relative flex items-center gap-1.5">
                {onChatStart && (
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/60 transition-all hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                        onClick={onChatStart}
                        aria-label="Start chat"
                    >
                        <IconMessageCircle stroke={1.5} size={18} />
                    </button>
                )}
                {onAddFriend && (
                    <button
                        className="flex h-9 items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 text-xs font-medium text-emerald-300 transition-all hover:border-emerald-400/40 hover:bg-emerald-500/20"
                        onClick={() => onAddFriend(uid)}
                        aria-label="Add friend"
                    >
                        <IconUserPlus stroke={1.75} size={16} />
                        <span className="hidden sm:inline">Add</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserCard;
