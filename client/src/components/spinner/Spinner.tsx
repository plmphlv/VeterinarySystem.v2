import type React from "react";
import styles from "./Spinner.module.css";

const Spinner: React.FC = () => {
    return (
        <div className={styles.loading}>Loading&#8230;</div>
    );
}

export default Spinner;