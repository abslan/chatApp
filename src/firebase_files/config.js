// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_8B_rgQsc_dfCIZDySKNPqyhArVlU_Zg",
  authDomain: "chatapp-768e2.firebaseapp.com",
  projectId: "chatapp-768e2",
  storageBucket: "chatapp-768e2.firebasestorage.app",
  messagingSenderId: "360160617334",
  appId: "1:360160617334:web:50b896b8e5f55a2f0f5057",
  measurementId: "G-X7GSMGW5WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app);
export const realtime_db = getDatabase(app, "https://chatapp-768e2-default-rtdb.asia-southeast1.firebasedatabase.app");
