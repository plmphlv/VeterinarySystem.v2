import type React from "react";
import { NavLink } from "react-router";
import { useUserContext } from "../../contexts/UserContext";

const Footer: React.FC = () => {
    const { isSuccessful } = useUserContext();

    return (
        <section className="footer">
            <div className="socials">
                <NavLink to="#"><i className="fa-brands fa-facebook-f"></i></NavLink>
                <NavLink to="#"><i className="fa-brands fa-instagram"></i></NavLink>
                <NavLink to="#"><i className="fa-brands fa-linkedin"></i></NavLink>
                <NavLink to="#"><i className="fa-brands fa-youtube"></i></NavLink>
            </div>

            <ul className="list">
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/about">About</NavLink>
                </li>
                <li>
                    <NavLink to="/contact">Contact</NavLink>
                </li>
                <li>
                    <NavLink to="/services">Services</NavLink>
                </li>
                {isSuccessful ? (
                    <>
                        <li>
                            <NavLink to="/my-pets">My Pets</NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>

                        <li>
                            <NavLink to="/logout">Logout</NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/login">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/register">Register</NavLink>
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