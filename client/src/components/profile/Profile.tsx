import React, { useState } from "react";
import { useGetUserData } from "../hooks/useGetUserData";
import Dialog from "../dialog/Dialog";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router";

const Profile: React.FC = () => {
    const { userData, isLoading, error } = useGetUserData();
    const [showError, setShowError] = useState(true);

    if (isLoading) return <Spinner />;

    return (
        <>
            {/* <h1 className="services-h1">My Profile</h1> */}

            {error && showError && (
                <Dialog
                    message={error}
                    type="error"
                    onClose={() => setShowError(false)}
                />
            )}

            {userData ? (
                <div className="profile-card">
                    <div className="avatar">
                        {userData.firstName[0]}{userData.lastName[0]}
                    </div>

                    <div className="field">
                        <label>Email:</label>
                        <span>{userData.email}</span>
                    </div>

                    <div className="field">
                        <label>First Name:</label>
                        <span>{userData.firstName}</span>
                    </div>

                    <div className="field">
                        <label>Last Name:</label>
                        <span>{userData.lastName}</span>
                    </div>

                    <div className="field">
                        <label>Phone Number:</label>
                        <span>{userData.phoneNumber}</span>
                    </div>

                    <Link to="/profile/edit" className="edit-button">Edit Profile</Link>
                    <Link to="/profile/change-password" className="edit-button">Change Password</Link>
                </div>
            ) : !isLoading && !error ? (
                <p>No user data found.</p>
            ) : null}
        </>
    );
};

export default Profile;