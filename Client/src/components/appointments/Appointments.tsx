import React, { useState } from "react";
import { Link } from "react-router";
import { useGetUserData } from "../../hooks/useGetUserData";
import AppointmentsItem from "./appointments-item/Appointments-Item";
import Dialog from "../dialog/Dialog";
import Spinner from "../spinner/Spinner";
import styles from "./Appointments.module.css";

const Appointments: React.FC = () => {
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
                    <header className={styles.header}>
                        <h1 className={styles.title}>My Appointments Requests</h1>
                        <p className={styles.subtitle}>Track and manage your scheduled visits.</p>
                    </header>

                    <div className={styles.contentWrapper}>
                        <AppointmentsItem />
                    </div>

                    <div className={styles.ctaWrapper}>
                        <Link
                            to="/appointments/request-appointment"
                            className={styles.primaryBtn}
                        >
                            Request an Appointment
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
};

export default Appointments;