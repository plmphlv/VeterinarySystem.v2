import { Link } from "react-router";
import Dialog from "../../dialog/Dialog";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { useState } from "react";
import styles from "./Animal-Types.module.css";
import AnimalTypesItem from "./animal-types-item/Animal-Types-Item";

const AnimalTypes: React.FC = () => {
    const { error } = useGetUserData();
    const [showError, setShowError] = useState(true);

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
                        <h1 className={styles.title}>Animal Types</h1>
                        <p className={styles.subtitle}>Manage the list of animal types available in the system</p>
                    </header>

                    <div className={styles.contentWrapper}>
                        <ul className={styles.list}>
                            <AnimalTypesItem />
                        </ul>
                    </div>

                    <div className={styles.ctaWrapper}>
                        <Link 
                            to="/staff-area/animal-types/add" 
                            className={styles.addBtn}
                        >
                            <i className="fa-solid fa-plus"></i> Add a New Animal Type
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
}

export default AnimalTypes;