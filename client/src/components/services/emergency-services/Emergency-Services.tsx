import React from "react";
import { Link } from "react-router";
import styles from "./Emergency-Services.module.css";

const EmergencyServices: React.FC = () => {
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
                        src="/images/emergency-services.png"
                        alt="Veterinarian providing emergency care"
                        className={styles.heroImage}
                    />
                    <div className={styles.titleOverlay}>
                        <h1>Emergency Services</h1>
                    </div>
                </div>

                <div className={styles.contentBody}>
                    <section className={styles.textSection}>
                        <h2>Urgent Care When You Need It Most</h2>
                        <p>
                            Our emergency services are available for sudden,
                            life-threatening situations where your pet needs immediate
                            medical attention. We are equipped to handle trauma,
                            poisoning, seizures, breathing difficulties, and other
                            critical conditions.
                        </p>
                    </section>

                    <section className={styles.textSection}>
                        <h2>Our Emergency Capabilities:</h2>
                        <p>
                            Veteriq’s experienced emergency team works swiftly and
                            compassionately to stabilize and treat pets in crisis. Our
                            facility includes advanced monitoring equipment, in-house
                            diagnostics, and surgical readiness for fast response.
                        </p>
                    </section>

                    <section className={styles.symptomsSection}>
                        <h2>When to Seek Emergency Care?</h2>
                        <ul className={styles.symptomsList}>
                            <li>Difficulty breathing or unconsciousness</li>
                            <li>Heavy bleeding or traumatic injury</li>
                            <li>Severe vomiting or diarrhea</li>
                            <li>Suspected poisoning</li>
                            <li>Sudden behavioral changes or collapse</li>
                        </ul>
                    </section>

                    {/* <div className={styles.actionArea}>
                        <Link to="/appointments/request-appointment" className={styles.primaryBtn}>
                            Book an Emergency Consultation
                        </Link>
                    </div> */}
                </div>
            </article>
        </section>
    );
};

export default EmergencyServices;