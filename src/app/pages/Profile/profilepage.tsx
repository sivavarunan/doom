"use client";
import { useEffect, useState } from "react";
import { auth, db, storage } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt, IconEdit, IconCheck, IconWorld } from "@tabler/icons-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SidebarComp() {
    const links = [
        {
            label: "Dashboard",
            href: "/pages/MainPage",
            icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Profile",
            href: "/pages/Profile",
            icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
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
            icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Logout",
            href: "/pages/LoginPage",
            icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen overflow-hidden"
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
            <Profile />
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

const Profile = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>({
        firstname: "",
        lastname: "",
        age: "",
        city: "",
        profession: "",
        status: "",
        profileImage: "",
    });
    const [editFields, setEditFields] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDoc = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(userDoc);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log("No user data found in Firestore for UID:", user.uid);
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
                }
            } else {
                console.log("No user is signed in");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const storageRef = ref(storage, `profileImages/${currentUser.uid}`);

            setUploading(true);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Optional: Add progress handling here
                },
                (error) => {
                    console.error("Image upload failed:", error);
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await saveProfileImage(downloadURL);
                    setUploading(false);
                }
            );
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSaveProfile = async (field: string) => {
        if (currentUser) {
            const userDoc = doc(db, "users", currentUser.uid);
            try {
                await setDoc(userDoc, { [field]: userData[field] }, { merge: true });
                setEditFields(editFields.filter((f) => f !== field));
                console.log("User profile updated successfully");
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }
    };

    const toggleEdit = (field: string) => {
        setEditFields((prev) =>
            prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
        );
    };

    const saveProfileImage = async (url: string) => {
        if (currentUser) {
            const userDoc = doc(db, "users", currentUser.uid);
            try {
                await setDoc(userDoc, { profileImage: url }, { merge: true });
                setUserData({ ...userData, profileImage: url });
                console.log("Profile image updated successfully");
            } catch (error) {
                console.error("Error updating profile image:", error);
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row flex-1">
            <div className="flex flex-col items-center p-4 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 md:w-1/3 w-full h-full">
                <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden mb-2">
                        {userData.profileImage ? (
                            <Image
                                src={userData.profileImage}
                                alt="Profile"
                                className="object-cover w-full h-full"
                                width={128}
                                height={128}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>
                    <label
                        htmlFor="imageUpload"
                        className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer"
                    >
                        <IconEdit />
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                </div>

                <div className="text-xl font-semibold text-black dark:text-white mb-2 w-full text-center relative">
                    <span>{userData.firstname} {userData.lastname}</span>
                    {/* <div className="absolute right-0 top-0 cursor-pointer">
                        {editFields.includes("firstname") || editFields.includes("lastname") ? (
                            <IconCheck
                                className="ml-2 cursor-pointer"
                                onClick={() => {
                                    handleSaveProfile("firstname");
                                    handleSaveProfile("lastname");
                                }}
                            />
                        ) : (
                            <IconEdit
                                className="ml-2 cursor-pointer"
                                onClick={() => {
                                    toggleEdit("firstname");
                                    toggleEdit("lastname");
                                }}
                            />
                        )}
                    </div> */}
                </div>

                <div className="text-md text-gray-600 dark:text-gray-400 mb-4">
                    {currentUser?.email}
                </div>

                {[
                    { label: "Age", field: "age" },
                    { label: "City", field: "city" },
                    { label: "Profession", field: "profession" },
                    { label: "Status", field: "status" },
                ].map(({ label, field }) => (
                    <div key={field} className="text-md text-gray-600 dark:text-gray-400 mb-4 w-full text-left relative group">
                        <span className="font-semibold text-black dark:text-white">{label}:</span>{" "}
                        {editFields.includes(field) ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    name={field}
                                    value={userData[field]}
                                    onChange={handleInputChange}
                                    className="bg-gray-200 dark:bg-neutral-700 text-black dark:text-white p-2 rounded flex-grow"
                                />
                                <IconCheck
                                    className="cursor-pointer"
                                    onClick={() => handleSaveProfile(field)}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="flex-grow">{userData[field]}</span>
                                <IconEdit
                                    className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100"
                                    onClick={() => toggleEdit(field)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;