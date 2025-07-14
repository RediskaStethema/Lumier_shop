import {doc, collection, getDoc, deleteDoc, setDoc} from "firebase/firestore";

import {Observable} from "rxjs";
import {collectionData} from "rxfire/firestore";
import {database} from "../configs/firebase_config.ts";
import type {ShopCartProdType} from "../utils/types.ts";

export const COLLECTION_PREFIX = "Cart_product_collection"; // Лучше без пробелов и символов!

export const addProductToCart = async (collName: string, product: ShopCartProdType) => {
    const ref = doc(database, `${COLLECTION_PREFIX}_${collName}`, product.cartProdId);
    await setDoc(ref, product);
};

export const removeProductFromCard = async (collName: string, id: string) => {
    const ref = doc(database, `${COLLECTION_PREFIX}_${collName}`, id);
    await deleteDoc(ref);
};

export const addProductUnitToCart = async (collName: string, id: string ) => {
    const ref = doc(database, `${COLLECTION_PREFIX}_${collName}`, id);
    const temp = await getDoc(ref);
    const prodData = temp.data();
    const count = prodData?.count || 0;

    await addProductToCart(collName, { cartProdId: id as string, count: count + 1 });
};

export const removeProductUnitFromCart = async (collName: string, id: string ) => {
    const ref = doc(database, `${COLLECTION_PREFIX}_${collName}`, id);
    const temp = await getDoc(ref);
    const prodData = temp.data();
    const count = prodData?.count || 0;

    if (count <= 1) {
        await removeProductFromCard(collName, id as string);
    } else {
        await addProductToCart(collName, { cartProdId: id as string, count: count - 1 });
    }
};

export const getCartProducts = (collName: string): Observable<ShopCartProdType[]> => {
    const ref = collection(database, `${COLLECTION_PREFIX}_${collName}`);
    return collectionData(ref) as Observable<ShopCartProdType[]>;
};
