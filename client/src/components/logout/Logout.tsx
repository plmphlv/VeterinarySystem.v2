import { useContext, useEffect, useState } from "react";
import { useLogout } from "../../api/authAPI";
import { useNavigate } from "react-router";
import Dialog from "../dialog/Dialog";
import { UserContext } from "../../contexts/UserContext";

const Logout: React.FC = () => {
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { userLogoutHandler } = useContext(UserContext);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        const doLogout = async () => {
            try {
                logout();
                userLogoutHandler();
                setDialog({ message: "Logout successful!", type: "success" });
            } catch (error: any) {
                setDialog({ message: error?.message || "Logout failed.", type: "error" });
            } finally {
                navigate('/');
            }
        };

        doLogout();
    }, []);

    return (
        <>
            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}
        </>
    );
};

export default Logout;