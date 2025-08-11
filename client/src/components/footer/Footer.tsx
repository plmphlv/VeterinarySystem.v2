import type React from "react";
import { Link } from "react-router";
import { useUserContext } from "../../contexts/UserContext";

const Footer: React.FC = () => {
    const { isSuccessful } = useUserContext();

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
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
                <li>
                    <Link to="/services">Services</Link>
                </li>
                {isSuccessful ? (
                    <>
                        <li>
                            <Link to="/my-pets">My Pets</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>

                        <li>
                            <Link to="/logout">Logout</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul >

            <p className="copyright">
                Veteriq @ 2025
            </p>
        </section >
    );
};

export default Footer;