import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {getUserOrders} from "../firebase/orders_firbase.ts";
import {useEffect, useState} from "react";
import {type OrderType, Paths} from "../utils/types.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {auth} from "../configs/firebase_config.ts";
import {logout} from "../features/authSlice.ts";
import {useNavigate} from "react-router-dom";


const Orders = () => {
    const { authUser } = useAppSelector(state => state.auth);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (!auth.currentUser) {
            dispatch(logout());
            navigate(Paths.CANDLE);
        }
    }, []);

    useEffect(() => {
        if (!authUser) return;

        const fetchOrders = async () => {
            try {
                const data = await getUserOrders(authUser);
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [authUser]);

    if (!authUser) return <Typography>Please log in to view your orders.</Typography>;

    if (loading) return <Typography>Loading orders...</Typography>;

    if (orders.length === 0) return <Typography>You have no orders.</Typography>;

    return (

        <Box
            sx={{

                width: "100%",
                maxWidth: 900,
                px: { xs: 2, sm: 3 }, // внутренние отступы слева/справа
                boxSizing: "border-box",
                // чтобы padding не увеличивал ширину
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    marginBottom: 4,
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    color: "#8b5e3c",
                    textShadow: "1px 1px 2px rgba(180, 140, 100, 0.6)",
                }}
            >
                My orders
            </Typography>

            {orders.map((order) => (
                <TableContainer
                    key={order.id}
                    component={Paper}
                    sx={{
                        mb: 5,
                        borderRadius: 2,
                        backgroundColor: "#fbf3ea",
                        boxShadow: "2px 2px 8px rgba(167, 130, 88, 0.2)",
                        "&:hover": {
                            boxShadow: "4px 4px 15px rgba(167, 130, 88, 0.4)",
                            transform: "scale(1.02)",
                            transition: "all 0.3s ease",
                        },
                        // Мобильный скролл для таблицы
                        overflowX: "auto",
                    }}
                >
                    <Table
                        aria-label={`Order ${order.id}`}
                        sx={{
                            minWidth: 650,
                            "@media (max-width:600px)": {
                                minWidth: "100%",
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#7b5636" }}
                                >
                                    Orders ID: {order.id} | Status: <em>{order.status}</em> | Pay:{" "}
                                    {order.paymentMethod} | Sum:{" "}
                                    <strong>{order.totalAmount.toFixed(2)} ₪</strong>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: "#6e4b2a" }}>Товар</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#6e4b2a" }} align="right">
                                    Quantity
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#6e4b2a" }} align="right">
                                    Price for one item
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: "#6e4b2a" }} align="right">
                                    Total
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.productId} sx={{ borderBottom: "1px solid #d7b89d" }}>
                                    <TableCell component="th" scope="row" sx={{ color: "#5a3e36" }}>
                                        {item.title}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "#5a3e36" }}>
                                        {item.count}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "#5a3e36" }}>
                                        {item.cost.toFixed(2)} ₪
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: "600", color: "#7b5636" }}>
                                        {(item.count * item.cost).toFixed(2)} ₪
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ))}
        </Box>

    );
};

export default Orders;