import { Link } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { useGetUserData } from "../hooks/useGetUserData";

const Header: React.FC = () => {
    const { isSuccessful } = useUserContext();
    const { userData } = useGetUserData();

    return (
        <header className="header">
            <Link to="/" className="logo">
                <img src="/images/veteriq.png" alt="Vetariq" width="60px" />
            </Link>

            <input type="checkbox" id="check" />
            <label htmlFor="check" className="icons">
                <i className="bx bx-menu" id="menu-icon"></i>
                <i className="bx bx-x" id="close-icon"></i>
            </label>

            <nav className="navbar">
                <Link to="/" style={{ "--i": "0" } as React.CSSProperties}>Home</Link>
                <Link to="/about" style={{ "--i": "1" } as React.CSSProperties}>About</Link>
                <Link to="/contact" style={{ "--i": "2" } as React.CSSProperties}>Contact</Link>
                <Link to="/services" style={{ "--i": "3" } as React.CSSProperties}>Services</Link>

                {isSuccessful ? (
                    <>
                        <Link to="/mypets" style={{ "--i": "4" } as React.CSSProperties}>My Pets</Link>
                        <Link to="/profile" style={{ "--i": "5" } as React.CSSProperties}>Profile</Link>
                        <Link to="/logout" style={{ "--i": "6" } as React.CSSProperties}>Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ "--i": "4" } as React.CSSProperties}>Login</Link>
                        <Link to="/register" style={{ "--i": "5" } as React.CSSProperties}>Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;