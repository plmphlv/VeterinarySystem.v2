import type React from "react";
import { Link } from "react-router";
import styles from "./Error.module.css";

const Error: React.FC = () => {
    return (
        <section className={styles.container}>
            <article className={styles.card}>
                <div className={styles.iconCircle}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.errorMessage}>Oops! Page Not Found</h2>
                
                <p className={styles.description}>
                    It seems you're a bit lost in the paw-sitive world of Veteriq.
                    Let’s guide you back to a healthier, happier pet journey.
                </p>

                <Link to="/" className={styles.primaryBtn}>
                    <i className="fa-solid fa-house"></i> Back to Home
                </Link>
            </article>
        </section>
    );
};

export default Error;