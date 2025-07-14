import {Paths, Roles} from "../utils/types.ts";

export const navItmes=[


    {path:Paths.HOME, title: "Home", role: Roles.ALL},
    {path:Paths.ORDERS, title: "Orders", role: Roles.NO_ADMIN},
    {path:Paths.CART, title: "Cart", role: Roles.NO_ADMIN},
    {path:Paths.PRODUCTS, title: "Melts & Others", role:Roles.ALL},
    {path:Paths.LOGIN, title: "Login", role: Roles.NO_AUTH},
    {path:Paths.CANDLE, title: "Candles", role: Roles.ALL},
    {path: Paths.PROFILE, title: "Profile", role:Roles.USER },
    {path:Paths.LOGOUT, title: "Logout", role: Roles.USER},
    {path:Paths.ADMIN, title: "Admin Page", role: Roles.ADMIN},


]