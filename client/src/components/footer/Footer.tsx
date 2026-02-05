import type React from "react";
import { NavLink, Link } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { getJwtDecodedData } from "../../utils/getJwtDecodedData";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
    const { isSuccessful } = useUserContext();
    const decodedData = getJwtDecodedData();

    const role = decodedData?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Helper за класовете на линковете
    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.footerLink} ${styles.active}` : styles.footerLink;

    return (
        <section className={styles.footer}>
            <div className={styles.socials}>
                {/* Social links usually don't need NavLink active state, so Link is fine */}
                <Link to="#" className={styles.socialLink}><i className="fa-brands fa-facebook-f"></i></Link>
                <Link to="#" className={styles.socialLink}><i className="fa-brands fa-instagram"></i></Link>
                <Link to="#" className={styles.socialLink}><i className="fa-brands fa-linkedin"></i></Link>
                <Link to="#" className={styles.socialLink}><i className="fa-brands fa-youtube"></i></Link>
            </div>

            <ul className={styles.list}>
                <li>
                    <NavLink to="/" className={linkClasses}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={linkClasses}>About</NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className={linkClasses}>Contact</NavLink>
                </li>
                <li>
                    <NavLink to="/services" className={linkClasses}>Services</NavLink>
                </li>

                {isSuccessful ? (
                    <>
                        <li>
                            <NavLink to="/appointments" className={linkClasses}>Appointments</NavLink>
                        </li>
                        <li>
                            <NavLink to="/my-pets" className={linkClasses}>My Pets</NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" className={linkClasses}>Profile</NavLink>
                        </li>

                        {role === "SuperAdministrator" && (
                            <>
                                <li>
                                    <NavLink to="/staff-area" className={linkClasses}>Staff Area</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/administration" className={linkClasses}>Administration</NavLink>
                                </li>
                            </>
                        )}

                        {role === "StaffMember" && (
                            <li>
                                <NavLink to="/staff-area" className={linkClasses}>Staff Area</NavLink>
                            </li>
                        )}

                        <li>
                            <NavLink to="/logout" className={linkClasses}>Logout</NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/login" className={linkClasses}>Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/register" className={linkClasses}>Register</NavLink>
                        </li>
                    </>
                )}
            </ul>

            <p className={styles.copyright}>
                Veteriq @ 2025
            </p>
        </section>
    );
};

export default Footer;