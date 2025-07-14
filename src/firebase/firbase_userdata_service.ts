import {collection, doc, setDoc, getDoc, deleteDoc, updateDoc} from 'firebase/firestore';
import {database} from "../configs/firebase_config.ts";
import type {UserDataType} from "../utils/types.ts";


const userDataColl = collection(database, "user_data_collection");

export const addUser = async (user: UserDataType) => {
    const ref = doc(userDataColl, user.email);
    await setDoc(ref, { ...user,
        registeredAt: new Date().toISOString(),});
}
export  const removeUser = async (email:string) => {
    const ref = doc(userDataColl, email);
    const res = await getDoc(ref);
    await deleteDoc(ref);
    return res;
}
export const getUser = async (email:string) => {
    const ref = doc(userDataColl, email);
    const res = await getDoc(ref);
    return res.data() as UserDataType;
}
export const updateUser = async (email: string, updates: Partial<UserDataType>) => {
    const userRef = doc(userDataColl, email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()){
        const userData = userSnap.data();
        const existingRegisteredAt = userData.registeredAt || new Date().toISOString(); // Не изменяем `registeredAt`

        await updateDoc(userRef, {
            ...updates,
            registeredAt: existingRegisteredAt, // Фиксируем дату регистрации
        });}
};