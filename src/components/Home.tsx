import {Box, Typography, Card, CardContent, CardMedia, IconButton} from "@mui/material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {useAppSelector} from "../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import Grid from '@mui/joy/Grid';
import {Paths, type ProductType} from "../utils/types.ts";



const Home = () => {

    const {products} = useAppSelector(state => state.currProduct)
    const navigate = useNavigate();
    const { authUser } = useAppSelector((state) => state.auth);

    const handleImageClick = (item: ProductType) => {
        if (authUser) {
            if(item.description)
            navigate("/candle");
            else{ navigate(Paths.PRODUCTS)}
        } else {
            navigate("/login");
        }
    };
    const productDescriptions= [
        "These candles create a warm and inviting atmosphere, filling your home with comforting scents that help you relax and feel cozy.",
        "Light these candles to transform any room into a peaceful sanctuary of calm and comfort.",
        "The gentle glow and soothing fragrances bring a sense of tranquility to your everyday life.",
        "Perfect for unwinding after a long day, these candles wrap your home in warmth and serenity.",
        "Let the soft flicker and delightful aromas make your space feel more welcoming and intimate.",
        "Candles that not only brighten your room but also soothe your soul with every scent.",
        "Bring the essence of relaxation and homeliness to your living space with these aromatic candles.",
        "Create moments of peace and comfort with the natural glow and fragrant embrace of these candles.",
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#fdfaf6",
                fontFamily: '"Georgia", serif',
                padding: { xs: 2, sm: 3 },
                color: "#4a3f35",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center",
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
                <Typography variant="h3" sx={{ mb: 2, color: "#6e5c4f", fontWeight: 600 }}>
                    Lumiere
                </Typography>

                <Typography variant="h6" sx={{ mb: 5, fontStyle: "italic", color: "#7a6a5f" }}>
                    Natural handmade candles
                </Typography>

                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    sx={{ alignItems: "stretch" }}
                >
                    {products.slice(0, 6).map((item, index) => (
                        <Grid
                            key={index}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "50%",
                                    md: "33.3333%",
                                    lg: "25%",
                                },
                                display: "flex",
                                alignItems: "stretch",
                                minWidth: 0,
                                flexShrink: 1,
                                p: 1,
                            }}
                        >
                            <Card
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    borderRadius: 4,
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                                    backgroundColor: "#fffaf3",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                    },
                                }}
                                onClick={() => handleImageClick(item)}
                            >
                                <CardMedia
                                    component="img"
                                    image={item.img}
                                    alt={item.title}
                                    sx={{
                                        width: "100%",
                                        height: 240,
                                        objectFit: "cover",
                                        display: "block",
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4,
                                    }}
                                />
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flexGrow: 1,
                                        justifyContent: "space-between",
                                        minHeight: 120,
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h6" sx={{ color: "#5c483e", fontWeight: 600 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#7a6a5f", mt: 1 }}>
                                            {item.smell}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 2,
                                            fontSize: "14px",
                                            color: "#6b5a4e",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {productDescriptions[index] || ""}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box
                sx={{
                    mt: 8,
                    textAlign: "center",
                    borderTop: "1px solid #e0d8cf",
                    pt: 3,
                    px: 2,
                    width: "90%",
                    maxWidth: 1200,
                    mx: "auto",
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#6e5c4f" }}>
                    Follow us
                </Typography>
                <Box>
                    {[
                        {
                            href: "https://www.instagram.com/lumiere_vi",
                            icon: <InstagramIcon fontSize="large" />,
                            title: "Instagram",
                        },
                        {
                            href: "https://www.linkedin.com/in/daniel-gershzon-5047a5313/",
                            icon: <LinkedInIcon fontSize="large" />,
                            title: "LinkedIn",
                        },
                        {
                            href: "https://www.pinterest.com/lumiere_vi/_created",
                            icon: <PinterestIcon fontSize="large" />,
                            title: "Pinterest",
                        },
                        {
                            href: "https://wa.me/+972533570150",
                            icon: <WhatsAppIcon fontSize="large" />,
                            title: "WhatsApp",
                        },
                    ].map(({ href, icon, title }, i) => (
                        <IconButton
                            key={i}
                            href={href}
                            target="_blank"
                            title={title}
                            sx={{
                                color: "#a58d7f",
                                mx: 1,
                                transition: "color 0.3s ease, background-color 0.3s ease",
                                "&:hover": {
                                    color: "#6e5c4f",
                                    backgroundColor: "#f0e6dd",
                                },
                            }}
                            aria-label={title}
                        >
                            {icon}
                        </IconButton>
                    ))}
                </Box>
                <Typography variant="body2" sx={{ color: "#9b8d80", mt: 3 }}>
                    © {new Date().getFullYear()} Lumière Vi – Все права защищены
                </Typography>
            </Box>
        </Box>



    );
};

export default Home;

