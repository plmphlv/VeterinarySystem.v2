import type React from "react";

const Profile: React.FC = () => {
    return (
        <>
            <h1>My Profile</h1>

            <div className="profile-card">
                <div className="avatar">BI</div>

                <div className="field">
                    <label>Username:</label>
                    <span>b0zh1d4r</span>
                </div>

                <div className="field">
                    <label>Email:</label>
                    <span>bozhidarivanov24@gmail.com</span>
                </div>

                <div className="field">
                    <label>First Name:</label>
                    <span>Bozhidar</span>
                </div>

                <div className="field">
                    <label>Last Name:</label>
                    <span>Ivanov</span>
                </div>

                <div className="field">
                    <label>Phone Number:</label>
                    <span>+359 89 499 2968</span>
                </div>

                <button className="edit-button">Edit Profile</button>
            </div>
        </>
    )
}

export default Profile;