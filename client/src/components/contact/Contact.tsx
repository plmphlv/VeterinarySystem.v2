import type React from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
    return (
        <section className={styles.container}>
            <article className={styles.card}>
                <header className={styles.cardHeader}>
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-headset"></i>
                    </div>
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.subtitle}>We'd love to hear from you</p>
                </header>

                <div className={styles.content}>
                    <p className={styles.paragraph}>
                        Have questions or need assistance? Don’t hesitate to reach out! The
                        Veteriq team is always here to help — whether you need support, have feedback, or just want to say hello.
                    </p>

                    <div className={styles.contactList}>
                        <div className={styles.contactItem}>
                            <div className={styles.itemIcon}>
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            <div className={styles.itemText}>
                                <span className={styles.label}>Email</span>
                                <span className={styles.value}>support@vetariq.com</span>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.itemIcon}>
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <div className={styles.itemText}>
                                <span className={styles.label}>Phone</span>
                                <span className={styles.value}>+1 (800) 123-4567</span>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.itemIcon}>
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <div className={styles.itemText}>
                                <span className={styles.label}>Address</span>
                                <span className={styles.value}>123 Vet Street, Petville, Animaland</span>
                            </div>
                        </div>
                    </div>

                    <p className={styles.footerText}>
                        Your peace of mind and your pet’s health are our top priorities.
                    </p>
                </div>
            </article>
        </section>
    );
};

export default Contact;