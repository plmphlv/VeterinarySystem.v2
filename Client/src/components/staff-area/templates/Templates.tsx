import React from "react";
import { Link } from "react-router";
import styles from "./Templates.module.css";
import TemplatesItem from "./templates-item/Templates-Item";

const Templates: React.FC = () => {

    return (
        <section className={styles.container}>
            <div className={styles.navWrapper}>
                <Link to="/staff-area" className={styles.backLink}>
                    &larr; Back to Staff Area
                </Link>
            </div>

            <header className={styles.header}>
                <h1 className={styles.title}>System Templates</h1>
                <p className={styles.subtitle}>Manage document and email templates</p>
            </header>

            <div className={styles.contentWrapper}>
                <TemplatesItem />
            </div>

            <div className={styles.ctaWrapper}>
                <Link
                    to="/staff-area/templates/create"
                    className={styles.addBtn}
                >
                    <i className="fa-solid fa-plus"></i> Create a Template
                </Link>
            </div>

        </section>
    );
};

export default Templates;