import React from "react";
import { Link } from "react-router";
import styles from "./Surgery.module.css";

const Surgery: React.FC = () => {
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
                        src="/images/surgery.png"
                        alt="Veterinary surgery procedure"
                        className={styles.heroImage}
                    />
                    <div className={styles.titleOverlay}>
                        <h1>Surgery</h1>
                    </div>
                </div>

                <div className={styles.contentBody}>
                    <section className={styles.textSection}>
                        <h2>Expert Veterinary Surgery</h2>
                        <p>
                            Our state-of-the-art surgical suite allows us to perform a
                            wide range of soft tissue and orthopedic procedures with
                            safety and compassion.
                        </p>
                    </section>

                    <section className={styles.textSection}>
                        <h2>Common Surgical Services</h2>
                        <p>
                            We offer spaying and neutering, tumor removal, wound repair,
                            and emergency surgeries. Each procedure is carefully planned
                            and executed by experienced veterinary surgeons.
                        </p>
                    </section>

                    <section className={styles.expectationsSection}>
                        <h2>What You Can Expect?</h2>
                        <ul className={styles.expectationsList}>
                            <li>Pre-operative exams and bloodwork</li>
                            <li>Safe anesthesia and pain management</li>
                            <li>Detailed post-op instructions and support</li>
                            <li>Continuous monitoring during recovery</li>
                        </ul>
                    </section>

                    <div className={styles.actionArea}>
                        <Link to="/appointments/request-appointment" className={styles.primaryBtn}>
                            Book a Surgery Consultation
                        </Link>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default Surgery;