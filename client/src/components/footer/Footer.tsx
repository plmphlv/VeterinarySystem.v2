import type React from "react";
import { Link } from "react-router";

const Footer: React.FC = () => {
    return (
        <section className="footer">
            <div className="socials">
                <Link to="#"><i className="fa-brands fa-facebook-f"></i></Link>
                <Link to="#"><i className="fa-brands fa-instagram"></i></Link>
                <Link to="#"><i className="fa-brands fa-linkedin"></i></Link>
                <Link to="#"><i className="fa-brands fa-youtube"></i></Link>
            </div>

            <ul className="list">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about.html">About</Link>
                </li>
                <li>
                    <Link to="/contact.html">Contact</Link>
                </li>
                <li>
                    <Link to="/services.html">Services</Link>
                </li>
                {/*
                <li>
                    <Link to="/login.html">Profile</Link>
                </li>
                <li>
                    <Link to="/register.html">My Pets</Link>
                </li>
                */}
                <li>
                    <Link to="/login.html">Login</Link>
                </li>
                <li>
                    <Link to="/register.html">Register</Link>
                </li>
                {/*
                <li>
                    <Link to="#">Logout</Link>
                </li>
                */}
            </ul>

            <p className="copyright">
                Veteriq @ 2025
            </p>
        </section>
    );
};

export default Footer;