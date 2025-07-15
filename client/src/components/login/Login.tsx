import type React from "react";
import { Link } from "react-router";

const Login: React.FC = () => {
    return (
        <>
            <section className="login">
                <div className="login-container">
                    <h2>Login</h2>
                    <form>
                        <div className="login-form-group">
                            <label htmlFor="emailOrUsername"><i className="fa-solid fa-envelope"></i> Email Address or Username:</label>
                            <input type="email" id="emailOrUsername" placeholder="Enter your email or username" required />
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="password"><i className="fa-solid fa-key"></i> Password:</label>
                            <input type="password" id="password" placeholder="Enter your password" required />
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                    </form>
                    <div className="login-bottom-text">
                        Don't have an account? <Link to="/register">Register</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login;