import type {ProductType} from "../utils/types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState:{products:ProductType[]}={products:[]}

const productSlice= createSlice({
    name: "currProduct",
    initialState,
    reducers: {
        setAllProducts: (state, action: PayloadAction<ProductType[]>) => {
            state.products = action.payload
        }
    }
})
export const productsReduser =productSlice.reducer;
export const {setAllProducts}= productSlice.actions;