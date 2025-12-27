import { Link } from "react-router";
import styles from "./Staff-Area.module.css";

const StaffArea: React.FC = () => {
    return (
        <>
            <h1 className={styles["staff-area-h1"]}>Staff Area Actions:</h1>

            <section className={styles["staff-area"]}>
                <div className={styles["staff-area-card"]}>
                    <img src="/images/animal-types.png" alt="Animal Types" />
                    <div className={styles.content}>
                        <h2>Animal Types</h2>
                        <Link to="/staff-area/animal-types" className={styles["staff-area-make-changes-btn"]}>Make Changes</Link>
                    </div>
                </div>

                <div className={styles["staff-area-card"]}>
                    <img src="/images/appointments.png" alt="Appointments" />
                    <div className={styles.content}>
                        <h2>Appointments</h2>
                        <Link to="/staff-area/appointments" className={styles["staff-area-make-changes-btn"]}>Make Changes</Link>
                    </div>
                </div>

                <div className={styles["staff-area-card"]}>
                    <img src="/images/owner-accounts.png" alt="Owner Accounts" />
                    <div className={styles.content}>
                        <h2>Owner Accounts</h2>
                        <Link to="/staff-area/owner-accounts" className={styles["staff-area-make-changes-btn"]}>Make Changes</Link>
                    </div>
                </div>

                <div className={styles["staff-area-card"]}>
                    <img src="/images/prescriptions.png" alt="Prescriptions" />
                    <div className={styles.content}>
                        <h2>Prescriptions</h2>
                        <Link to="/staff-area/prescriptions" className={styles["staff-area-make-changes-btn"]}>Make Changes</Link>
                    </div>
                </div>

                <div className={styles["staff-area-card"]}>
                    <img src="/images/procedures.png" alt="Procedures" />
                    <div className={styles.content}>
                        <h2>Procedures</h2>
                        <Link to="/staff-area/procedures" className={styles["staff-area-make-changes-btn"]}>Make Changes</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default StaffArea;