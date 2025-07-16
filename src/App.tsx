
import './App.css'
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Home from "./components/Home.tsx";
import Candle from "./components/Candle.tsx";
import Orders from "./components/Orders.tsx";
import Products from "./components/Products.tsx";
import ShopingCart from "./components/ShopingCart.tsx";
import ErrorPage from "./components/service_pages/ErrorPage.tsx";
import Layout from "./components/navigate/Layout.tsx";
import {useEffect, useState} from "react";
import Login from "./components/service_pages/Login.tsx";
import {Paths, Roles, type RouteType} from "./utils/types.ts";
import {navItmes} from "./configs/nav_configs.ts";
import SignUp from "./components/service_pages/SignUp.tsx";
import {useAppDispatch, useAppSelector} from "./app/hooks.ts";
import Logout from "./components/service_pages/Logout.tsx";
import Profile from "./components/service_pages/teamplayts/Profile.tsx";
import {setAllProducts} from "./features/CandleSlice.ts";
import { getProducts} from "./firebase/firbaseProduct.ts";
import {getCartProducts} from "./firebase/firebaseCartService.ts";
import {resetCart, setCart} from "./features/CartSlice.ts";
import {login, logout} from "./features/authSlice.ts";
import {combineLatest} from "rxjs";
import AdminPage from "./components/service_pages/AdminPage.tsx";

function App() {
const [authChecked, setAuthChecked] = useState(false);
const location = useLocation();
const navigate = useNavigate();
 const dispatch = useAppDispatch();
const authUser=useAppSelector(state => state.auth.authUser)
    useEffect(() => {
        if(location.pathname === '/error')
            navigate(Paths.HOME)
    },[])

    const predicate = (item: RouteType) => {
        if (!authChecked) return false;

        const stored = localStorage.getItem("authUser");
        let role = "USER";
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                role = parsed.role;
            } catch(e) {
                throw new Error(`${e}`)
            }
        }

        const isLoggedIn = Boolean(authUser);
        const isAdmin = role === "ADMIN";

        return (
            item.role === Roles.ALL ||
            (item.role === Roles.USER && isLoggedIn) ||
            (item.role === Roles.NO_ADMIN && isLoggedIn && !isAdmin) ||
            (item.role === Roles.ADMIN && isAdmin && isLoggedIn) || // Добавил isLoggedIn
            (item.role === Roles.NO_AUTH && !isLoggedIn)
        );
    };
    const getRoutes=():RouteType[]=>{
        return navItmes.filter(item=>predicate(item))
    }

    useEffect(() => {
        const {candles, other} = getProducts();

        const subscription = combineLatest([candles, other]).subscribe(([candleProds, otherProds]) => {
            dispatch(setAllProducts([...candleProds, ...otherProds]));
        });

        return () => subscription.unsubscribe();
    }, []);




    useEffect(() => {
        if(!authUser) dispatch(resetCart());
        else {
            const subscribtion =  getCartProducts(`${authUser}_collection`);
            subscribtion.subscribe(cartProducts => dispatch(setCart(cartProducts)))
        }

    }, [authUser]);

    useEffect(() => {
        const stored = localStorage.getItem("authUser");
        if (stored) {
            try {
                const { email } = JSON.parse(stored);
                dispatch(login(email));
            } catch {
                dispatch(logout());
            }
        }
        setAuthChecked(true);
    }, [dispatch]);

  return (
   <Routes>
       <Route path={Paths.HOME} element={<Layout items={getRoutes()} />}>
       <Route path={Paths.HOME} element={<Home/>}/>
       <Route path={Paths.CANDLE} element={<Candle/>}/>
       <Route path={Paths.ORDERS} element={<Orders/>}/>
       <Route path={Paths.PRODUCTS} element={<Products/>}/>
       <Route path={Paths.CART} element={<ShopingCart/>}/>
       <Route path={Paths.LOGIN} element={<Login/>}/>
        <Route path={Paths.PROFILE} element={<Profile/>}/>
       <Route path={Paths.LOGOUT} element={<Logout/>}/>
        <Route path={Paths.ADMIN} element={<AdminPage/>}/>

   </Route>

       <Route path={Paths.SIGN_UP} element={<SignUp/>} />
       <Route path={'*'} element={
           location.pathname.includes(Paths.ERROR)?(
               <ErrorPage/>
           ):(
               <Navigate to={Paths.ERROR} replace/>
           )

       } />
   </Routes>


  )
}

export default App
