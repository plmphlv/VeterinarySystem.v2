import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import type { ChangePasswordRequest } from "../../../types";
import { useChangePassword } from "../../../api/authAPI";
import { useForm } from "../../hooks/useForm";
import Spinner from "../../spinner/Spinner";

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

            setTimeout(() => {
                navigate("/profile");
            }, 1000);
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
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => {
        return () => {
            cancelChangePassword();
        };
    }, []);

    return (
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <div className="profile-card">
                <h1 className="h1-profile">Change Password</h1>
                <form onSubmit={onSubmit} noValidate>
                    {([
                        { name: "currentPassword", label: "Current Password", type: "password", icon: "fa-key", placeholder: "Enter your current password" },
                        { name: "newPassword", label: "New Password", type: "password", icon: "fa-key", placeholder: "Create a new password" },
                        { name: "confirmNewPassword", label: "Confirm New Password", type: "password", icon: "fa-key", placeholder: "Confirm your new password" },
                    ] as const).map(({ name, label, type, icon, placeholder }) => (
                        <div className="field-edit-profile" key={name}>
                            <label htmlFor={name}>
                                <i className={`fa-solid ${icon}`}></i> {label}:
                            </label>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                value={values[name]}
                                onChange={handleChange}
                                className={inputClass(name)}
                                placeholder={placeholder}
                                autoComplete="off"
                            />
                            {errors[name] && <p className="error-text">{errors[name]}</p>}
                        </div>
                    ))}

                    <button className="edit-button" type="submit" disabled={isLoading}>
                        Save
                    </button>

                    <Link to="/profile" className="edit-button">Cancel</Link>

                    {dialog && <div className={`dialog ${dialog.type}`}>{dialog.message}</div>}
                </form>
            </div>
        </>
    );
};

export default ChangePassword;