import "./styles_layout.css";
import React, { useEffect, useState } from "react";
import {AppBar, Box, Tab, Tabs, Typography} from "@mui/material";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import type { RouteType } from "../../utils/types.ts";
import {useAppSelector} from "../../app/hooks.ts";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";


type Props = {
    items: RouteType[];
};

const Layout: React.FC<Props> = ({ items }) => {
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [, setValue] = useState(0);
    const navigate = useNavigate();
    const { authUser } = useAppSelector((state) => state.auth);

    const handleImageClick = () => {
        if (authUser) {
            window.open("https://www.instagram.com/lumiere_vi", "_blank");
        } else {
            navigate("/login");
        }
    };

    const leftTabs = items.filter(
        (item) =>
            item.title !== "Profile" &&
            item.title !== "Logout" &&
            item.title !== "Cart" &&
            item.title !== "Orders" &&
            item.title !== "Login"
    );
    const rightTabs = items.filter(
        (item) =>
            item.title === "Profile" ||
            item.title === "Logout" ||
            item.title === "Cart" ||
            item.title === "Orders" ||
            item.title === "Login"
    );

    useEffect(() => {
        const activeIndex = leftTabs.findIndex((item) => item.path === location.pathname);
        if (activeIndex !== -1) {
            setValue(activeIndex);
        }
    }, [location.pathname, leftTabs]);

    return (
        <Box sx={{ mt: { xs: "60px", md: "100px" }, px: { xs: 2, md: 4 } }}>
            <AppBar
                sx={{
                    backgroundColor: "#d2b48c",
                    color: "#4b3b2b",
                    fontFamily: "'Playfair Display', serif",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "background-color 0.5s ease, color 0.5s ease, transform 0.3s ease",
                    WebkitTransition: "background-color 0.5s ease, color 0.5s ease, transform 0.3s ease",
                    "&:hover": {
                        backgroundColor: "#c19a6b",
                        color: "#3a2f20",
                        transform: "scale(1.01)",
                    },
                    px: { xs: 2, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        "@supports (display: grid)": {
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            alignItems: "center",
                        },
                    }}
                >
                    {/* Бургер-меню (только на xs) */}
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{ display: { xs: "block", sm: "none" }, color: "#4b3b2b", justifySelf: "start" }}
                        aria-label="open menu"
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Левая часть — табы (sm и выше) */}
                    <Tabs
                        value={location.pathname}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            display: { xs: "none", sm: "flex" },
                            fontFamily: "'Playfair Display', serif",
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#c19a6b",
                                height: 2,
                                borderRadius: 2,
                            },
                            justifySelf: "start",
                            maxWidth: "100%",
                        }}
                    >
                        {leftTabs.map((item, index) => (
                            <Tab
                                key={index}
                                component={Link}
                                to={item.path}
                                label={item.title}
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: { sm: "18px", md: "22px" },
                                    color: "#4b3b2b",
                                    textTransform: "none",
                                    "&.Mui-selected": {
                                        color: "#f1eeec",
                                        fontWeight: 900,
                                    },
                                    "&:hover": {
                                        color: "#e8d5c5",
                                        cursor: "pointer",
                                    },
                                }}
                            />
                        ))}
                    </Tabs>

                    {/* Центр — логотип + название */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifySelf: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src="https://i.pinimg.com/736x/20/6d/e7/206de74fdfdb47fa04cba81abb8e676d.jpg"
                            alt="Logo"
                            sx={{
                                height: { xs: 48, sm: 64 },
                                width: { xs: 48, sm: 64 },
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "3px solid #fce9db",
                                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.15)",
                                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                                WebkitTransition: "transform 0.4s ease, box-shadow 0.4s ease",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
                                },
                                cursor: "pointer",
                            }}
                            onClick={handleImageClick}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: { xs: "16px", sm: "18px", md: "20px" },
                                color: "#4b3b2b",
                                fontWeight: 600,
                                letterSpacing: "1px",
                                mt: 1,
                            }}
                        >
                            Lumiere
                        </Typography>
                    </Box>

                    {/* Правая часть — табы (sm и выше) */}
                    <Tabs
                        value={false}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            display: { xs: "none", sm: "flex" },
                            justifySelf: "end",
                            maxWidth: "100%",
                        }}
                    >
                        {rightTabs.map((item, index) => (
                            <Tab
                                key={`right-${index}`}
                                component={Link}
                                to={item.path}
                                label={item.title}
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: { sm: "18px", md: "22px" },
                                    color: "#4b3b2b",
                                    textTransform: "none",
                                    "&:hover": {
                                        color: "#e8d5c5",
                                        cursor: "pointer",
                                    },
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>

                {/* Drawer для телефона */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    sx={{ display: { xs: "block", sm: "none" } }}
                >
                    <Box
                        sx={{ width: 250, backgroundColor: "#fefaf7", height: "100%" }}
                        role="presentation"
                        onClick={() => setDrawerOpen(false)}
                        onKeyDown={() => setDrawerOpen(false)}
                    >
                        <List>
                            {items.map((item, index) => (
                                <ListItem  key={index} component={Link} to={item.path}>
                                    <ListItemText
                                        primary={item.title}
                                        primaryTypographyProps={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "1.1rem",
                                            color: "#4b3b2b",
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </AppBar>

            <Outlet />
        </Box>
    );
};

export default Layout;

