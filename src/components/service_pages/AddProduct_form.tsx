import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
} from "@mui/material";
import {addCandle, addOtherProd} from "../../firebase/firbaseProduct.ts";

const emptyForm = {
    title: "",
    description: "",
    cost: 0,
    unit: "",
    category: "",
    img: "",
};

export const AdminProductForm = () => {
    const [open, setOpen] = useState(false);
    const [isCandle, setIsCandle] = useState(true);
    const [formData, setFormData] = useState(emptyForm);

    const handleChange = (field: keyof typeof emptyForm) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async () => {
        try {
            if (isCandle) {

                await addCandle(formData);
            } else {

                const { description, ...rest } = formData;
                await addOtherProd({
                    ...rest,
                    smell: formData.category,
                });
            }
            setFormData(emptyForm);
            setOpen(false);
        } catch (err) {
            console.error("Error adding product:", err);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{
                    mb: 3,
                    px: 3,
                    py: 1.2,
                    backgroundColor: "#8c5c3b",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "none",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                        backgroundColor: "#a06c4f",
                        transform: "scale(1.03)",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                    },
                }}
            >Добавить товар
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 2,
                        backgroundColor: "#fffaf3",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        border: "2px solid #e8d7c5",
                        fontFamily: "'Georgia', serif",
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600, color: "#5a3e36" }}>
                    Add {isCandle ? "свечу" : "другой товар"}
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                        minWidth: { xs: "300px", sm: "400px" },
                    }}
                >
                    <TextField
                        label="Название"
                        value={formData.title}
                        onChange={handleChange("title")}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Описание"
                        value={formData.description}
                        onChange={handleChange("description")}
                        fullWidth
                        multiline
                        rows={2}
                        disabled={!isCandle} // Для другого товара поле неактивно, т.к. не используется
                    />
                    <TextField
                        label="Цена"
                        type="number"
                        value={formData.cost}
                        onChange={handleChange("cost")}
                        fullWidth
                    />
                    <TextField
                        label="Единица измерения"
                        value={formData.unit}
                        onChange={handleChange("unit")}
                        fullWidth
                    />
                    <TextField
                        label="Ссылка на изображение"
                        value={formData.img}
                        onChange={handleChange("img")}
                        fullWidth
                    />
                    <TextField
                        label={isCandle ? "Категория" : "Аромат (smell)"}
                        value={formData.category}
                        onChange={handleChange("category")}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Тип товара"
                        value={isCandle ? "candle" : "other"}
                        onChange={(e) => setIsCandle(e.target.value === "candle")}
                        fullWidth
                    >
                        <MenuItem value="candle">Свеча</MenuItem>
                        <MenuItem value="other">Другой товар</MenuItem>
                    </TextField>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setOpen(false)}
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            color: "#6c584c",
                            textTransform: "none",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: "#8c5c3b",
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#a06c4f",
                            },
                        }}
                    >
                        Safe
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
