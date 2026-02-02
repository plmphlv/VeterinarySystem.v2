import { Link } from "react-router";
import Dialog from "../../dialog/Dialog";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { useState } from "react";
import AnimalTypeItem from "./animal-type-item/Animal-Type-Item";
import styles from "./Animal-Types.module.css";

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
                    <header className={styles.header}>
                        <h1 className={styles.title}>Animal Types</h1>
                        <p className={styles.subtitle}>Manage the list of animal types available in the system</p>
                    </header>

                    <div className={styles.contentWrapper}>
                        <ul className={styles.list}>
                            <AnimalTypeItem />
                        </ul>
                    </div>

                    <div className={styles.ctaWrapper}>
                        <Link 
                            to="/staff-area/animal-types/add" 
                            className={styles.primaryBtn}
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