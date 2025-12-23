import { useState } from "react";
import { Link } from "react-router";
import { useGetUserData } from "../../../hooks/useGetUserData";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import StaffAppointmentsItem from "./staff-appointments-item/Staff-Appointments-Item";
import styles from "./Staff-Appointments.module.css";

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
                    <h1 className={styles["staff-appointments-h1"]}>All Appointments Requests:</h1>
                    <div className={styles["staff-appointments-div"]}>
                        <StaffAppointmentsItem />
                    </div>

                    <Link
                        to="/staff-area/appointments/create-appointment"
                        className={styles["staff-appointments-create-appointment-btn"]}
                    >
                        Create New Appointment
                    </Link>
                </>
            )}
        </>
    )
}

export default StaffAppointments;