import { NavLink, useLocation } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { useEffect, useRef } from "react";
import { getJwtDecodedData } from "../../utils/getJwtDecodedData";

const Header: React.FC = () => {
    const { isSuccessful } = useUserContext();
    const decodedData = getJwtDecodedData();
    const location = useLocation();
    const checkRef = useRef<HTMLInputElement>(null);
    const headerRef = useRef<HTMLElement>(null);

    const role = decodedData?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const successNavClassName =
        role === "SuperAdministrator"
            ? "navbar-success-superAdministrator"
            : role === "StaffMember"
                ? "navbar-success-staffMember"
                : "navbar-success";


    // Затваря менюто, когато се кликне върху линк
    useEffect(() => {
        if (checkRef.current) {
            checkRef.current.checked = false;
        }
    }, [location.pathname]);

    // Затваря менюто при клик извън хедъра
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
        <header className="header" ref={headerRef}>
            <NavLink to="/" className="logo">
                <img src="/images/veteriq.png" alt="Vetariq" width="60px" />
            </NavLink>

            <input type="checkbox" id="check" ref={checkRef} />
            <label htmlFor="check" className="icons">
                <i className="bx bx-menu" id="menu-icon"></i>
                <i className="bx bx-x" id="close-icon"></i>
            </label>

            {isSuccessful ? (
                <nav className={successNavClassName}>
                    <NavLink to="/" style={{ "--i": "0" } as React.CSSProperties}>Home</NavLink>
                    <NavLink to="/about" style={{ "--i": "1" } as React.CSSProperties}>About</NavLink>
                    <NavLink to="/contact" style={{ "--i": "2" } as React.CSSProperties}>Contact</NavLink>
                    <NavLink to="/services" style={{ "--i": "3" } as React.CSSProperties}>Services</NavLink>
                    <NavLink to="/appointments" style={{ "--i": "4" } as React.CSSProperties}>Appointments</NavLink>
                    <NavLink to="/my-pets" style={{ "--i": "5" } as React.CSSProperties}>My Pets</NavLink>
                    <NavLink to="/profile" style={{ "--i": "6" } as React.CSSProperties}>Profile</NavLink>

                    {role === "SuperAdministrator" && (
                        <>
                            <NavLink to="/staffArea" style={{ "--i": "7" } as React.CSSProperties}>Staff Area</NavLink>
                            <NavLink to="/administration" style={{ "--i": "8" } as React.CSSProperties}>Administration</NavLink>
                            <NavLink to="/logout" style={{ "--i": "9" } as React.CSSProperties}>Logout</NavLink>
                        </>
                    )}

                    {role === "StaffMember" && (
                        <>
                            <NavLink to="/staffArea" style={{ "--i": "7" } as React.CSSProperties}>Staff Area</NavLink>
                            <NavLink to="/logout" style={{ "--i": "8" } as React.CSSProperties}>Logout</NavLink>
                        </>
                    )}

                    {!role && (
                        <NavLink to="/logout" style={{ "--i": "7" } as React.CSSProperties}>Logout</NavLink>
                    )}
                </nav>
            ) : (
                <nav className="navbar">
                    <NavLink to="/" style={{ "--i": "0" } as React.CSSProperties}>Home</NavLink>
                    <NavLink to="/about" style={{ "--i": "1" } as React.CSSProperties}>About</NavLink>
                    <NavLink to="/contact" style={{ "--i": "2" } as React.CSSProperties}>Contact</NavLink>
                    <NavLink to="/services" style={{ "--i": "3" } as React.CSSProperties}>Services</NavLink>
                    <NavLink to="/login" style={{ "--i": "4" } as React.CSSProperties}>Login</NavLink>
                    <NavLink to="/register" style={{ "--i": "5" } as React.CSSProperties}>Register</NavLink>
                </nav>
            )}
        </header>
    );
};

export default Header;
