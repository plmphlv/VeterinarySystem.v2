import React from "react";
import { Link } from "react-router";
import styles from "./Dental-Care.module.css";

const DentalCare: React.FC = () => {
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
                        src="/images/dental-care.png"
                        alt="Veterinarian examining a dog's teeth"
                        className={styles.heroImage}
                    />
                    <div className={styles.titleOverlay}>
                        <h1>Dental Care</h1>
                    </div>
                </div>

                <div className={styles.contentBody}>
                    <section className={styles.textSection}>
                        <h2>Comprehensive Dental Services</h2>
                        <p>
                            Good oral health is vital for your pet's overall well-being. We provide
                            professional dental cleanings, examinations, and treatments to ensure
                            your pet’s mouth stays healthy.
                        </p>
                    </section>

                    <section className={styles.textSection}>
                        <h2>What We Provide?</h2>
                        <p>
                            Our dental services include ultrasonic cleaning, polishing, tooth
                            extractions, and digital dental X-rays for thorough diagnosis and care.
                        </p>
                    </section>

                    <section className={styles.benefitsSection}>
                        <h2>Why Dental Care Matters?</h2>
                        <ul className={styles.benefitsList}>
                            <li>Prevents gum disease and tooth loss</li>
                            <li>Eliminates bad breath and oral infections</li>
                            <li>Improves quality of life and longevity</li>
                            <li>Reduces risk of heart, liver, and kidney disease</li>
                        </ul>
                    </section>
{/* 
                    <div className={styles.actionArea}>
                        <Link to="/appointments/request-appointment" className={styles.primaryBtn}>
                            Book a Dental Appointment
                        </Link>
                    </div> */}
                </div>
            </article>
        </section>
    );
};

export default DentalCare;