import type React from "react";
import { NavLink } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { getJwtDecodedData } from "../../utils/getJwtDecodedData";

const Footer: React.FC = () => {
    const { isSuccessful } = useUserContext();
    const decodedData = getJwtDecodedData();

    const role = decodedData?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

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
                            <NavLink to="/appointments">Appointments</NavLink>
                        </li>
                        <li>
                            <NavLink to="/my-pets">My Pets</NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>

                        {role === "SuperAdministrator" && (
                            <>
                                <li>
                                    <NavLink to="/staff-area">Staff Area</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/administration">Administration</NavLink>
                                </li>
                            </>
                        )}

                        {role === "StaffMember" && (
                            <li>
                                <NavLink to="/staff-area">Staff Area</NavLink>
                            </li>
                        )}

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
            </ul>

            <p className="copyright">
                Veteriq @ 2025
            </p>
        </section>
    );
};

export default Footer;