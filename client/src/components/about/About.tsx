import React from "react";
import styles from "./About.module.css";

const About: React.FC = () => {
    return (
        <section className={styles.container}>
            <article className={styles.card}>
                <header className={styles.cardHeader}>
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-circle-info"></i>
                    </div>
                    <h1 className={styles.title}>About Vetariq</h1>
                    <p className={styles.subtitle}>Your clinic's digital partner</p>
                </header>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <i className="fa-solid fa-star"></i> Why Choose Veteriq?
                        </h2>
                        <p className={styles.paragraph}>
                            What sets Vetariq apart is its deep understanding of both veterinary needs and user experience. With a
                            sleek design, secure infrastructure, and a heart for animals, Vetariq isn’t just software — it's your clinic's digital partner.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <i className="fa-solid fa-laptop-medical"></i> About Vetariq
                        </h2>
                        <p className={styles.paragraph}>
                            Vetariq is a modern web application designed specifically for veterinary clinics that want to digitize their services and improve communication with clients.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            <i className="fa-solid fa-users"></i> About the Creators
                        </h2>
                        <p className={styles.paragraph}>
                            The team behind Vetariq consists of passionate developers and animal lovers united by a common goal — to make veterinary care more accessible and efficient through innovation. Our love for our four-legged friends inspires us to create solutions that help them live better and healthier lives.
                        </p>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default About;