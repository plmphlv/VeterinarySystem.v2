import React from "react";
import { Link } from "react-router";
import styles from "./Pet-Nutrition-Counseling.module.css";

const PetNutritionCounseling: React.FC = () => {
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
                        src="/images/pet-nutrition-counseling.png"
                        alt="Veterinarian advising on pet nutrition"
                        className={styles.heroImage}
                    />
                    <div className={styles.titleOverlay}>
                        <h1>Pet Nutrition Counseling</h1>
                    </div>
                </div>

                <div className={styles.contentBody}>
                    <section className={styles.textSection}>
                        <h2>Personalized Nutrition for Your Pet</h2>
                        <p>
                            Proper nutrition is the foundation of your pet’s health.
                            Our nutrition counseling services help you choose the right
                            diet to support your pet’s age, weight, activity level,
                            and medical conditions.
                        </p>
                    </section>

                    <section className={styles.textSection}>
                        <h2>What We Offer?</h2>
                        <p>
                            We provide guidance on commercial pet foods, homemade
                            diets, supplements, and special dietary plans for pets
                            with diabetes, kidney disease, allergies, and obesity.
                            Our veterinarians work closely with you to ensure your
                            pet’s nutritional needs are fully met.
                        </p>
                    </section>

                    <section className={styles.benefitsSection}>
                        <h2>Benefits of Nutrition Counseling:</h2>
                        <ul className={styles.benefitsList}>
                            <li>Improved energy levels and coat quality</li>
                            <li>Better weight management</li>
                            <li>Support for chronic health conditions</li>
                            <li>Tailored plans for different life stages</li>
                        </ul>
                    </section>

                    <div className={styles.actionArea}>
                        <Link to="/appointments/request-appointment" className={styles.primaryBtn}>
                            Book a Nutrition Counseling Session
                        </Link>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default PetNutritionCounseling;