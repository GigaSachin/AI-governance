import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWxKfFDZznk5fbW6TwI4U7TvMx7s1ICw",
  authDomain: "ai-governance-f94d2.firebaseapp.com",
  projectId: "ai-governance-f94d2",
  storageBucket: "ai-governance-f94d2.firebasestorage.app",
  messagingSenderId: "1033463506949",
  appId: "1:1033463506949:web:24796f5eadc9e6781f546c",
  measurementId: "G-XB1KRSJTQ3",
};

const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firebase Storage
export const storage = getStorage(app);

export default app;