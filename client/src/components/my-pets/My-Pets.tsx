import type React from "react";
import { Link } from "react-router";
import MyPetItem from "./my-pets-item/My-Pets-Item";
import { useGetUserData } from "../../hooks/useGetUserData";
import Dialog from "../dialog/Dialog";
import { useState } from "react";
import styles from "./My-Pets.module.css";
import Spinner from "../spinner/Spinner";

const MyPets: React.FC = () => {
    const { isLoading, error } = useGetUserData();
    const [showError, setShowError] = useState(true);

    if (isLoading) {
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
                        <h1 className={styles.title}>My Pets</h1>
                        <p className={styles.subtitle}>Manage your furry friends' profiles.</p>
                    </header>

                    <div className={styles.contentWrapper}>
                        <MyPetItem />
                    </div>

                    <div className={styles.ctaWrapper}>
                        <Link to="/my-pets/add" className={styles.primaryBtn}>
                            <i className="fa-solid fa-plus"></i> Add a New Pet
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
};

export default MyPets;