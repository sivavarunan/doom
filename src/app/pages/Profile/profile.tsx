"use client";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
    IconCamera,
    IconCheck,
    IconPencil,
    IconUserCircle,
    IconUsers,
    IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FriendCard from "@/app/componenets/ui/friendcard";
import { auth, db, storage } from "@/app/firebase";
import { PlaceholdersAndVanishInput } from "@/app/componenets/ui/searchbar";
import { cn } from "@/lib/utils";

type UserData = {
    firstname: string;
    lastname: string;
    age: string;
    city: string;
    country: string;
    profession: string;
    status: string;
    profileImage: string;
};

const EMPTY_USER: UserData = {
    firstname: "",
    lastname: "",
    age: "",
    city: "",
    country: "",
    profession: "",
    status: "",
    profileImage: "",
};

const Profile = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userData, setUserData] = useState<UserData>(EMPTY_USER);
    const [editFields, setEditFields] = useState<string[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredFriends, setFilteredFriends] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredFriends(
            friends.filter(
                (f) =>
                    f.firstname?.toLowerCase().includes(term) ||
                    f.lastname?.toLowerCase().includes(term)
            )
        );
    }, [searchTerm, friends]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setLoading(false);
                return;
            }
            setCurrentUser(user);
            try {
                const userDoc = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    setUserData({ ...EMPTY_USER, ...(docSnap.data() as UserData) });
                }
                await fetchFriends(user.uid);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchFriends = async (uid: string) => {
        try {
            const q = query(collection(db, "friends"), where("userId", "==", uid));
            const snap = await getDocs(q);
            const friendIds = snap.docs.map((d) => d.data().friendId);

            const list = await Promise.all(
                friendIds.map(async (fid) => {
                    const fDoc = await getDoc(doc(db, "users", fid));
                    return fDoc.exists() ? fDoc.data() : null;
                })
            );
            setFriends(list.filter(Boolean));
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    const removeFriend = async (friendId: string) => {
        if (!currentUser) return;
        try {
            const q = query(
                collection(db, "friends"),
                where("userId", "==", currentUser.uid),
                where("friendId", "==", friendId)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                await deleteDoc(snap.docs[0].ref);
                setFriends((prev) => prev.filter((f) => f.uid !== friendId));
                toast.error("Friend removed", {
                    position: "bottom-right",
                    autoClose: 2500,
                    transition: Flip,
                });
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !currentUser) return;
        const file = e.target.files[0];
        const storageRef = ref(storage, `profileImages/${currentUser.uid}`);

        setUploading(true);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            () => {},
            (error) => {
                console.error("Upload failed:", error);
                setUploading(false);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                await saveProfileImage(url);
                setUploading(false);
            }
        );
    };

    const saveProfileImage = async (url: string) => {
        if (!currentUser) return;
        try {
            await setDoc(
                doc(db, "users", currentUser.uid),
                { profileImage: url },
                { merge: true }
            );
            setUserData((prev) => ({ ...prev, profileImage: url }));
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value } as UserData));
    };

    const handleSaveProfile = async (field: keyof UserData) => {
        if (!currentUser) return;
        try {
            await setDoc(
                doc(db, "users", currentUser.uid),
                { [field]: userData[field] },
                { merge: true }
            );
            setEditFields((prev) => prev.filter((f) => f !== field));
            toast.success("Saved", { position: "bottom-right", autoClose: 1500 });
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const toggleEdit = (field: string) =>
        setEditFields((prev) =>
            prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
        );

    const startChat = (friendId: string) => router.push(`/pages/Chat/${friendId}`);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(e.target.value);

    const fields: { label: string; key: keyof UserData }[] = [
        { label: "Age", key: "age" },
        { label: "City", key: "city" },
        { label: "Country", key: "country" },
        { label: "Profession", key: "profession" },
        { label: "Status", key: "status" },
    ];

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 md:py-10">
                <div className="grid gap-5 lg:grid-cols-5">
                    <div className="rounded-3xl border border-white/[0.06] bg-surface-1/60 p-8 lg:col-span-2">
                        <div className="mx-auto mb-5 h-32 w-32 animate-pulse rounded-full bg-white/[0.06]" />
                        <div className="mx-auto mb-3 h-5 w-40 animate-pulse rounded-full bg-white/[0.06]" />
                        <div className="mx-auto h-3 w-52 animate-pulse rounded-full bg-white/[0.04]" />
                        <div className="mt-10 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-10 animate-pulse rounded-xl bg-white/[0.04]"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-white/[0.06] bg-surface-1/60 p-8 lg:col-span-3">
                        <div className="mb-5 h-6 w-32 animate-pulse rounded-full bg-white/[0.06]" />
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 animate-pulse rounded-xl bg-white/[0.04]"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 md:py-10">
            <div className="grid gap-5 lg:grid-cols-5">
                {/* Profile card */}
                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/70 p-6 lg:col-span-2 lg:p-8"
                >
                    <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
                    <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-20" />

                    <div className="relative flex flex-col items-center text-center">
                        <div className="group relative">
                            <div className="relative h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-surface-2">
                                {userData.profileImage ? (
                                    <Image
                                        src={userData.profileImage}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-white/30">
                                        <IconUserCircle className="h-14 w-14" />
                                    </div>
                                )}
                            </div>

                            <label
                                htmlFor="imageUpload"
                                className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-surface-2/90 text-white shadow-lg backdrop-blur-xl transition-transform hover:scale-105 hover:text-emerald-300"
                            >
                                <IconCamera className="h-4 w-4" />
                            </label>
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/60 backdrop-blur-sm">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                                </div>
                            )}
                        </div>

                        <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-white">
                            {userData.firstname || "Your"} {userData.lastname || "Name"}
                        </h2>
                        <p className="mt-1 font-mono text-[11px] tracking-wider text-white/40">
                            {currentUser?.email}
                        </p>

                        <span
                            className={cn(
                                "chip mt-4",
                                userData.status
                                    ? "text-emerald-300"
                                    : "text-white/40"
                            )}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {userData.status || "set a status"}
                        </span>
                    </div>

                    <div className="relative mt-8 space-y-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                            details
                        </p>
                        <div className="space-y-1.5">
                            {fields.map(({ label, key }) => {
                                const editing = editFields.includes(key);
                                return (
                                    <div
                                        key={key}
                                        className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/[0.08]"
                                    >
                                        <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                                            {label}
                                        </span>
                                        {editing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={userData[key] || ""}
                                                    onChange={handleInputChange}
                                                    autoFocus
                                                    className="flex-1 border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-0"
                                                />
                                                <button
                                                    onClick={() => handleSaveProfile(key)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 transition-colors hover:bg-emerald-500/25"
                                                    aria-label="Save"
                                                >
                                                    <IconCheck className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => toggleEdit(key)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white"
                                                    aria-label="Cancel"
                                                >
                                                    <IconX className="h-3.5 w-3.5" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="flex-1 text-sm text-white/80">
                                                    {userData[key] || (
                                                        <span className="text-white/30">—</span>
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() => toggleEdit(key)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 opacity-0 transition-all hover:bg-white/[0.05] hover:text-white group-hover:opacity-100"
                                                    aria-label={`Edit ${label}`}
                                                >
                                                    <IconPencil className="h-3.5 w-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>

                {/* Friends panel */}
                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-1/60 p-6 lg:col-span-3 lg:p-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300/80">
                                your people
                            </p>
                            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">
                                Friends
                            </h2>
                        </div>
                        <span className="chip">
                            <IconUsers className="h-3.5 w-3.5" />
                            {friends.length}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <PlaceholdersAndVanishInput
                            placeholders={[
                                "Eren Yeager",
                                "NoobMaster69",
                                "Mikasa",
                                "filter by name…",
                                "Armin",
                            ]}
                            onChange={handleSearchChange}
                            onSubmit={handleSubmit}
                        />
                    </form>

                    {filteredFriends.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface-2/60">
                                <IconUsers className="h-5 w-5 text-white/50" />
                            </span>
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                                no friends yet
                            </p>
                            <p className="max-w-xs text-sm text-white/55">
                                Head to the community page to find and add people.
                            </p>
                        </div>
                    ) : (
                        <div className="-mr-2 grid gap-3 overflow-y-auto pr-2 custom-scrollbar sm:grid-cols-2">
                            {filteredFriends.map((friend) => (
                                <FriendCard
                                    key={friend.uid}
                                    uid={friend.uid}
                                    profileImage={friend.profileImage}
                                    firstname={friend.firstname}
                                    lastname={friend.lastname}
                                    online={friend.online}
                                    onChatStart={() => startChat(friend.uid)}
                                    onRemoveFriend={removeFriend}
                                />
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>
        </div>
    );
};

export default Profile;
