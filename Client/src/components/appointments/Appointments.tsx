import { Link } from "react-router";
import { useGetUserData } from "../../hooks/useGetUserData";
import AppointmentsItem from "./appointments-item/Appointments-Item";
import Dialog from "../dialog/Dialog";
import { useState } from "react";
import Spinner from "../spinner/Spinner";
import styles from "./Appointments.module.css";

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
                    <h1 className={styles["appointments-h1"]}>
                        My Appointments Requests:
                    </h1>

                    <div className={styles["appointments-div"]}>
                        <AppointmentsItem />
                    </div>

                    <Link
                        to="/appointments/request-appointment"
                        className={styles["appointments-request-appointment-btn"]}
                    >
                        Request New Appointment
                    </Link>
                </>
            )}
        </>
    );
};

export default Appointments;
