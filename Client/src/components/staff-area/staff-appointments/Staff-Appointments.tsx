import { useState } from "react";
import { Link } from "react-router";
import { useGetUserData } from "../../../hooks/useGetUserData";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import StaffAppointmentsItem from "./staff-appointments-item/Staff-Appointments-Item";

const StaffAppointments: React.FC = () => {
    const { userData, error } = useGetUserData();
    const [showError, setShowError] = useState(true);

    if (!userData) {
        return <Spinner />;
    }

    return (
        <>
            {error && showError ? (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            ) : (
                <>
                    <h1 className="appointments-h1">All Appointments Requests:</h1>
                    <div className="appointments-div">
                        <StaffAppointmentsItem />
                    </div>
                </>
            )}
        </>
    )
}

export default StaffAppointments;