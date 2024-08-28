import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db, storage } from '@/app/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import UserCard from '@/app/componenets/ui/usercard';
import { IconEdit, IconCheck } from '@tabler/icons-react';
import Image from 'next/image';

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
    const [friends, setFriends] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    // const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDoc = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(userDoc);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                        // Fetch friends once the user data is available
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
            // Fetch friends' UIDs
            const q = query(collection(db, "friends"), where("userId", "==", uid));
            const querySnapshot = await getDocs(q);
            const friendIds = querySnapshot.docs.map(doc => doc.data().friendId);

            // Fetch details for each friend
            const friendsList = await Promise.all(friendIds.map(async (friendId) => {
                const friendDoc = doc(db, "users", friendId);
                const friendSnap = await getDoc(friendDoc);
                return friendSnap.exists() ? friendSnap.data() : null;
            }));

            // Filter out any null values (in case some friends' data do not exist)
            const filteredFriendsList = friendsList.filter(friend => friend !== null);
            setFriends(filteredFriendsList);
            console.log("Fetched friends list:", filteredFriendsList);
        } catch (error) {
            console.error("Error fetching friends list:", error);
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

    const startChat = (friendId: string) => {
        console.log("Start chat with", friendId);
        // router.push(`/chat?recipient=${friendId}`);
    };

    return (
        <div className="flex flex-col md:flex-row flex-1">
            <div className="flex flex-col items-center p-4 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 md:w-1/3 w-full h-full">
                {/* Profile Section */}
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

            {/* Friends List Section */}
            <div className="md:w-2/3 w-full p-4 md:p-6 rounded-tr-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Friends</h2>

                {friends.length > 0 ? (
                    <ul>
                        {friends.map((friend) => (
                            <li key={friend.uid}>
                                <UserCard
                                    uid={friend.uid}
                                    profileImage={friend.profileImage}
                                    firstname={friend.firstname}
                                    lastname={friend.lastname}
                                    online={friend.online}
                                    onChatStart={() => startChat(friend.uid)}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">No friends added yet.</p>
                )}
            </div>

        </div>
    );
};

export default Profile;


