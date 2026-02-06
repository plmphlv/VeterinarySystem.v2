import React from "react";
import { Link } from "react-router";
import styles from "./General-Check-up.module.css";

const GeneralCheckup: React.FC = () => {
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
                        src="/images/general-check-up.png"
                        alt="Veterinarian examining a dog"
                        className={styles.heroImage}
                    />
                    <div className={styles.titleOverlay}>
                        <h1>General Check-up</h1>
                    </div>
                </div>

                <div className={styles.contentBody}>
                    <section className={styles.textSection}>
                        <h2>What is a General Check-up?</h2>
                        <p>
                            A General Check-up is a routine health examination for your
                            pet to ensure they are happy, healthy, and thriving. It
                            allows our veterinarians to assess overall wellness,
                            identify potential health issues early, and provide guidance
                            on care, nutrition, and preventative treatment.
                        </p>
                    </section>

                    <section className={styles.textSection}>
                        <h2>What to Expect During the Visit:</h2>
                        <p>
                            During the check-up, we examine your pet’s vital signs,
                            skin, coat, eyes, ears, mouth, heart, lungs, joints, and
                            abdomen. We also check for parasites and may recommend
                            routine tests such as bloodwork or urinalysis depending on
                            your pet's age and history.
                        </p>
                    </section>

                    <section className={styles.benefitsSection}>
                        <h2>Benefits of Regular Check-ups:</h2>
                        <ul className={styles.benefitsList}>
                            <li>Early detection of health problems</li>
                            <li>Preventative care recommendations</li>
                            <li>Improved long-term health and quality of life</li>
                            <li>Personalized advice for nutrition and behavior</li>
                        </ul>
                    </section>

                    {/* <div className={styles.actionArea}>
                        <Link to="/appointments/request-appointment" className={styles.primaryBtn}>
                            Book a Check-up
                        </Link>
                    </div> */}
                </div>
            </article>
        </section>
    );
};

export default GeneralCheckup;