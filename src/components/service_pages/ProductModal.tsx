import { Dialog, DialogContent, DialogTitle, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


import { useNavigate } from "react-router-dom";
import {useAppSelector} from "../../app/hooks.ts";
import {addProductUnitToCart, removeProductUnitFromCart} from "../../firebase/firebaseCartService.ts";
import type {ProductType} from "../../utils/types.ts";


interface Props {
    open: boolean;
    onClose: () => void;
    product: ProductType | null;
}

const ProductModal = ({ open, onClose, product }: Props) => {
    const { authUser } = useAppSelector((state) => state.auth);
    const { cartProducts } = useAppSelector((state) => state.cart);
    const navigate = useNavigate();

    if (!product) return null;

    const getProdCount = (id: string | undefined) => {
        const prod = cartProducts.find((item) => item.cartProdId === id);
        return prod ? prod.count : 0;
    };

    const handleAdd = async () => {
        if (!authUser) return navigate("/login");
        await addProductUnitToCart(`${authUser}_collection`, product.id as string);
    };

    const handleRemove = async () => {
        if (!authUser) return navigate("/login");
        await removeProductUnitFromCart(`${authUser}_collection`, product.id as string);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "'Playfair Display', serif",
                    backgroundColor: "#f6eee7",
                    fontWeight: 700,
                    fontSize: 24,
                    color: "#4b3b2b",
                    borderBottom: "1px solid #e0d6cc",
                }}
            >
                {product.title}
                <IconButton onClick={onClose} sx={{ color: "#4b3b2b" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    p: 3,
                    fontFamily: "'Georgia', serif",
                    backgroundColor: "#fffaf5",
                }}
            >
                {/* Изображение */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={product.img}
                        alt={product.title}
                        style={{
                            width: "100%",
                            maxWidth: 400,
                            borderRadius: "16px",
                            objectFit: "cover",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                </Box>

                {/* Описание и кнопки */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    {product.description ? (
                        <>
                            <Typography fontSize={18} fontWeight="bold" color="#4b3b2b">
                                Description:
                            </Typography>
                            <Typography sx={{ color: "#5c483e" }}>{product.description}</Typography>

                            <Typography fontWeight="bold" color="#4b3b2b">
                                Цена: <span style={{ fontWeight: "normal" }}>{product.cost} ₪</span>
                            </Typography>
                            <Typography>
                                Доступно: <span style={{ fontWeight: 500 }}>{product.unit}</span>
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography fontSize={18} fontWeight="bold" color="#4b3b2b">
                                Smell:
                            </Typography>
                            <Typography sx={{ color: "#5c483e" }}>{product.smell}</Typography>

                            <Typography fontWeight="bold" color="#4b3b2b">
                                Цена: <span style={{ fontWeight: "normal" }}>{product.cost} ₪</span>
                            </Typography>
                            <Typography>
                                Доступно: <span style={{ fontWeight: 500 }}>{product.unit}</span>
                            </Typography>
                        </>
                    )}

                    {/* Кнопки добавления/удаления */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleAdd}
                            sx={{
                                borderColor: "#a58d7f",
                                color: "#6e5c4f",
                                "&:hover": {
                                    backgroundColor: "#f3e9e1",
                                    borderColor: "#6e5c4f",
                                },
                            }}
                        >
                            +
                        </Button>
                        <Typography fontSize={20}>{getProdCount(product.id)}</Typography>
                        <Button
                            variant="outlined"
                            onClick={handleRemove}
                            disabled={getProdCount(product.id) === 0}
                            sx={{
                                borderColor: "#a58d7f",
                                color: "#6e5c4f",
                                "&:hover": {
                                    backgroundColor: "#f3e9e1",
                                    borderColor: "#6e5c4f",
                                },
                                "&.Mui-disabled": {
                                    borderColor: "#ccc",
                                    color: "#aaa",
                                },
                            }}
                        >
                            -
                        </Button>
                    </Box>
                </Box>

            </DialogContent>
        </Dialog>

    );
};

export default ProductModal;
