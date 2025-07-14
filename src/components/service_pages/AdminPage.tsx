import { useEffect, useState } from "react";
import {type OrderType, statusEnums} from "../../utils/types.ts";
import {getAllOrders, switchStatusByOrderId} from "../../firebase/orders_firbase.ts";
import {
    Box,
    CircularProgress,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, type SelectChangeEvent, Select, MenuItem,
} from "@mui/material";
import { format } from "date-fns";
import { AdminProductForm } from "./AddProduct_form.tsx";

const AdminOrders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: statusEnums) => {
        await switchStatusByOrderId(orderId, newStatus);
        await fetchOrders();
    };

    if (loading) {
        return (
            <Box textAlign="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: 4,
                fontFamily: "'Georgia', serif",
                backgroundColor: "#fffaf3",
                minHeight: "100vh",
                color: "#4b3b2b",
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#8b5e3c",
                    textShadow: "1px 1px 1px rgba(200, 170, 130, 0.3)",
                }}
            >
                📦 Все заказы ({orders.length})
            </Typography>

            {orders.length === 0 ? (
                <Typography sx={{ textAlign: "center", mt: 4 }}>
                    Нет заказов пока что.🕯
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ backgroundColor: "#fdf6ee" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Телефон</strong></TableCell>
                                <TableCell><strong>Оплата</strong></TableCell>
                                <TableCell><strong>Статус</strong></TableCell>
                                <TableCell><strong>Сумма</strong></TableCell>
                                <TableCell><strong>Дата</strong></TableCell>
                                <TableCell><strong>Товары</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.userEmail}</TableCell>
                                    <TableCell>{order.phone}</TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onChange={(e: SelectChangeEvent) =>
                                                handleStatusChange(order.id, e.target.value as statusEnums)
                                            }
                                            size="small"
                                            sx={{ minWidth: 150 }}
                                        >
                                            {Object.values(statusEnums).map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell>{order.totalAmount.toFixed(2)} ₪</TableCell>
                                    <TableCell>
                                        {order.createdAt?.seconds
                                            ? format(new Date(order.createdAt.seconds * 1000), "dd.MM.yyyy HH:mm")
                                            : "неизвестно"}
                                    </TableCell>
                                    <TableCell>
                                        <ul style={{ paddingLeft: 16 }}>
                                            {order.items.map((item) => (
                                                <li key={item.productId}>
                                                    🕯 <strong>{item.title}</strong> — {item.count} × {item.cost.toFixed(2)} ₪
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Box mt={6} sx={{ borderTop: "2px solid #d8c6b1", pt: 4 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        textAlign: "center",
                        color: "#7b5636",
                    }}
                >
                    Добавить новый товар
                </Typography>
                <AdminProductForm />
            </Box>
        </Box>
    );
};

export default AdminOrders;


