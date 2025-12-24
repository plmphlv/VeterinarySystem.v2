import { Link } from "react-router";
import styles from "./Services.module.css";

const Services: React.FC = () => {
    return (
        <>
            <h1 className={styles["services-h1"]}>Our Services:</h1>

            <section className={styles["services"]}>
                <div className={styles["services-item-card"]}>
                    <img src="/images/general-check-up.png" alt="General Check-up" />
                    <div className={styles["content"]}>
                        <h2>General Check-up</h2>
                        <p>
                            Comprehensive physical examination to monitor your pet’s health
                            and detect any early signs of illness.
                        </p>
                        <Link
                            to="/services/general-check-up"
                            className={styles["services-learn-more-btn"]}
                        >
                            → Learn More
                        </Link>
                    </div>
                </div>

                <div className={styles["services-item-card"]}>
                    <img src="/images/vaccinations.png" alt="Vaccinations" />
                    <div className={styles["content"]}>
                        <h2>Vaccinations</h2>
                        <p>
                            Essential immunizations to protect your pet from dangerous diseases
                            and promote long-term wellness.
                        </p>
                        <Link
                            to="/services/vaccinations"
                            className={styles["services-learn-more-btn"]}
                        >
                            → Learn More
                        </Link>
                    </div>
                </div>

                <div className={styles["services-item-card"]}>
                    <img src="/images/surgery.png" alt="Surgery" />
                    <div className={styles["content"]}>
                        <h2>Surgery</h2>
                        <p>
                            Modern surgical procedures including spaying/neutering and emergency
                            interventions with expert care.
                        </p>
                        <Link
                            to="/services/surgery"
                            className={styles["services-learn-more-btn"]}
                        >
                            → Learn More
                        </Link>
                    </div>
                </div>

                <div className={styles["services-item-card"]}>
                    <img src="/images/dental-care.png" alt="Dental Care" />
                    <div className={styles["content"]}>
                        <h2>Dental Care</h2>
                        <p>
                            Professional cleaning, tooth extraction, and oral care to keep your
                            pet’s teeth and gums healthy.
                        </p>
                        <Link
                            to="/services/dental-care"
                            className={styles["services-learn-more-btn"]}
                        >
                            → Learn More
                        </Link>
                    </div>
                </div>

                <div className={styles["services-item-card"]}>
                    <img src="/images/emergency-services.png" alt="Emergency Services" />
                    <div className={styles["content"]}>
                        <h2>Emergency Services</h2>
                        <p>
                            24/7 urgent care for accidents, injuries, or sudden illness to ensure
                            timely treatment and recovery.
                        </p>
                        <Link
                            to="/services/emergency-services"
                            className={styles["services-learn-more-btn"]}
                        >
                            → Learn More
                        </Link>
                    </div>
                </div>

                <div className={styles["services-item-card"]}>
                    <img
                        src="/images/pet-nutrition-counseling.png"
                        alt="Pet Nutrition Counseling"
                    />
                    <div className={styles["content"]}>
                        <h2>Pet Nutrition Counseling</h2>
                        <p>
                            Tailored dietary advice to help your pet maintain optimal weight and
                            receive proper nutrition.
                        </p>
                        <Link
                            to="/services/pet-nutrition-counseling"
                            className={styles["services-learn-more-btn"]}
                        >
                            → Learn More
                        </Link>
                    </div>
                </div>
            </section>

            <Link
                to="/appointments/request-appointment"
                className={styles["services-request-appointment-btn"]}
            >
                Request New Appointment
            </Link>
        </>
    );
};

export default Services;
