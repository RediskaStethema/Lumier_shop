import {type LoginData, Paths, type UserDataType} from "../../utils/types.ts";
import {registerFirebase} from "../../firebase/fireStoreServiceAuth.ts";

import {useAppDispatch} from "../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import {login} from "../../features/authSlice.ts";
import {addUser} from "../../firebase/firbase_userdata_service.ts";
import { logout } from "../../features/authSlice.ts";
import SignUpCard from "./teamplayts/SignUpCard.tsx";


const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const sign=async (data: UserDataType) => {
     const setUp:LoginData={
         email:data.email,
         password:data.password as string,
     }
     try {
        const email= await registerFirebase(setUp)
         dispatch(login(email))
         await addUser({
             ...data,
             registeredAt:new Date().toISOString().split("T")[0],
             phone: "",
             address: "",
             notes: "",
         })
         navigate(Paths.HOME);
     }catch (e: unknown) {
         dispatch(logout());

         if (e instanceof Error) {
             console.error("❌ Sign up error:", e.message);
             alert(e.message);
         } else {
             console.error("❌ Unknown error occurred:", e);
             alert("An unexpected error occurred.");
         }
     }
 }

    return (
        <div>
            <SignUpCard signUpFn={sign}/>
            <button  onClick={() => navigate(Paths.HOME)}>To main page</button>
        </div>
    );
};

export default SignUp;