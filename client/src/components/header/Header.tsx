import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { getJwtDecodedData } from "../../utils/getJwtDecodedData";
import styles from "./Header.module.css";

const Header: React.FC = () => {
    const { isSuccessful } = useUserContext();
    const decodedData = getJwtDecodedData();
    const location = useLocation();
    const checkRef = useRef<HTMLInputElement>(null);
    const headerRef = useRef<HTMLElement>(null);

    const role = decodedData?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const staffRoles = ["SuperAdministrator", "StaffMember", "Administrator", "Manager"];
    const hasStaffAccess = !!role && staffRoles.includes(role);

    const getNavClassName = () => {
        if (!isSuccessful) return styles.navbar;
        if (role === "SuperAdministrator") return styles.navbarSuccessSuperAdministrator;
        if (role === "StaffMember") return styles.navbarSuccessStaffMember;
        if (role === "Administrator") return styles.navbarSuccessAdministrator;
        if (role === "Manager") return styles.navbarSuccessManager;
        return styles.navbarSuccess;
    };

    const navClassName = getNavClassName();

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

    useEffect(() => {
        if (checkRef.current) {
            checkRef.current.checked = false;
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                checkRef.current &&
                headerRef.current &&
                !headerRef.current.contains(e.target as Node) &&
                checkRef.current.checked
            ) {
                checkRef.current.checked = false;
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <header className={styles.header} ref={headerRef}>
            <NavLink to="/" className={styles.logo}>
                <img src="/images/veteriq.png" alt="Vetariq" width="60px" />
            </NavLink>

            <input type="checkbox" id="check" className={styles.checkbox} ref={checkRef} />
            
            <label htmlFor="check" className={styles.icons}>
                <i className={`bx bx-menu ${styles.menuIcon}`} id="menu-icon"></i>
                <i className={`bx bx-x ${styles.closeIcon}`} id="close-icon"></i>
            </label>

            <nav className={navClassName}>
                {isSuccessful ? (
                    <>
                        <NavLink to="/" className={linkClasses} style={{ "--i": "0" } as React.CSSProperties}>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={linkClasses} style={{ "--i": "1" } as React.CSSProperties}>
                            About
                        </NavLink>
                        <NavLink to="/contact" className={linkClasses} style={{ "--i": "2" } as React.CSSProperties}>
                            Contact
                        </NavLink>
                        <NavLink to="/services" className={linkClasses} style={{ "--i": "3" } as React.CSSProperties}>
                            Services
                        </NavLink>
                        <NavLink to="/appointments" className={linkClasses} style={{ "--i": "4" } as React.CSSProperties}>
                            Appointments
                        </NavLink>
                        <NavLink to="/my-pets" className={linkClasses} style={{ "--i": "5" } as React.CSSProperties}>
                            My Pets
                        </NavLink>
                        <NavLink to="/profile" className={linkClasses} style={{ "--i": "6" } as React.CSSProperties}>
                            Profile
                        </NavLink>

                        {hasStaffAccess && (
                            <NavLink to="/staff-area" className={linkClasses} style={{ "--i": "7" } as React.CSSProperties}>
                                Staff Area
                            </NavLink>
                        )}

                        <NavLink 
                            to="/logout" 
                            className={linkClasses} 
                            style={{ "--i": hasStaffAccess ? "8" : "7" } as React.CSSProperties}
                        >
                            Logout
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/" className={linkClasses} style={{ "--i": "0" } as React.CSSProperties}>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={linkClasses} style={{ "--i": "1" } as React.CSSProperties}>
                            About
                        </NavLink>
                        <NavLink to="/contact" className={linkClasses} style={{ "--i": "2" } as React.CSSProperties}>
                            Contact
                        </NavLink>
                        <NavLink to="/services" className={linkClasses} style={{ "--i": "3" } as React.CSSProperties}>
                            Services
                        </NavLink>
                        <NavLink to="/login" className={linkClasses} style={{ "--i": "4" } as React.CSSProperties}>
                            Login
                        </NavLink>
                        <NavLink to="/register" className={linkClasses} style={{ "--i": "5" } as React.CSSProperties}>
                            Register
                        </NavLink>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;