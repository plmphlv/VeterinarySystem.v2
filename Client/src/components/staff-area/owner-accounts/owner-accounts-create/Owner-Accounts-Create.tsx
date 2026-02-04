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
            setTimeout(() => navigate(`/staff-area/owner-accounts`), 1500);
        } catch {
            setDialog({ message: "Failed creating owner account.", type: "error" });
        } finally {
            setFormLoading(false);
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
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };


    useEffect(() => {
        return () => cancelCreateOwnerAccount();
    }, []);

    return (
        <div className={styles.pageContainer}>
            {(formLoading || userLoading) && (
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
                    <h1>Create an Owner Account</h1>
                    <p>Register a new pet owner in the system</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">First Name</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={values.firstName ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("firstName")}`}
                                    placeholder="First Name"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="lastName">Last Name</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={values.lastName ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("lastName")}`}
                                    placeholder="Last Name"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-phone ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={values.phoneNumber ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("phoneNumber")}`}
                                placeholder="Enter phone number"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.phoneNumber && <span className={styles.errorMsg}>{errors.phoneNumber}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address">Address (Optional)</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-map-marker-alt ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={values.address ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("address")}`}
                                placeholder="Enter address"
                                autoComplete="off"
                            />
                        </div>
                        {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={formLoading}
                        >
                            <i className="fa-solid fa-plus"></i> Create
                        </button>

                        <Link
                            to="/staff-area/owner-accounts"
                            className={styles.cancelBtn}
                        >
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </article>
        </div>
    );
};

export default OwnerAccountsCreate;