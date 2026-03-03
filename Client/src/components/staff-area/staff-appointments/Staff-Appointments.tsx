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
        <section className={styles.container}>
            {error && showError ? (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            ) : (
                <>
                    <div className={styles.navWrapper}>
                        <Link to="/staff-area" className={styles.backLink}>
                            &larr; Back to Staff Area
                        </Link>
                    </div>

                    <header className={styles.header}>
                        <h1 className={styles.title}>All Appointment Requests</h1>
                        <p className={styles.subtitle}>Manage incoming requests from pet owners</p>
                    </header>

                    <div className={styles.contentWrapper}>
                        <StaffAppointmentsItem />
                    </div>

                    <div className={styles.ctaWrapper}>
                        <Link
                            to="/staff-area/appointments/create-appointment"
                            className={styles.primaryBtn}
                        >
                            <i className="fa-solid fa-plus"></i> Create a New Appointment
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
}

export default StaffAppointments;