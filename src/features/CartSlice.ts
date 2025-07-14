import {createSlice} from "@reduxjs/toolkit";
import type {ShopCartProdType} from "../utils/types.ts";

const initialState: {cartProducts: ShopCartProdType[]} = {
    cartProducts: []
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action)=> {
            state.cartProducts = action.payload;
        },
        resetCart: (state) => {state.cartProducts = []}
    }});

export const {setCart, resetCart} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;