import type React from "react";
import styles from "./Error.module.css";

const Error: React.FC = () => {
    return (
        <section className={styles["error-section"]}>
            <div className={styles["error-container"]}>
                <div className={styles["error-content"]}>
                    <h1 className={styles["error-code"]}>404</h1>
                    <h2 className={styles["error-message"]}>Oops! Page Not Found</h2>
                    <p className={styles["error-description"]}>
                        It seems you're a bit lost in the paw-sitive world of Veteriq.<br />
                        Let’s guide you back to a healthier, happier pet journey.
                    </p>
                    <a href="/" className={styles["error-button"]}>← Back to Home</a>
                </div>
            </div>
        </section>
    );
};

export default Error;