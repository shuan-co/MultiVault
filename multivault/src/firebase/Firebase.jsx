// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCGjD4GW--D_PVH7mrxEwLYpYnhppPRX_8",
    authDomain: "multivault-6ab85.firebaseapp.com",
    projectId: "multivault-6ab85",
    storageBucket: "multivault-6ab85.appspot.com",
    messagingSenderId: "725374547308",
    appId: "1:725374547308:web:3bd36871a0f8b60f7d6f49",
    measurementId: "G-S1D7TCVEXR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(app);