import React from "react";
import { Link } from "react-router";
import styles from "./Prescriptions.module.css";
import PrescriptionsItem from "./prescriptions-item/Prescriptions-Item";

const Prescriptions: React.FC = () => {
    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Prescriptions</h1>
                <p className={styles.subtitle}>Manage veterinary prescriptions for animals</p>
            </header>

            <div className={styles.contentWrapper}>
                <PrescriptionsItem />
            </div>

            <div className={styles.ctaWrapper}>
                <Link 
                    to="/staff-area/prescriptions/create" 
                    className={styles.primaryBtn}
                >
                    <i className="fa-solid fa-plus"></i> Create a Prescription
                </Link>
            </div>
        </section>
    );
}

export default Prescriptions;