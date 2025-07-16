import {

    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,

    Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import { addProductToCart, removeProductFromCard } from "../firebase/firebaseCartService";
import { type ShopCartProdType, type ShoppingCartTableDataType} from "../utils/types";
import { useRef, useState } from "react";
import { createOrder } from "../firebase/orders_firbase.ts";
import {auth} from "../configs/firebase_config.ts";
import {logout} from "../features/authSlice.ts";

import {useNavigate} from "react-router-dom";



const ShopingCart = () => {
    const {authUser} = useAppSelector((state) => state.auth);
    const {products} = useAppSelector((state) => state.currProduct);
    const {cartProducts} = useAppSelector((state) => state.cart);
    const [, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const alertMessage = useRef("Alert");
    const [, setSnackbarOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();



        if (!auth.currentUser) {
            dispatch(logout());
            navigate('/');
        }

        function getTableShoppingCartProduct(prod: ShopCartProdType): ShoppingCartTableDataType | null {
            const product = products.find((item) => item.id === prod.cartProdId);
            if (!product) {
                removeProductFromCard(`${authUser}_collection`, prod.cartProdId);
                return null;
            }

            const cost = Number(product.cost) || 0;
            const amount = prod.count * cost;

            return {
                ...product,
                count: prod.count,
                cost,
                amount,
            };
        }

        const tableData = cartProducts
            .map(getTableShoppingCartProduct)
            .filter((td): td is ShoppingCartTableDataType => td !== null);

        const totalCost: number = tableData.reduce((acc, item) => acc + item.amount, 0);

        const columns: GridColDef[] = [
            {field: "title", headerName: "Product name", flex: 1},
            {field: "unit", headerName: "Unit", flex: 0.4},
            {
                field: "cost",
                headerName: "Cost (NIS)",
                flex: 0.4,
                renderCell: ({value}) =>
                    typeof value === "number" ? `${value.toFixed(2)} ₪` : "-",
            },
            {
                field: "count",
                headerName: "Quantity",
                flex: 0.4,
                editable: true,
            },
            {
                field: "amount",
                headerName: "Amount (NIS)",
                flex: 0.4,
                renderCell: ({value}) =>
                    typeof value === "number" ? `${value.toFixed(2)} ₪` : "-",
            },
            {
                field: "img",
                headerName: "Image",
                flex: 0.6,
                renderCell: (params) => (
                    <Avatar
                        sx={{width: "60px", height: "60px", margin: "0 auto"}}
                        src={params.value}
                        alt={params.row.title}
                    />
                ),
            },
            {
                field: "actions",
                type: "actions",
                flex: 0.4,
                getActions: ({id}) => [
                    <GridActionsCellItem
                        key="delete"
                        label="remove"
                        icon={<DeleteIcon/>}
                        onClick={() =>
                            removeProductFromCard(`${authUser}_collection`, id as string)
                        }
                    />,
                ],
            },
        ];

        const handleBuyClick = () => {
            if (tableData.length === 0) {
                alert("Корзина пуста!");
                return;
            }
            setDialogOpen(true);
        };

        const handlePaymentMethodChange = (event: SelectChangeEvent) => {
            setPaymentMethod(event.target.value);
        };

        const handleDialogClose = () => {
            setDialogOpen(false);
        };

        const handleConfirmOrder = async () => {
            if (!paymentMethod) {
                alert("Пожалуйста, выберите способ оплаты.");
                return;
            }

            try {
                await createOrder({
                    userEmail: authUser,
                    phone: "", // Добавь, если получаешь телефон где-то
                    paymentMethod,
                    items: tableData.map((item) => ({
                        productId: item.id!,
                        title: item.title,
                        count: item.count,
                        cost: item.cost,
                    })),
                });

                alert("Спасибо за покупку! Ваш заказ успешно создан.");
                setDialogOpen(false);

                cartProducts.forEach((prod) =>
                    removeProductFromCard(`${authUser}_collection`, prod.cartProdId)
                );
            } catch (error) {
                alertMessage.current = (error as Error).message;
                setSnackbarOpen(true);
            }
        };

        return (
            <Box
                sx={{
                    width: {xs: "450px", sm: "70vw"},
                    mx: "auto",
                    mt: 4,
                    p: {xs: 1.5, sm: 2},
                    fontFamily: "'Georgia', serif",
                    backgroundColor: "#fffaf4",
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    boxSizing: "border-box",
                }}
            >
                {/* Горизонтальный скролл только на телефоне */}
                <Box
                    sx={{
                        overflowX: {xs: "auto", sm: "visible"},
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    <Box sx={{minWidth: {xs: 650, sm: "auto"}}}>
                        <DataGrid
                            columns={columns}
                            rows={tableData}
                            getRowHeight={() => "auto"}
                            processRowUpdate={(updatedRow) => {
                                const newData: ShoppingCartTableDataType = updatedRow;
                                if (newData.count < 1) throw new Error("Quantity must be greater than 0. Press ESC");
                                if (newData.count === 0)
                                    removeProductFromCard(`${authUser}_collection`, newData.id!);
                                else
                                    addProductToCart(`${authUser}_collection`, {
                                        cartProdId: newData.id!,
                                        count: newData.count,
                                    });
                                return updatedRow;
                            }}
                            onProcessRowUpdateError={(error) => {
                                alertMessage.current = error.message;
                                setOpen(true);
                            }}
                            sx={{
                                fontFamily: "'Georgia', serif",
                                backgroundColor: "#fdfaf6",
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: "#fce9db",
                                    transition: "background-color 0.3s ease",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "1px solid #e8dcd1",
                                    color: "#5a3e36",
                                    fontSize: "1rem",
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#e8dcd1",
                                    color: "#4b3b2b",
                                    fontWeight: "bold",
                                    borderBottom: "2px solid #cdb4a0",
                                },
                            }}
                        />
                    </Box>
                </Box>

                <Typography
                    sx={{
                        mt: 2,
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        color: "#5a3e36",
                        textAlign: "center",
                    }}
                >
                    Total cart cost: {totalCost.toFixed(2)} ₪
                </Typography>

                {tableData.length > 0 && (
                    <Button
                        onClick={handleBuyClick}
                        variant="contained"
                        sx={{
                            display: "block",
                            mx: "auto",
                            mt: 3,
                            backgroundColor: "#a67c52",
                            color: "#fffef9",
                            fontWeight: "bold",
                            fontFamily: "Georgia, serif",
                            padding: "10px 30px",
                            borderRadius: "12px",
                            boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "#8c5c3b",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                            },
                        }}
                    >
                        Buy
                    </Button>
                )}

                {/* Диалог оплаты — оставляем без изменений */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            fontSize: "1.6rem",
                            color: "#6b4b3e",
                            backgroundColor: "#f8eee8",
                        }}
                    >
                        Payment Methods
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            backgroundColor: "#fdfaf6",
                            fontFamily: "'Georgia', serif",
                            color: "#4a3f35",
                        }}
                    >
                        <Typography sx={{fontSize: "0.95rem", mb: 2, mt: 1, color: "#8a6e5d"}}>
                            Please make sure you have entered the correct phone number and shipping address in your
                            profile.
                            WE DELIVER ONLY TO HAIFA AND KRAYOT.
                        </Typography>

                        <FormControl fullWidth sx={{mt: 2}}>
                            <InputLabel id="payment-method-label">Payment Method</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                value={paymentMethod}
                                label="Способ оплаты"
                                onChange={handlePaymentMethodChange}
                                sx={{backgroundColor: "#fff"}}
                            >
                                <MenuItem value="cash">Cash on delivery</MenuItem>
                                <MenuItem value="bit">BIT</MenuItem>
                            </Select>
                        </FormControl>

                        {paymentMethod === "bit" && (
                            <Box
                                mt={3}
                                sx={{
                                    backgroundColor: "#fff3e6",
                                    padding: 2,
                                    borderRadius: 2,
                                    border: "1px solid #d6c3b3",
                                    fontFamily: "Georgia, serif",
                                    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Typography fontWeight={600} color="#6b4b3e">
                                    🔗 BIT:
                                </Typography>

                                <Typography mt={1} fontSize="1rem">
                                    Transfer to number:{" "}
                                    <strong style={{color: "#8c5c3b"}}>
                                        {import.meta.env.VITE_ROOT_NUMBER}
                                    </strong>
                                </Typography>

                                <Box mt={2} display="flex" justifyContent="center">
                                    <img
                                        src={import.meta.env.VITE_QR}
                                        alt="QR"
                                        style={{width: "150px", height: "auto", borderRadius: "8px"}}
                                    />
                                </Box>

                                <Typography mt={2} fontSize="1.1rem" fontWeight={600} color="#5a3e36">
                                    💰 Amount to be paid:{" "}
                                    <strong style={{color: "#8c5c3b"}}>
                                        {totalCost.toFixed(2)} ₪
                                    </strong>
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions sx={{px: 3, py: 2, backgroundColor: "#f8eee8"}}>
                        <Button onClick={handleDialogClose}>Отмена</Button>
                        <Button
                            onClick={handleConfirmOrder}
                            variant="contained"
                            disabled={!paymentMethod}
                            sx={{
                                backgroundColor: "#8c5c3b",
                                color: "#fffaf4",
                                "&:hover": {
                                    backgroundColor: "#6e4b31",
                                },
                            }}
                        >
                            Сonfirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

        );
    }

export default ShopingCart;



