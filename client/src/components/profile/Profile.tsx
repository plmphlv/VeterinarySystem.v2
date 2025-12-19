import React, { useState } from "react";
import { useGetUserData } from "../../hooks/useGetUserData";
import Dialog from "../dialog/Dialog";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router";

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
                    <h1 className="h1-profile">{userData.firstName}'s Profile</h1>
                    <div className="profile">
                        <div className="profile-card">
                            <div className="avatar">
                                {userData.firstName[0]}{userData.lastName[0]}
                            </div>

                            <div className="field">
                                <label><i className="fa-solid fa-envelope"></i> Email:</label>
                                <span>{userData.email}</span>
                            </div>

                            <div className="field">
                                <label><i className="fa-solid fa-pen"></i> First Name:</label>
                                <span>{userData.firstName}</span>
                            </div>

                            <div className="field">
                                <label><i className="fa-solid fa-pen"></i> Last Name:</label>
                                <span>{userData.lastName}</span>
                            </div>

                            <div className="field">
                                <label><i className="fa-solid fa-phone"></i> Phone Number:</label>
                                <span>{userData.phoneNumber}</span>
                            </div>

                            {userData.address && (
                                <div className="field">
                                    <label><i className="fa-solid fa-map-marker-alt"></i> Address:</label>
                                    <span>{userData.address}</span>
                                </div>
                            )}
                            <div className="profile-buttons">
                                <Link to="/profile/edit" className="edit-button">Edit Profile</Link>
                                <Link to="/profile/change-password" className="edit-button">Change Password</Link>
                                {/* <Link to="/profile/change-email" className="edit-button">Change Email Address</Link> */}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // <h1 className="no-user-data">No user data found, please try again later.</h1>
                null
            )}
        </>
    );
};

export default Profile;
