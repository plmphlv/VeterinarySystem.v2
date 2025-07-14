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
                            <label htmlFor="email"><i className="fa-solid fa-envelope"></i> Email Address:</label>
                            <input type="email" id="email" placeholder="Enter your email" required />
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