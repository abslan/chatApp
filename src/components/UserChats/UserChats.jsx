import Chatbox from "../Chatbox/Chatbox";
import Conversations from "../Conversations/Conversations";
import styles from "./UserChats.module.css"


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase_files/config";

import { fetchUserData, formatEmailToId, selectSessionLoadingState } from "../../redux/reducers/dataReducer";

import { ref, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { realtime_db } from "../../firebase_files/config";




export default function UserChats(){

    const loading = useSelector(selectSessionLoadingState);
    //firebase logic 
    // console.log("auth", auth )
    const dispatch = useDispatch()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const uid = formatEmailToId(firebaseUser.email)
                const userStatusRef = ref(realtime_db, `/status/${uid}`);

                // User is considered online
                set(userStatusRef, {
                    isOnline: true,
                    lastSeen: serverTimestamp(),
                }).catch(console.error);;

                // Set status to offline when user disconnects
                onDisconnect(userStatusRef).set({
                    isOnline: false,
                    lastSeen: serverTimestamp(uid),
                });

                dispatch(fetchUserData(uid));
            }
        });

    return () => unsubscribe();
    }, [dispatch]);

    // console.log("userchats loading: ", loading)
    if (loading) return <div>Loading...</div>;

    return (
        
        <div className={styles.userchats}>
            <Conversations/>
            <Chatbox/>
        </div>
        
    );
}