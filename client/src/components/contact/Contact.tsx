import type React from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
    return (
        <section className={styles["contact"]}>
            <div className={styles["contact-container"]}>
                <h2>Contact us:</h2>

                <p className={styles["contact-paragraph"]}>
                    Have questions or need assistance? Don’t hesitate to reach out! The
                    Veteriq team is always here to help
                    — whether you need support, have feedback, or just want to say hello.
                </p>

                <p className={styles["contact-paragraph"]}>
                    Your peace of mind and your pet’s health are our top priorities. Contact us anytime —
                    we’re just a message away.
                </p>

                <div className={styles["contact-info"]}>
                    <p><strong>Email:</strong> support@vetariq.com</p>
                    <p><strong>Phone:</strong> +1 (800) 123-4567</p>
                    <p><strong>Address:</strong> 123 Vet Street, Petville, Animaland</p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
