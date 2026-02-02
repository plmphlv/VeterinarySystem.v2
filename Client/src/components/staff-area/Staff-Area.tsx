import React from "react";
import { Link } from "react-router";
import styles from "./Staff-Area.module.css";

const StaffArea: React.FC = () => {
    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Staff Area Actions</h1>
                <p className={styles.subtitle}>Manage veterinary resources and configurations</p>
            </header>

            <div className={styles.grid}>
                <article className={styles.card}>
                    <div className={styles.imageWrapper}>
                        <img src="/images/animal-types.png" alt="Animal Types" />
                    </div>
                    <div className={styles.content}>
                        <h2>Animal Types</h2>
                        <Link to="/staff-area/animal-types" className={styles.actionBtn}>
                            Make Changes
                        </Link>
                    </div>
                </article>

                <article className={styles.card}>
                    <div className={styles.imageWrapper}>
                        <img src="/images/appointments.png" alt="Appointments" />
                    </div>
                    <div className={styles.content}>
                        <h2>Appointments</h2>
                        <Link to="/staff-area/appointments" className={styles.actionBtn}>
                            Make Changes
                        </Link>
                    </div>
                </article>

                <article className={styles.card}>
                    <div className={styles.imageWrapper}>
                        <img src="/images/owner-accounts.png" alt="Owner Accounts" />
                    </div>
                    <div className={styles.content}>
                        <h2>Owner Accounts</h2>
                        <Link to="/staff-area/owner-accounts" className={styles.actionBtn}>
                            Make Changes
                        </Link>
                    </div>
                </article>

                <article className={styles.card}>
                    <div className={styles.imageWrapper}>
                        <img src="/images/prescriptions.png" alt="Prescriptions" />
                    </div>
                    <div className={styles.content}>
                        <h2>Prescriptions</h2>
                        <Link to="/staff-area/prescriptions" className={styles.actionBtn}>
                            Make Changes
                        </Link>
                    </div>
                </article>

                <article className={styles.card}>
                    <div className={styles.imageWrapper}>
                        <img src="/images/procedures.png" alt="Procedures" />
                    </div>
                    <div className={styles.content}>
                        <h2>Procedures</h2>
                        <Link to="/staff-area/procedures" className={styles.actionBtn}>
                            Make Changes
                        </Link>
                    </div>
                </article>

                <article className={styles.card}>
                    <div className={styles.imageWrapper}>
                        <img src="/images/staff-profiles.png" alt="Staff Profiles" />
                    </div>
                    <div className={styles.content}>
                        <h2>Staff Profiles</h2>
                        <Link to="/staff-area/staff-profiles" className={styles.actionBtn}>
                            Make Changes
                        </Link>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default StaffArea;