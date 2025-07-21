import type React from "react";

const EditProfile: React.FC = () => {
    return (
        <form className="profile-card" action="#" method="post">
            <div className="avatar">BI</div>

            <div className="field">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value="bozhidarivanov24@gmail.com" />
            </div>

            <div className="field">
                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" value="Bozhidar" />
            </div>

            <div className="field">
                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" value="Ivanov" />
            </div>

            <div className="field">
                <label htmlFor="phone">Phone Number:</label>
                <input type="tel" id="phone" name="phone" value="+359 89 499 2968" />
            </div>

            <button className="edit-button" type="submit">Save Profile</button>
        </form>
    )
}

export default EditProfile;