import React, { useEffect } from "react";
import type { DialogProps } from "../../types";
import styles from "./Dialog.module.css";

const Dialog: React.FC<DialogProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const typeClass = type === "success" ? styles.success : styles.error;

    return (
        <div className={`${styles.dialog} ${typeClass}`} onClick={onClose}>
            <span>{message}</span>
        </div>
    );
};

export default Dialog;