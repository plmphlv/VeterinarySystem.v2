import type React from "react";
import Spinner from "../../spinner/Spinner";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { useEffect, useState } from "react";
import type { EditProfileRequest } from "../../../types";
import { useForm } from "../../../hooks/useForm";
import { useEditProfile } from "../../../api/authAPI";
import { Link, useNavigate } from "react-router";
import styles from "./Edit-Profile.module.css";
import Dialog from "../../dialog/Dialog";

const initialValues: EditProfileRequest = {
    id: "",
    firstName: "",
    lastName: "",
    address: null,
    phoneNumber: "",
};

const EditProfile: React.FC = () => {
    const [errors, setErrors] = useState<Partial<Record<keyof EditProfileRequest, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: isUserLoading, error } = useGetUserData();
    const { editProfile, cancelEditProfile } = useEditProfile();
    const navigate = useNavigate();

    const validateField = (
        field: keyof EditProfileRequest,
        value: string,
        allValues: EditProfileRequest
    ): string | undefined => {
        const phoneRegex = /^(?:\+\d(?: ?\d){11}|\d(?: ?\d){9})$/;

        switch (field) {
            case "firstName":
                if (!value.trim()) return "First name is required.";
                if (value.length < 2) return "First name must be at least 2 characters.";
                return undefined;
            case "lastName":
                if (!value.trim()) return "Last name is required.";
                if (value.length < 2) return "Last name must be at least 2 characters.";
                return undefined;
            case "phoneNumber":
                if (!value.trim()) return "Phone number is required.";
                if (!phoneRegex.test(value)) return "Phone number must be between 10 and 16 digits.";
                return undefined;
            case "address":
                if (value?.length > 0 && value?.length < 2) return "Address must be at least 2 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: EditProfileRequest): Partial<Record<keyof EditProfileRequest, string>> => {
        const fieldErrors: Partial<Record<keyof EditProfileRequest, string>> = {};
        (Object.keys(values) as (keyof EditProfileRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const editProfileHandler = async (values: EditProfileRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            setErrors({});
            if (!userData) {
                return setDialog({ message: "No user data found.", type: "error" });
            }

            const payload: EditProfileRequest = {
                ...values,
                id: userData.id,
                address: values.address?.trim() === "" ? null : values.address
            };

            await editProfile(payload);
            setDialog({ message: "Profile edit is successful!", type: "success" });
        } catch (err: any) {
            setDialog({ message: err.detail || "Edit failed.", type: "error" });
        } finally {
            setIsLoading(false);
            setTimeout(() => navigate(`/profile`), 1500);
        }
    };

    const { values, changeValues, onSubmit } = useForm(initialValues, editProfileHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof EditProfileRequest;
        changeValues({ ...values, [fieldName]: value });

        const errorMsg = validateField(fieldName, value ?? "", { ...values, [fieldName]: value });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof EditProfileRequest) => {
        if (errors[field]) return styles.error;
        if (values[field] && !errors[field]) return styles.success;
        return "";
    };

    useEffect(() => cancelEditProfile, []);

    useEffect(() => {
        if (userData) {
            changeValues({
                id: userData.id,
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                phoneNumber: userData.phoneNumber || "",
                address: userData.address || "",
            });
        }
    }, [userData]);

    return (
        <>
            {(isLoading || isUserLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <h1 className={styles["edit-profile-h1"]}>Edit Profile</h1>

            {userData ? (
                <div className={styles["edit-profile-container"]}>
                    <div className={styles["edit-profile-card"]}>
                        <form onSubmit={onSubmit} noValidate>
                            {([
                                { name: "firstName", label: "First Name", type: "text", icon: "fa-pen", placeholder: "Enter your first name" },
                                { name: "lastName", label: "Last Name", type: "text", icon: "fa-pen", placeholder: "Enter your last name" },
                                { name: "phoneNumber", label: "Phone Number", type: "tel", icon: "fa-phone", placeholder: "Enter your phone number" },
                                { name: "address", label: "Address (Optional)", type: "text", icon: "fa-map-marker-alt", placeholder: "Enter your address" },
                            ] as const).map(({ name, label, type, icon, placeholder }) => (
                                <div className={styles["edit-profile-field"]} key={name}>
                                    <label htmlFor={name}>
                                        <i className={`fa-solid ${icon}`}></i> {label}:
                                    </label>
                                    <input
                                        type={type}
                                        id={name}
                                        name={name}
                                        value={values[name] ?? ""}
                                        onChange={handleChange}
                                        className={inputClass(name)}
                                        placeholder={placeholder}
                                        autoComplete="off"
                                        required={name !== "address"}
                                    />
                                    {errors[name] && <p className={styles["error-text"]}>{errors[name]}</p>}
                                </div>
                            ))}

                            <div className={styles["edit-profile-btns"]}>
                                <button className={styles["edit-profile-save-edit-btn"]} type="submit" disabled={isLoading}>Save</button>
                                <Link to="/profile" className={styles["edit-profile-cancel-edit-btn"]}>Cancel</Link>
                            </div>

                            {dialog && (
                                <Dialog
                                    message={dialog.message}
                                    type={dialog.type}
                                    onClose={() => setDialog(null)}
                                />
                            )}
                        </form>
                    </div>
                </div>
            ) : !isLoading && !error ? (
                <p className={styles["edit-profile-no-user-data"]}>No user data found.</p>
            ) : null}
        </>
    );
};

export default EditProfile;