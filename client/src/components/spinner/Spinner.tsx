import type React from "react";
import styles from "./Spinner.module.css";

const Spinner: React.FC = () => {
    return (
        <div className={styles.spinner}>
            <span className={styles.hiddenText}>Loading...</span>
        </div>
    );
}

export default Spinner;