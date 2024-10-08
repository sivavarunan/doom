import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { IconEdit, IconCheck } from '@tabler/icons-react';
import Image from 'next/image';
import FriendCard from '@/app/componenets/ui/friendcard';
import { auth, db, storage } from '@/app/firebase';
import { PlaceholdersAndVanishInput } from "@/app/componenets/ui/searchbar";
import { toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>({
        firstname: "",
        lastname: "",
        age: "",
        city: "",
        country: "",
        profession: "",
        status: "",
        profileImage: "",
    });
    const [editFields, setEditFields] = useState<string[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredFriends, setFilteredFriends] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const results = friends.filter(friend =>
            friend.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.lastname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFriends(results);
    }, [searchTerm, friends]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDoc = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(userDoc);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                        fetchFriends(user.uid);
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

    const fetchFriends = async (uid: string) => {
        try {
            const q = query(collection(db, "friends"), where("userId", "==", uid));
            const querySnapshot = await getDocs(q);
            const friendIds = querySnapshot.docs.map(doc => doc.data().friendId);

            const friendsList = await Promise.all(friendIds.map(async (friendId) => {
                const friendDoc = doc(db, "users", friendId);
                const friendSnap = await getDoc(friendDoc);
                return friendSnap.exists() ? friendSnap.data() : null;
            }));

            const filteredFriendsList = friendsList.filter(friend => friend !== null);
            setFriends(filteredFriendsList);
            console.log("Fetched friends list:", filteredFriendsList);
        } catch (error) {
            console.error("Error fetching friends list:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFriend = async (friendId: string) => {
        if (!currentUser) return;

        try {
            const q = query(collection(db, "friends"), where("userId", "==", currentUser.uid), where("friendId", "==", friendId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const friendDoc = querySnapshot.docs[0];
                await deleteDoc(friendDoc.ref);
                setFriends((prevFriends) => prevFriends.filter((friend) => friend.uid !== friendId));
                setFilteredFriends((prevFriends) => prevFriends.filter((friend) => friend.uid !== friendId));

                console.log("Friend removed successfully");
                toast.error("Freind Removed", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Flip,
                });
            } else {
                console.log("Friend not found");
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const storageRef = ref(storage, `profileImages/${currentUser.uid}`);

            setUploading(true);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => { },
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

    const startChat = (friendId: string) => {
        router.push(`/pages/Chat/${friendId}`);
        console.log('chat with :', friendId)
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const placeholders = [
        "Eren Yeager",
        "NoobMaster69",
        "Mikasa",
        "Enter the friend name to filter..",
        "username1234",
        "Looser",
    ];

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputChange(e as any);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row flex-1">
                <div className="flex flex-col items-center p-4 md:p-6 rounded-tl-2xl border border-b-0 border-neutral-700 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 dark:border-2 dark:border-neutral-950 md:w-1/3 w-full h-screen">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center mt-12">
                        <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                        <div className="w-1/2 h-6 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                        <div className="w-3/4 h-4 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                        <div className="w-2/3 h-4 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                        <div className="h-4 w-full rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse"></div>
                    </div>
                </div>
                
                <div className="flex flex-col md:w-2/3 w-full pl-4 rounded-tr-2xl border-t border-l border-r border-neutral-700 dark:border-neutral-950 bg-white dark:bg-gradient-to-b from-emerald-950 to-neutral-950 h-screen dark:custom-scrollbar">
                    <div className="py-6">
                        <div className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-6 from-green-400 via-emerald-600 to-teal-700 text-4xl md:text-3xl font-bold animate-pulse mb-6">
                            <div className="h-8 w-1/3 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <div className="h-10 w-5/6 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                        <div className="h-10 w-5/6 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                        <div className="h-10 w-5/6 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                        <div className="h-10 w-5/6 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                    </div>
                    
                    <div className="border-t-2 dark:border-neutral-950 border-neutral-700 mt-8 pt-4">
                        <div className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-6 from-green-400 via-emerald-600 to-teal-700 text-4xl md:text-3xl font-bold animate-pulse mb-6">
                            <div className="h-8 w-1/3 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse"></div>
                        </div>
                        <div className="mb-4">
                            <div className="h-10 w-5/6 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                            <div className="h-10 w-5/6 rounded-lg bg-gray-300 dark:bg-neutral-600 animate-pulse mb-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    

    return (
        <div className="dark:bg-gradient-to-b from-emerald-950 to-neutral-950 bg-neutral-50">
            <div className="flex flex-col md:flex-row flex-1">
                <div className="flex flex-col items-center p-4 md:p-6 rounded-tl-2xl border border-b-0 border-neutral-700 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 dark:border-2 dark:border-neutral-950 md:w-1/3 w-full h-screen">
                    {/* Profile Section */}
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 overflow-hidden mb-2">
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
                    </div>

                    <div className="text-md text-gray-600 dark:text-gray-400 mb-4">
                        {currentUser?.email}
                    </div>

                    {[
                        { label: "Age", field: "age" },
                        { label: "City", field: "city" },
                        { label: "Country", field: "country" },
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
                                        value={userData[field] || ''}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 p-2 bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-600 rounded-3xl"
                                    />
                                    <button onClick={() => handleSaveProfile(field)} className="text-green-500">
                                        <IconCheck />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span>{userData[field]}</span>
                                    <button
                                        onClick={() => toggleEdit(field)}
                                        className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-opacity opacity-0 group-hover:opacity-100"
                                    >
                                        <IconEdit />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:w-2/3 w-full pl-4 rounded-tr-2xl border-t border-l border-r border-neutral-700  dark:border-neutral-950 bg-white dark:bg-gradient-to-b from-emerald-950 to-neutral-950 h-screen dark:custom-scrollbar">
                    <h2 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-6 from-green-400 via-emerald-600 to-teal-700 text-4xl md:text-3xl font-bold">
                        Friends
                    </h2>
                    <form onSubmit={handleSubmit} className="mb-4">
                        <PlaceholdersAndVanishInput
                            placeholders={placeholders}
                            onChange={handleChange}
                            onSubmit={handleSubmit} />
                    </form>
                    <div className="flex gap-4 overflow-y-auto">
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

                    <div className='border-t-2 dark:border-neutral-950 border-neutral-700 mt-8 mr-8'>
                        <h2 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-6 from-green-400 via-emerald-600 to-teal-700 text-4xl md:text-3xl font-bold">
                            Other
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
