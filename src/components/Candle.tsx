import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {Box, Button, Card, CardActions, CardContent} from "@mui/material";
import Grid from '@mui/joy/Grid';
import Typography from "@mui/material/Typography";
import {addProductUnitToCart, removeProductUnitFromCart} from "../firebase/firebaseCartService.ts";
import {useEffect, useState} from "react";
import { type ProductType} from "../utils/types.ts";
import ProductModal from "./service_pages/ProductModal.tsx";
import {auth} from "../configs/firebase_config.ts";
import {logout} from "../features/authSlice.ts";






const Candle = () => {
    const { products } = useAppSelector((state) => state.currProduct);
    const { authUser } = useAppSelector((state) => state.auth);
    const { cartProducts } = useAppSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();



    useEffect(() => {
        if (!auth.currentUser) {
            dispatch(logout());
        }
    }, []);

    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = (product: ProductType) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setModalOpen(false);
    };

    const getProdCount = (id: string) => {
        const prod = cartProducts.find((item) => item.cartProdId === id);
        return prod ? prod.count : 0;
    };

    return (
        <>
            <Grid container spacing={4} justifyContent="center">
                {products.filter((item) => item.description).map((item) => (
                    <Grid key={item.id}  xs={12} sm={6} md={4} lg={3}>
                        <Card
                            onClick={() => openModal(item)}
                            sx={{
                                cursor: "pointer",
                                width: 280,
                                mx: "auto",
                                backgroundColor: "#fff8f0",
                                borderRadius: 4,
                                boxShadow: "0 6px 12px rgba(90, 62, 54, 0.1)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: 220,
                                    overflow: "hidden",
                                    position: "relative",
                                    "& img": {
                                        transition: "transform 0.4s ease",
                                    },
                                    "&:hover img": {
                                        transform: "scale(1.1)",
                                    },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={item.img}
                                    alt={item.title}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />
                            </Box>

                            <CardContent
                                sx={{
                                    textAlign: "center",
                                    fontFamily: "Georgia, serif",
                                    color: "#5a3e36",
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    {item.title}
                                </Typography>
                                <Typography>Units: {item.unit}</Typography>
                                <Typography>Price: {item.cost}₪</Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: "center", gap: 2, mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderColor: "#a67c52",
                                        color: "#5a3e36",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            backgroundColor: "#fce9db",
                                            borderColor: "#8d6e5c",
                                        },
                                    }}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (!authUser) return navigate("/login");
                                        await addProductUnitToCart(`${authUser}_collection`, item.id!);
                                    }}
                                >
                                    +
                                </Button>

                                <Box sx={{ fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>
                                    {getProdCount(item.id!)}
                                </Box>

                                <Button
                                    variant="outlined"
                                    disabled={getProdCount(item.id!) === 0}
                                    sx={{
                                        borderColor: "#a67c52",
                                        color: "#5a3e36",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            backgroundColor: "#fce9db",
                                            borderColor: "#8d6e5c",
                                        },
                                    }}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (!authUser) return navigate("/login");
                                        await removeProductUnitFromCart(`${authUser}_collection`, item.id!);
                                    }}
                                >
                                    -
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>


            <ProductModal open={modalOpen} onClose={closeModal} product={selectedProduct} />
        </>
    );
};

export default Candle;


