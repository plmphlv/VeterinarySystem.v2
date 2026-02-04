import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import type { ChangePasswordRequest } from "../../../types";
import { useChangePassword } from "../../../api/authAPI";
import { useForm } from "../../../hooks/useForm";
import Spinner from "../../spinner/Spinner";
import styles from "./Change-Password.module.css";
import Dialog from "../../dialog/Dialog";

const initialValues: ChangePasswordRequest = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
};

const ChangePassword: React.FC = () => {
    const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordRequest, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { changePassword, cancelChangePassword } = useChangePassword();
    const navigate = useNavigate();

    const validateField = (
        field: keyof ChangePasswordRequest,
        value: string,
        allValues: ChangePasswordRequest
    ): string | undefined => {
        const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/;

        switch (field) {
            case "currentPassword":
                if (!value.trim()) return "Current password is required.";
                return undefined;
            case "newPassword":
                if (!value.trim()) return "New password is required.";
                if (!passwordRegex.test(value)) return "Password must include uppercase, lowercase, and a number.";
                if (allValues.confirmNewPassword && value !== allValues.confirmNewPassword) {
                    setErrors(prev => ({ ...prev, confirmNewPassword: "Passwords do not match." }));
                } else {
                    setErrors(prev => ({ ...prev, confirmNewPassword: undefined }));
                }
                return undefined;
            case "confirmNewPassword":
                if (!value.trim()) return "Please confirm your new password.";
                if (value !== allValues.newPassword) return "Passwords do not match.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: ChangePasswordRequest) => {
        const fieldErrors: Partial<Record<keyof ChangePasswordRequest, string>> = {};
        (Object.keys(values) as (keyof ChangePasswordRequest)[]).forEach(field => {
            const error = validateField(field, values[field], values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const changePasswordHandler = async (values: ChangePasswordRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            setErrors({});
            await changePassword(values);
            setDialog({ message: "Password changed successfully!", type: "success" });
            setTimeout(() => navigate(`/profile`), 1500);
        } catch (err: any) {
            setDialog({ message: err?.message || "Password change failed.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const { values, changeHandler, onSubmit } = useForm<ChangePasswordRequest>(initialValues, changePasswordHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        changeHandler(e);
        const { name, value } = e.target;
        const fieldName = name as keyof ChangePasswordRequest;
        const errorMsg = validateField(fieldName, value, { ...values, [name]: value });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof ChangePasswordRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => cancelChangePassword, []);

    return (
        <div className={styles.container}>
            {isLoading && (
                <div className={styles.spinnerOverlay}>
                    <Spinner />
                </div>
            )}

            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}

            <article className={styles.card}>
                <header className={styles.cardHeader}>
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <h1 className={styles.title}>Change Password</h1>
                    <p className={styles.subtitle}>Secure your account with a new password</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.contentBody}>
                        <div className={styles.formGroup} key="currentPassword">
                            <label htmlFor="currentPassword">
                                <i className="fa-solid fa-key"></i> Current Password
                            </label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={values.currentPassword}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("currentPassword")}`}
                                placeholder="Current password"
                                autoComplete="off"
                            />
                            {errors.currentPassword && <span className={styles.errorMsg}>{errors.currentPassword}</span>}
                        </div>

                        <div className={styles.formGroup} key="newPassword">
                            <label htmlFor="newPassword">
                                <i className="fa-solid fa-key"></i> New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={values.newPassword}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("newPassword")}`}
                                placeholder="New password"
                                autoComplete="off"
                            />
                            {errors.confirmNewPassword && <span className={styles.errorMsg}>{errors.confirmNewPassword}</span>}
                        </div>

                        <div className={styles.formGroup} key="confirmNewPassword">
                            <label htmlFor="confirmNewPassword">
                                <i className="fa-solid fa-check-double"></i> Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={values.confirmNewPassword}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("confirmNewPassword")}`}
                                placeholder="Confirm new password"
                                autoComplete="off"
                            />
                            {errors.confirmNewPassword && <span className={styles.errorMsg}>{errors.confirmNewPassword}</span>}
                        </div>
                    </div>

                    <div className={styles.actionGroup}>
                        <button className={styles.saveBtn} type="submit" disabled={isLoading}>
                            <i className="fa-solid fa-check"></i> Save
                        </button>
                        <Link to="/profile" className={styles.cancelBtn}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </article>
        </div >
    );
};

export default ChangePassword;