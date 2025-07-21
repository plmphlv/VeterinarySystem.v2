import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const AuthGuard: React.FC = () => {
    const { isSuccessful } = useContext(UserContext);

    if (!isSuccessful) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default AuthGuard;
