import type React from "react";
import { Link } from "react-router";

const Register: React.FC = () => {
    return (
        <>
            <section className="register">
                <div className="register-container">
                    <h2>Register</h2>
                    <form>
                        <div className="register-form-group">
                            <label htmlFor="username"><i className="fa-solid fa-user"></i> Username:</label>
                            <input type="text" id="username" placeholder="Choose a username" required />
                        </div>
                        <div className="register-form-group">
                            <label htmlFor="email"><i className="fa-solid fa-envelope"></i> Email Address:</label>
                            <input type="email" id="email" placeholder="Enter your email" required />
                        </div>
                        <div className="register-form-group">
                            <label htmlFor="firstName"><i className="fa-solid fa-pen"></i> First Name:</label>
                            <input type="text" id="firstName" placeholder="Enter your first name" required />
                        </div>
                        <div className="register-form-group">
                            <label htmlFor="lastName"><i className="fa-solid fa-pen"></i> Last Name:</label>
                            <input type="text" id="lastName" placeholder="Enter your last name" required />
                        </div>
                        <div className="register-form-group">
                            <label htmlFor="phone"><i className="fa-solid fa-phone"></i> Phone Number:</label>
                            <input type="tel" id="phone" placeholder="Enter your phone number" required />
                        </div>
                        <div className="register-form-group">
                            <label htmlFor="password"><i className="fa-solid fa-key"></i> Password:</label>
                            <input type="password" id="password" placeholder="Create a password" required />
                        </div>
                        <div className="register-form-group">
                            <label htmlFor="confirmPassword"><i className="fa-solid fa-key"></i> Confirm Password:</label>
                            <input type="password" id="confirmPassword" placeholder="Confirm your password" required />
                        </div>
                        <button type="submit" className="register-btn">Register</button>
                    </form>
                    <div className="register-bottom-text">
                        Already registered? <Link to="/login">Login</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Register;