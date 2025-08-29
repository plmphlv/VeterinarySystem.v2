import { NavLink, useLocation } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { useEffect, useRef } from "react";
import { getJwtDecodedData } from "../../utils/getJwtDecodedData";

const Header: React.FC = () => {
    const { isSuccessful } = useUserContext();

    // TODO: Да направя логиката да се показват страниците според различните роли на потребителите ():
    const decodedData = getJwtDecodedData();
    const location = useLocation();
    const checkRef = useRef<HTMLInputElement>(null);
    const headerRef = useRef<HTMLElement>(null);

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

            <nav className="navbar">
                <NavLink to="/" style={{ "--i": "0" } as React.CSSProperties}>Home</NavLink>
                <NavLink to="/about" style={{ "--i": "1" } as React.CSSProperties}>About</NavLink>
                <NavLink to="/contact" style={{ "--i": "2" } as React.CSSProperties}>Contact</NavLink>
                <NavLink to="/services" style={{ "--i": "3" } as React.CSSProperties}>Services</NavLink>

                {isSuccessful ? (
                    <>
                        <NavLink to="/my-pets" style={{ "--i": "4" } as React.CSSProperties}>My Pets</NavLink>
                        <NavLink to="/profile" style={{ "--i": "5" } as React.CSSProperties}>Profile</NavLink>
                        <NavLink to="/logout" style={{ "--i": "6" } as React.CSSProperties}>Logout</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" style={{ "--i": "4" } as React.CSSProperties}>Login</NavLink>
                        <NavLink to="/register" style={{ "--i": "5" } as React.CSSProperties}>Register</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
