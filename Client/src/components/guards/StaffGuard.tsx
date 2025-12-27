import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { getJwtDecodedData } from "../../utils/getJwtDecodedData";

const StaffGuard: React.FC = () => {
    const { isSuccessful } = useContext(UserContext);
    const decodedData = getJwtDecodedData();
    const role = decodedData?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (!isSuccessful && (role !== "StaffMember" && role !== "SuperAdministrator")) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default StaffGuard;