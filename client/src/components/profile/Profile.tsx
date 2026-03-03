import React, { useState } from "react";
import { useGetUserData } from "../../hooks/useGetUserData";
import Dialog from "../dialog/Dialog";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router";
import styles from "./Profile.module.css";

const Profile: React.FC = () => {
    const { userData, isLoading, error } = useGetUserData();
    const [showError, setShowError] = useState(true);

    if (isLoading) return <Spinner />;

    return (
        <section className={styles.container}>
            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}

            {userData && (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.avatar}>
                            {userData.firstName[0]}{userData.lastName[0]}
                        </div>
                        <h1 className={styles.title}>{userData.firstName}'s Profile</h1>
                        <p className={styles.subtitle}>Manage your account settings</p>
                    </header>

                    <div className={styles.contentBody}>
                        <div className={styles.infoRow}>
                            <div className={styles.label}>
                                <i className="fa-solid fa-at"></i> Email
                            </div>
                            <div className={styles.value}>{userData.email}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.label}>
                                <i className="fa-solid fa-file-signature"></i> First Name
                            </div>
                            <div className={styles.value}>{userData.firstName}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.label}>
                                <i className="fa-solid fa-file-signature"></i> Last Name
                            </div>
                            <div className={styles.value}>{userData.lastName}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.label}>
                                <i className="fa-solid fa-phone"></i> Phone Number
                            </div>
                            <div className={styles.value}>{userData.phoneNumber}</div>
                        </div>

                        {userData.address && (
                            <div className={styles.infoRow}>
                                <div className={styles.label}>
                                    <i className="fa-solid fa-map-marker-alt"></i> Address
                                </div>
                                <div className={styles.value}>{userData.address}</div>
                            </div>
                        )}
                    </div>

                    <footer className={styles.cardFooter}>
                        <Link to="/profile/edit" className={styles.editBtn}>
                            <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                        </Link>
                        <Link to="/profile/change-password" className={styles.passwordBtn}>
                            <i className="fa-solid fa-key"></i> Change Password
                        </Link>
                    </footer>
                </article>
            )}
        </section>
    );
};

export default Profile;