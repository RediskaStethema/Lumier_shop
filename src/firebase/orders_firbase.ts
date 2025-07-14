import {addDoc, collection, doc, getDoc, serverTimestamp, query, where, getDocs, updateDoc} from "firebase/firestore";
import {database} from "../configs/firebase_config.ts";
import {type CreateOrderParams, type OrderType, statusEnums} from "../utils/types.ts";


const OrdersDataColl = collection(database, "Orders_collection");


export const switchStatusByOrderId = async (orderId: string, newStatus: statusEnums) => {
    try {
        const orderRef = doc(database, "Orders_collection", orderId);
        await updateDoc(orderRef, { status: newStatus });
        console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
        console.error("Error switching status:", error);
    }
};

// Получить все заказы (для админа)
export const getAllOrders = async (): Promise<OrderType[]> => {
    const OrdersCollection = collection(database, "Orders_collection");
    const querySnapshot = await getDocs(OrdersCollection);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            createdAt: data.createdAt,
            userEmail: data.userEmail,
            phone: data.phone,
            paymentMethod: data.paymentMethod,
            totalAmount: data.totalAmount,
            status: data.status,
            adress:data.adress,
            items: data.items,
        } as OrderType;
    });
};

// Получить заказы пользователя по email
export const getUserOrders = async (userEmail: string): Promise<OrderType[]> => {
    try {
        const ordersCollection = collection(database, "Orders_collection");
        const q = query(ordersCollection, where("userEmail", "==", userEmail));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                createdAt: data.createdAt,
                userEmail: data.userEmail,
                phone: data.phone,
                paymentMethod: data.paymentMethod,
                totalAmount: data.totalAmount,
                adress: data.adress,
                status: data.status,
                items: data.items,
            } as OrderType;
        });
    } catch (error) {
        throw new Error("Failed to fetch orders: " + (error as Error).message);
    }
};

// Создание нового заказа
export const createOrder = async ({
                                      userEmail,
                                      paymentMethod,
                                      items,
                                  }: CreateOrderParams): Promise<string> => {
    try {
        const userDocRef = doc(database, "user_data_collection", userEmail);
        const userSnap = await getDoc(userDocRef);

        let phone = "";
        let address=''
        if (userSnap.exists()) {
            const userData = userSnap.data();
            phone = userData.phone || "";
            address=userData.address || "";
        }

        const totalAmount = items.reduce(
            (sum, item) => sum + item.cost * item.count,
            0
        );

        const docRef = await addDoc(OrdersDataColl, {
            userEmail,
            phone,
            paymentMethod,
            items,
            totalAmount,
            address,
            createdAt: serverTimestamp(),
            status: "new",
        });

        return docRef.id;
    } catch (error) {
        throw new Error("Failed to create order: " + (error as Error).message);
    }
};
