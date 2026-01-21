import type React from "react";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { Link, useNavigate } from "react-router";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Owner-Accounts-Create.module.css";
import type { CreateOwnerAccountDetailsRequestErrors, CreateOwnerAccountRequest } from "../../../../types";
import { useCreateOwnerAccount } from "../../../../api/ownerAccountsAPI";

const initialValues: CreateOwnerAccountRequest = {
    firstName: "",
    lastName: "",
    address: null,
    phoneNumber: ""
};

const OwnerAccountsCreate: React.FC = () => {
    const [errors, setErrors] = useState<CreateOwnerAccountDetailsRequestErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { createOwnerAccount, cancelCreateOwnerAccount } = useCreateOwnerAccount();
    const navigate = useNavigate();

    const validateField = (
        field: keyof CreateOwnerAccountRequest,
        value: string,
        allValues: CreateOwnerAccountRequest
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
    }

    const validate = (values: CreateOwnerAccountRequest): CreateOwnerAccountDetailsRequestErrors => {
        const fieldErrors: CreateOwnerAccountDetailsRequestErrors = {};
        (Object.keys(values) as (keyof CreateOwnerAccountRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const createOwnerAccountHandler = async (values: CreateOwnerAccountRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            setErrors({});
            if (!userData) return;

            const payload: CreateOwnerAccountRequest = {
                ...values,
                address: values.address?.trim() === "" ? null : values.address
            };

            await createOwnerAccount(payload);

            setDialog({ message: "Owner account created successfully!", type: "success" });
        } catch {
            setDialog({ message: "Failed creating owner account.", type: "error" });
        } finally {
            setFormLoading(false);
            setTimeout(() => navigate(`/staff-area/owner-accounts`), 1500);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, createOwnerAccountHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof CreateOwnerAccountRequest;

        let parsedValue: string | number | null = value;

        changeValues({ ...values, [fieldName]: parsedValue });

        const valueForValidation = parsedValue ?? "";
        const errorMsg = validateField(fieldName, valueForValidation, { ...values, [fieldName]: parsedValue });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof CreateOwnerAccountRequest) => {
        if (errors[field]) return `${styles.input} ${styles.error}`;
        if (values[field] && !errors[field]) return `${styles.input} ${styles.success}`;
        return styles.input;
    };


    useEffect(() => {
        return () => cancelCreateOwnerAccount();
    }, []);

    return (
        <>
            {(formLoading || userLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["owner-accounts-create"]}>
                <div className={styles["owner-accounts-create-container"]}>
                    <h2>Create Owner Account</h2>

                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles["owner-accounts-create-form-group"]}>
                            <label htmlFor="firstName">
                                <i className="fa-solid fa-pen"></i> First Name:
                            </label>

                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={values.firstName ?? ""}
                                onChange={handleChange}
                                className={inputClass("firstName")}
                                placeholder="Enter first name"
                                autoComplete="off"
                                required
                            />

                            {errors.firstName && (
                                <p className={styles["error-text"]}>{errors.firstName}</p>
                            )}
                        </div>

                        <div className={styles["owner-accounts-create-form-group"]}>
                            <label htmlFor="lastName">
                                <i className="fa-solid fa-pen"></i> Last Name:
                            </label>

                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={values.lastName ?? ""}
                                onChange={handleChange}
                                className={inputClass("lastName")}
                                placeholder="Enter last name"
                                autoComplete="off"
                                required
                            />

                            {errors.lastName && (
                                <p className={styles["error-text"]}>{errors.lastName}</p>
                            )}
                        </div>

                        <div className={styles["owner-accounts-create-form-group"]}>
                            <label htmlFor="phoneNumber">
                                <i className="fa-solid fa-pen"></i> Phone Number:
                            </label>

                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={values.phoneNumber ?? ""}
                                onChange={handleChange}
                                className={inputClass("phoneNumber")}
                                placeholder="Enter phone number"
                                autoComplete="off"
                                required
                            />

                            {errors.phoneNumber && (
                                <p className={styles["error-text"]}>{errors.phoneNumber}</p>
                            )}
                        </div>

                        <div className={styles["owner-accounts-create-form-group"]}>
                            <label htmlFor="address">
                                <i className="fa-solid fa-pen"></i> Address (Optional):
                            </label>

                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={values.address ?? ""}
                                onChange={handleChange}
                                className={inputClass("address")}
                                placeholder="Enter address"
                                autoComplete="off"
                                required
                            />

                            {errors.address && (
                                <p className={styles["error-text"]}>{errors.address}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles["owner-accounts-create-btn-small"]}
                            disabled={formLoading}
                        >
                            Create
                        </button>

                        <Link
                            to="/staff-area/owner-accounts"
                            className={styles["owner-accounts-cancel-btn"]}
                        >
                            Cancel
                        </Link>
                    </form>
                </div>

                {dialog && (
                    <Dialog
                        message={dialog.message}
                        type={dialog.type}
                        onClose={() => setDialog(null)}
                    />
                )}
            </section>
        </>
    );
};

export default OwnerAccountsCreate;