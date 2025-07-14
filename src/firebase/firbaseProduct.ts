
import {database} from "../configs/firebase_config.ts";
import {v4 as uuidv4} from "uuid";
import {collection,doc,getDoc,deleteDoc,getCountFromServer, setDoc} from "firebase/firestore"
import type {Category, ProductType} from "../utils/types.ts";
import product_src from '../configs/product_src.json'

import {collectionData} from "rxfire/firestore";
import {Observable} from "rxjs";

const candleCollection = collection(database, "candle_collection")
const categoryCollection = collection(database, "category_collection")
const OtherProductCollection = collection(database, "other_product_collection")

export const addCandle = async (product:ProductType) => {
    product.id = uuidv4() as string;
    const ref =doc(candleCollection, product.id);
    await setDoc(ref, product);
}

export const addOtherProd = async (product:ProductType) => {
    product.id = uuidv4() as string;
    const ref =doc(OtherProductCollection, product.id);
    await setDoc(ref, product);
}
export const addCategory = async (category: Category) => {
    const ref =doc(categoryCollection, category.cat_name);
    await setDoc(ref, category);
}

export const removeCategory = async (category: Category) => {
    const ref =doc(categoryCollection, category.cat_name);
    await deleteDoc(ref);
}

export const removeProduct = async (id: string):Promise<ProductType> => {
    const ref=doc(candleCollection, id);
    const temp = await getDoc(ref);
    await deleteDoc(ref);
    return temp.data() as ProductType;
}

export const getProduct = async (id: string):Promise<ProductType> => {
    const ref = doc(candleCollection,id);
    return (await getDoc(ref)).data() as ProductType;
}

export const isCategoryExists = async (name: string):Promise<boolean> => {
    const ref =doc(categoryCollection, name);
    return (await getDoc(ref)).exists();
}

export const setProducts = async ():Promise<number> => {
    let count= (await getCountFromServer(candleCollection)).data().count;
    if(count === 0){
        const products = product_src.map(
            item =>{
                if(item.smell){
                    return {
                        title: item.name,
                        unit: item.unit,
                        cost: item.cost,
                        smell: item.smell,
                        img:item.img,
                        category: item.name.split("-")[0],
                    }}
                else{
                    return {
                        title: item.name,
                        unit: item.unit,
                        description: item.description,
                        cost: item.cost,
                        img:item.img,
                        category: item.name.split("-")[0],
                    }
                }


             /*   title: item.name,
                unit: item.unit,
                cost: item.cost,
                img:item.img,
                category: item.name.split("-")[0],

              */
            }
        );
        for (let i = 0; i < products.length; i++) {
            const tempCat = await isCategoryExists(products[i].category);
            if(!tempCat){
                await addCategory({cat_name: products[i].category});
            }
            if(products[i].smell){
                await addOtherProd(products[i]);
            }else{
            await addCandle(products[i])}
            count++;
        }
    }
    return count;
}

export const getProducts= ()=>{
    return {candles:collectionData(candleCollection) as Observable<ProductType[]>,
            other:collectionData(OtherProductCollection) as Observable<ProductType[]>,
    }
}

export const updateProduct = async (product: ProductType) => {

    if (!product.id) {
        throw new Error("Product ID is required for update");
    }
    const productRef = doc(database, "products_collection", product.id);
    await setDoc(productRef, product, { merge: true }); // merge - чтобы не перезаписать весь документ
};


export const deleteProduct = async (productId: string) => {
    const productRef = doc(database, "products_collection", productId);
    await deleteDoc(productRef);
};