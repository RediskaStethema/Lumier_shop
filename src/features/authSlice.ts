import {createSlice} from "@reduxjs/toolkit";


const  authSlice = createSlice({
    name: "auth",
    initialState:{
        authUser:" "
    },reducers:{
        login: (state, action) => {
            state.authUser = action.payload||"";
        },
        logout:(state)=>{
            state.authUser = "";
        }
    }
})
export const {login, logout} = authSlice.actions;
export const authReducer=authSlice.reducer;
