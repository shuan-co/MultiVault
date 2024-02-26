// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCGjD4GW--D_PVH7mrxEwLYpYnhppPRX_8",
    authDomain: "multivault-6ab85.firebaseapp.com",
    projectId: "multivault-6ab85",
    storageBucket: "multivault-6ab85.appspot.com",
    messagingSenderId: "725374547308",
    appId: "1:725374547308:web:3bd36871a0f8b60f7d6f49",
    measurementId: "G-S1D7TCVEXR"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);