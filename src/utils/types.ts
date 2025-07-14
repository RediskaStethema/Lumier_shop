export enum Paths {
    HOME = '/',
    ORDERS = 'orders',
    PRODUCTS = 'products',
    CART = 'cart',
    CUSTOMERS = 'customers',
    CANDLE = 'candle',
    DAIRY = 'dairy',
    BACK = 'back',
    LOGIN = 'login',
    LOGOUT = 'logout',
    SIGN_UP = 'signup',
    PROFILE = "profile",
    ADMIN="admin",
    ERROR = 'error',
}

export type RouteType = {
    path: Paths,
    title: string,
    role?: Roles,

}
export enum statusEnums {
    NEW = "NEW",
    IN_PROCESSING = "IN_PROCESSING",
    DELIVERD = "DELIVERD",
}

export enum Roles {
    ALL, USER, ADMIN,NO_AUTH, NO_ADMIN
}

export type ProductType = {
    id?: string,
    title: string,
    category: string,
    unit: string,
    cost: number,
    description?: string,
    smell?: string,
    img: string,
}
export type LoginData = {
    email: string,
    password: string,
}

export type Category = {
    cat_name: string,
}
export type UserDataType = {
    email: string;
    password?: string;
    role?: Roles;
    first_name: string;
    last_name: string;
    registeredAt?: string; // Дата регистрации
    phone?: string; // Можно редактировать
    address?: string; // Можно редактировать
    notes?: string;
}

export type ShopCartProdType = {
    cartProdId: string,
    count: number
}

export type OrderItem = {
    productId: string;
    title: string;
    count: number;
    cost: number;
};

export type CreateOrderParams = {
    userEmail: string;
    phone: string;
    paymentMethod: string;
    items: OrderItem[];
};


export type OrderType = {
    id: string;
    createdAt: any; // Firestore Timestamp или Date
    userEmail: string;
    adress?: string;
    phone: string;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    items: Array<{
        productId: string;
        title: string;
        count: number;
        cost: number;
    }>;
};

export type ShoppingCartTableDataType = ProductType & {count: number, amount: number}