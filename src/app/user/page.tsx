'use client'
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserPage = () => {
    const [currentUser, setCurrentUser] = useState<any>(null); 
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);

                // Fetch additional user info from Firestore
                const userDoc = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(userDoc);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                        console.log("uid:", user.uid)
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

        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div>
            {currentUser ? (
                <div>
                    <h1>Welcome, {userData ? `${userData.firstname || 'N/A'} ${userData.lastname || 'N/A'}` : "Loading..."}</h1>
                    <p>Email: {currentUser.email}</p>
                </div>
            ) : (
                <h1>No user is signed in</h1>
            )}
        </div>
    );
};

export default UserPage;
