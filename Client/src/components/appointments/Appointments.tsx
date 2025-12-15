import { Link } from "react-router";
import { useGetUserData } from "../../hooks/useGetUserData";
import AppointmentsItem from "./appointments-item/Appointments-Item";
import Dialog from "../dialog/Dialog";
import { useState } from "react";
import Spinner from "../spinner/Spinner";

const Appointments: React.FC = () => {
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
                    <h1 className="appointments-h1">My Appointment Requests:</h1>
                    <div className="appointments-div">
                        <AppointmentsItem />
                    </div>
                    <Link to="/appointments/request-appointment" className="my-pets-request-appointment-btn">Request New Appointment</Link>
                </>
            )}
        </>
    )
}

export default Appointments;