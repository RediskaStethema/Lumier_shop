import {auth} from "../../../configs/firebase_config.ts";
import {useEffect, useState} from "react";
import type {UserDataType} from "../../../utils/types.ts";
import {addUser, getUser, updateUser} from "../../../firebase/firbase_userdata_service.ts";
import {Box, Button, Container, Fade, IconButton} from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import ErrorPage from "../ErrorPage.tsx";


const Profile = () => {
    const [loaded, setLoaded] = useState(false);

    const [userData, setUserData] = useState<UserDataType>({
        email: auth.currentUser?.email || "",
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        notes: "",
    });

    useEffect(() => {
        const timeout = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const email = auth.currentUser?.email;
            if (!email) return;

            const user = await getUser(email);
            if (user) {
                setUserData(user);
            }
        };

        fetchUserData();
    }, []);

    const handleChange =
        (field: keyof UserDataType) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setUserData((prev) => ({
                    ...prev,
                    [field]: event.target.value,
                }));
            };

    const handleUpdate = async () => {
        const email = auth.currentUser?.email;
        if (!email) return;

        const existing = await getUser(email);
        if (!existing) {
            await addUser(userData); // добавление нового
        } else {
            await updateUser(email, userData); // обновление
        }

        alert("✅ Profile saved successfully!");
    }
if(auth.currentUser)
    return (
        <Fade in={loaded} timeout={700}>
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 8,
                        p: 4,
                        borderRadius: "16px",
                        backgroundColor: "#fff8f0",
                        boxShadow: "0 6px 18px rgba(90, 62, 54, 0.1)",
                        fontFamily: "Georgia, serif",
                        color: "#5a3e36",
                        transition: "box-shadow 0.3s ease",
                        "&:hover": {
                            boxShadow: "0 8px 24px rgba(90, 62, 54, 0.15)",
                        },
                    }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            color: "#7a5c4f",
                            fontWeight: 700,
                            mb: 2,
                            textShadow: "1px 1px #e6dcd2",
                        }}
                    >
                        Edit Profile
                    </Typography>

                    {[
                        { label: "Email", field: "email", disabled: true },
                        { label: "First Name", field: "first_name" },
                        { label: "Last Name", field: "last_name" },
                        { label: "Phone", field: "phone" },
                        { label: "Address", field: "address" },
                        { label: "Notes", field: "notes", multiline: true, rows: 3 },
                    ].map(({ label, field, disabled, multiline, rows }) => (
                        <TextField
                            key={field}
                            label={label}
                            value={userData[field as keyof UserDataType] || ""}
                            onChange={!disabled ? handleChange(field as keyof UserDataType) : undefined}
                            disabled={disabled}
                            fullWidth
                            margin="normal"
                            multiline={multiline}
                            rows={rows}
                            sx={{
                                backgroundColor: disabled ? "#f3efe6" : "#fdfaf6",
                                borderRadius: 2,
                                input: {
                                    fontFamily: "Georgia, serif",
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#d7b8a4",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#a67c52",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#a67c52",
                                    },
                                },
                            }}
                        />
                    ))}

                    <Button
                        onClick={handleUpdate}
                        variant="contained"
                        sx={{
                            backgroundColor: "#b39272",
                            color: "#fffef9",
                            fontWeight: "bold",
                            fontFamily: "Georgia, serif",
                            mt: 3,
                            padding: "10px 20px",
                            borderRadius: "12px",
                            boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "#a67c52",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                            },
                        }}
                    >
                        Save Changes
                    </Button>
                    <Box
                        sx={{
                            mt: 8,
                            textAlign: "center",
                            borderTop: "1px solid #e0d8cf",
                            pt: 3,
                            px: 2,
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#6e5c4f" }}>
                            Следите за нами в
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
            </Container>

        </Fade>
    );
else{
    return (<ErrorPage/>)
}
};

export default Profile;