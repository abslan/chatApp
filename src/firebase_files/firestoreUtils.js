


// const { getDatabase, ref, set } =  require("firebase/database");
// const { doc, getDoc, setDoc, updateDoc } = require("firebase/firestore");

import { doc, getDoc } from "firebase/firestore";
import { getDocs, collection, query, where } from "firebase/firestore";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";


import { db } from "./config";
import { data } from "../data";


export async function getUserById(id) {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updateUser(id, data) {
  return await updateDoc(doc(db, "users", id), data);
}

export const getFriendsPreview = async (friendIds) => {
  if (!friendIds?.length) return [];
  const q = query(collection(db, "users"), where("id", "in", friendIds));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const { id, img, user_name, is_online } = doc.data();
    return { id, img, user_name, is_online };
  });
};

export const getGroupConversationById = async (groupId) => {
  const docRef = doc(db, "conversations_groups", groupId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const getDuoConversationById = async (duoId) => {
  const docRef = doc(db, "conversations_duo", duoId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};




export const listenToFriendsOnlineStatus = (friendIds, callback) => {
  if (!friendIds.length) return () => {};
  const q = query(collection(db, "users"), where("id", "in", friendIds));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const updates = snapshot.docs.map(doc => {
      const { id, user_name, is_online, img } = doc.data();
      return { id, user_name, is_online, img };
    });
    callback(updates);
  });
  return unsubscribe;
};

import { doc, onSnapshot } from "firebase/firestore";

export const listenToConversationById = (type, convoId, callback) => {
  const collectionName = type === "group" ? "conversations_groups" : "conversations_duo";
  const docRef = doc(db, collectionName, convoId);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) callback(docSnap.data());
  });
  return unsubscribe;
};

export const listenToInitialMessages = (type, convoId, callback) => {
  const colPath = type === "group" ? "conversations_groups" : "conversations_duo";
  const messagesRef = collection(db, colPath, convoId, "messages");

  const q = query(messagesRef, orderBy("timestamp", "desc"), limit(20));

  return onSnapshot(q, snapshot => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).reverse(); // for chronological order
    callback(messages, snapshot.docs[snapshot.docs.length - 1]); // pass lastVisibleDoc
  });
};

export const fetchOlderMessages = async (type, convoId, lastVisibleDoc) => {
  const colPath = type === "group" ? "conversations_groups" : "conversations_duo";
  const messagesRef = collection(db, colPath, convoId, "messages");

  const q = query(
    messagesRef,
    orderBy("timestamp", "desc"),
    startAfter(lastVisibleDoc),
    limit(20)
  );

  const snapshot = await getDocs(q);
  return {
    messages: snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).reverse(),
    lastVisible: snapshot.docs[snapshot.docs.length - 1]
  };
};