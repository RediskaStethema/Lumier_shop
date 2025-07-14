import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks.ts";
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import {logout} from "../../features/authSlice.ts";
import {signoutFirebase} from "../../firebase/fireStoreServiceAuth.ts";



const Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(true); // открыто по умолчанию

    const handleClose = () => {
        if (!loading) {
            setOpen(false);
            navigate(-1); // вернуться на предыдущую страницу
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        try {
            await signoutFirebase();

            localStorage.removeItem("authUser");

            dispatch(logout());
            navigate('/');
        } catch (e) {
            console.error("Logout error", e);
            setError("Failed to logout. Try again.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {loading ? "Logging out..." : "Are you sure you want to log out?"}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleLogout} color="error" autoFocus disabled={loading}>
                        {loading ? "Exiting..." : "Exit"}
                    </Button>
                </DialogActions>
            </Dialog>
            {error && <p style={{color: "red", textAlign: "center"}}>{error}</p>}
        </>
    );
};

export default Logout;
