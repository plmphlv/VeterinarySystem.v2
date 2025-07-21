import React, { useEffect } from "react";
import type { DialogProps } from "../../types";

const Dialog: React.FC<DialogProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`dialog ${type}`} onClick={onClose} style={{ cursor: "pointer" }}>
            <span>{message}</span>
        </div>
    );
};

export default Dialog;