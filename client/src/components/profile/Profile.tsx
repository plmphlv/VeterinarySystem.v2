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
        <>
            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}

            {userData ? (
                <>
                    <h1 className={styles["profile-h1"]}>{userData.firstName}'s Profile</h1>
                    <div className={styles["profile-container"]}>
                        <div className={styles["profile-item-card"]}>
                            <div className={styles.avatar}>
                                {userData.firstName[0]}{userData.lastName[0]}
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-envelope"></i> Email:</label>
                                <span>{userData.email}</span>
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-pen"></i> First Name:</label>
                                <span>{userData.firstName}</span>
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-pen"></i> Last Name:</label>
                                <span>{userData.lastName}</span>
                            </div>

                            <div className={styles.field}>
                                <label><i className="fa-solid fa-phone"></i> Phone Number:</label>
                                <span>{userData.phoneNumber}</span>
                            </div>

                            {userData.address && (
                                <div className={styles.field}>
                                    <label><i className="fa-solid fa-map-marker-alt"></i> Address:</label>
                                    <span>{userData.address}</span>
                                </div>
                            )}

                            <div className={styles["profile-btns"]}>
                                <Link to="/profile/edit" className={styles["profile-edit-btn"]}>Edit Profile</Link>
                                <Link to="/profile/change-password" className={styles["profile-change-pass-btn"]}>Change Password</Link>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // <h1 className={styles["profile-no-user-data"]}>No user data found, please try again later.</h1>
                null
            )}
        </>
    );
};

export default Profile;