import React from "react";
import { Link } from "react-router";
import styles from "./Vaccinations.module.css";

const Vaccinations: React.FC = () => {
    return (
        <section className={styles.pageContainer}>
            <div className={styles.navigationWrapper}>
                <Link to="/services" className={styles.backLink}>
                    &larr; Back to Services
                </Link>
            </div>

            <article className={styles.card}>
                <div className={styles.imageHeader}>
                    <img
                        src="/images/vaccinations.png"
                        alt="Veterinarian vaccinating a dog"
                        className={styles.heroImage}
                    />
                    <div className={styles.titleOverlay}>
                        <h1>Vaccinations</h1>
                    </div>
                </div>

                <div className={styles.contentBody}>
                    <section className={styles.textSection}>
                        <h2>Why Vaccinate Your Pet?</h2>
                        <p>
                            Vaccinations are a crucial part of preventive healthcare.
                            They help protect your pet from serious and potentially
                            fatal diseases, such as rabies, parvovirus, and distemper.
                        </p>
                    </section>

                    <section className={styles.textSection}>
                        <h2>What We Offer?</h2>
                        <p>
                            We provide a full schedule of core and non-core vaccinations
                            tailored to your pet's age, lifestyle, and risk exposure. Our
                            team ensures each shot is safely administered and recorded
                            for future needs.
                        </p>
                    </section>

                    <section className={styles.benefitsSection}>
                        <h2>Benefits of Regular Vaccinations:</h2>
                        <ul className={styles.benefitsList}>
                            <li>Protection against common infectious diseases</li>
                            <li>Compliance with legal requirements (e.g. rabies)</li>
                            <li>Long-term cost savings by preventing illness</li>
                            <li>Safe environment for other pets and family members</li>
                        </ul>
                    </section>

                    <div className={styles.actionArea}>
                        <Link to="/appointments/request-appointment" className={styles.primaryBtn}>
                            Book a Vaccination
                        </Link>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default Vaccinations;