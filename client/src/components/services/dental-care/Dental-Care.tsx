import type React from "react";
import { Link } from "react-router";
import styles from "./Dental-Care.module.css";

const DentalCare: React.FC = () => {
    return (
        <>
            <div className={styles["service"]}>
                <div className={styles["service-content"]}>
                    <h1 className={styles["service-h1"]}>Dental Care</h1>

                    <img src="/images/dental-care.png" alt="Dental Care" />

                    <h2>Comprehensive Dental Services</h2>
                    <p>
                        Good oral health is vital for your pet's overall well-being. We provide
                        professional dental cleanings, examinations, and treatments to ensure
                        your pet’s mouth stays healthy.
                    </p>

                    <h2>What We Provide</h2>
                    <p>
                        Our dental services include ultrasonic cleaning, polishing, tooth
                        extractions, and digital dental X-rays for thorough diagnosis and care.
                    </p>

                    <h2>Why Dental Care Matters</h2>
                    <ul>
                        <li>Prevents gum disease and tooth loss;</li>
                        <li>Eliminates bad breath and oral infections;</li>
                        <li>Improves quality of life and longevity.</li>
                    </ul>

                    <Link to="/services" className={styles["back-link"]}>
                        ← Back to Services
                    </Link>
                </div>
            </div>
        </>
    );
};

export default DentalCare;
