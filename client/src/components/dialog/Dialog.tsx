import React, { useEffect } from "react";
import type { DialogProps } from "../../types";
import styles from "./Dialog.module.css";

const Dialog: React.FC<DialogProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const typeClass = type === "success" ? styles.success : styles.error;
    const iconClass = type === "success" ? "fa-circle-check" : "fa-circle-exclamation";

    return (
        <div className={`${styles.dialog} ${typeClass}`} onClick={onClose}>
            <div className={styles.iconWrapper}>
                <i className={`fa-solid ${iconClass}`}></i>
            </div>
            <p className={styles.message}>{message}</p>
        </div>
    );
};

export default Dialog;