import {
    signOut,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider
} from 'firebase/auth';

import type {LoginData} from "../utils/types.ts";
import { auth} from "../configs/firebase_config.ts";






const loginWithEmail = async (data: LoginData) => {
    try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        return data.email;
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error("❌ Login error:", e.message);
            throw new Error(e.message);
        }
        throw new Error("An unexpected error occurred during login.");
    }
};

// Вход через Google
const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result.user.email;
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error("❌ Google login error:", e.message);
            throw new Error(e.message);
        }
        throw new Error("An unexpected error occurred during Google login.");
    }
};


export const loginFirebase = async (data: LoginData) => {
    return data.email === "GOOGLE" ? loginWithGoogle() : loginWithEmail(data);
};


export const signoutFirebase = async () => {
    try {
        await signOut(auth);
        console.log("✅ Successfully signed out");
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error("❌ Sign out error:", e.message);
            throw new Error(e.message);
        }
        throw new Error("An unexpected error occurred during sign-out.");
    }
};


export const registerWithEmail = async (data: LoginData) => {
    try {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        return data.email;
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error("❌ Registration error:", e.message);
            throw new Error(e.message);
        }
        throw new Error("An unexpected error occurred during registration.");
    }
};


export const registerFirebase = async (data: LoginData) => {
    return data.email === "GOOGLE" ? loginWithGoogle() : registerWithEmail(data);
};