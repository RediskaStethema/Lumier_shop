import {useAppDispatch} from "../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import SignInCard from "./teamplayts/SignInCard.tsx";
import {type LoginData, Paths} from "../../utils/types.ts";
import {login} from "../../features/authSlice.ts";
import {loginFirebase} from "../../firebase/fireStoreServiceAuth.ts";
import {Box, IconButton, Typography} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";



const Login=()=>{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const submitFnFirebase = async (loginData: LoginData) => {
        try {
            const email = await loginFirebase(loginData);


            const isAdmin = email && email.includes(import.meta.env.VITE_ROOT_KEY);
            const role = isAdmin ? "ADMIN" : "USER";


            localStorage.setItem("authUser", JSON.stringify({ email, role }));


            dispatch(login(email));

            navigate(Paths.HOME);
        } catch (e: unknown) {
            if (e instanceof Error) {
                let errorMessage = e.message;

                if (
                    errorMessage.includes("auth/user-not-found") ||
                    errorMessage.includes("auth/wrong-password") ||
                    errorMessage.includes("auth/invalid-credential")
                ) {
                    errorMessage = "Incorrect email or password. Please try again.";
                }

                alert(errorMessage);
            } else {
                alert("An unexpected error occurred.");
            }
        }
    };

return (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            flexDirection: "column",

            px: { xs: 0, sm: 4 },
            overflowX: "hidden",
        }}
    >
        {/* Область с карточкой входа */}
        <Box
            sx={{

                height: { xs: "100vh", sm: "auto" },
                width: { xs: "200%", sm: "auto" },
                maxWidth: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 0,
                py: 0,
            }}
        >
            <Box
                sx={{
                    width: { xs: "20%", sm: "auto" },
                    maxWidth: 450,
                    mr: 2,// 👉 на телефоне ширина фиксирована в 320px
                    height: { xs: "100%", sm: "auto" },         // 👉 на телефоне — 100% от родительского контейнера
                    borderRadius: { xs: 2, sm: 3 },             // 👉 чуть менее скруглённые углы на телефоне
                    boxShadow: {
                        xs: "none",                               // 👉 без тени на телефоне
                        sm: "0 4px 12px rgba(90, 62, 54, 0.15)",  // 👉 тень на планшетах и десктопах
                    },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                }}
            >
                <SignInCard submitFn={submitFnFirebase} />
            </Box>
        </Box>

        {/* Подвал с соцсетями */}
        <Box
            sx={{
                ml:5,
                mt: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                px: { xs: 2, sm: 4 },
                overflowX: "hidden",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    mb: { xs: 1.5, sm: 2 },
                    fontWeight: 600,
                    color: "#6e5c4f",
                    fontSize: { xs: "1.1rem", sm: "1.5rem" },
                }}
            >
                Follow us
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: { xs: 0.5, sm: 1 },
                    mb: { xs: 2, sm: 3 },
                }}
            >
                {[
                    {
                        href: "https://www.instagram.com/lumiere_vi",
                        icon: <InstagramIcon fontSize="medium" />,
                        title: "Instagram",
                    },
                    {
                        href: "https://www.linkedin.com/in/daniel-gershzon-5047a5313/",
                        icon: <LinkedInIcon fontSize="medium" />,
                        title: "LinkedIn",
                    },
                    {
                        href: "https://www.pinterest.com/lumiere_vi/_created",
                        icon: <PinterestIcon fontSize="medium" />,
                        title: "Pinterest",
                    },
                    {
                        href: "https://wa.me/+972533570150",
                        icon: <WhatsAppIcon fontSize="medium" />,
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
                            mx: { xs: 0.5, sm: 1 },
                            transition: "color 0.3s ease, background-color 0.3s ease",
                            "&:hover": {
                                color: "#6e5c4f",
                                backgroundColor: "#f0e6dd",
                            },
                            minWidth: 40,
                            minHeight: 40,
                        }}
                        aria-label={title}
                    >
                        {icon}
                    </IconButton>
                ))}
            </Box>

            <Typography
                variant="body2"
                sx={{
                    color: "#9b8d80",
                    mt: { xs: 2, sm: 3 },
                    fontSize: { xs: "0.75rem", sm: "1rem" },
                }}
            >
                © {new Date().getFullYear()} Lumière Vi – Все права защищены
            </Typography>
        </Box>
    </Box>





)
}


export default Login