import type React from "react";
import { useEffect, useState } from "react";
import type { CreatePrescriptionErrors, CreatePrescriptionRequest } from "../../../../types";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { Link, useNavigate } from "react-router";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Prescriptions-Create.module.css";
import { useCreatePrescription } from "../../../../api/prescriptionsAPI";

const initialValues: CreatePrescriptionRequest = {
    animalId: null,
    description: ""
};

const PrescriptionsCreate: React.FC = () => {
    const [errors, setErrors] = useState<CreatePrescriptionErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { createPrescription, cancelCreatePrescription } = useCreatePrescription();
    const navigate = useNavigate();

    const validateField = (
        field: keyof CreatePrescriptionRequest,
        value: string | number,
        allValues: CreatePrescriptionRequest
    ): string | undefined => {
        switch (field) {
            case "animalId":
                if (value !== "" && value !== null && value !== undefined) {
                    const num = Number(value);
                    if (isNaN(num)) return "Animal ID must be a number.";
                    if (num <= 0) return "Animal ID must be greater than 0.";
                }
                return undefined;
            case "description":
                if (!String(value).trim()) return "Description is required.";
                if (String(value).trim().length < 2) return "Description must be at least 2 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: CreatePrescriptionRequest): CreatePrescriptionErrors => {
        const fieldErrors: CreatePrescriptionErrors = {};
        (Object.keys(values) as (keyof CreatePrescriptionRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const createPrescriptionHandler = async (values: CreatePrescriptionRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            setErrors({});
            if (!userData) return;

            const payload: CreatePrescriptionRequest = {
                ...values,
                animalId: values.animalId ?? null,  
            };

            await createPrescription(payload);

            setDialog({ message: "Prescription created successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/prescriptions`), 1500);
        } catch {
            setDialog({ message: "Failed creating prescription.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, createPrescriptionHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target;
            const fieldName = name as keyof CreatePrescriptionRequest;
    
            let parsedValue: string | number | null = value;
            if (type === "number") parsedValue = value === "" ? null : Number(value);
            else if (fieldName === "animalId") parsedValue = value === "" ? null : Number(value);
    
            changeValues({ ...values, [fieldName]: parsedValue });
    
            const errorMsg = validateField(fieldName, parsedValue ?? "", { ...values, [fieldName]: parsedValue });
            setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
        };

    const inputClass = (field: keyof CreatePrescriptionRequest) => {
        if (errors[field]) return `${styles.input} ${styles.error}`;
        if (values[field] && !errors[field]) return `${styles.input} ${styles.success}`;
        return styles.input;
    };

    useEffect(() => {
        return () => cancelCreatePrescription();
    }, []);

    return (
        <>
            {(formLoading || userLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["prescriptions-create"]}>
                <div className={styles["prescriptions-create-container"]}>
                    <h2>Create Prescription</h2>

                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles["prescriptions-create-form-group"]}>
                            <label htmlFor="animalId">
                                <i className="fa-solid fa-pen"></i> Animal ID:
                            </label>

                            <input
                                type="number"
                                id="animalId"
                                name="animalId"
                                value={values.animalId ?? ""}
                                onChange={handleChange}
                                className={inputClass("animalId")}
                                placeholder="Enter animal ID"
                                autoComplete="off"
                                required
                            />

                            {errors.animalId && (
                                <p className={styles["error-text"]}>{errors.animalId}</p>
                            )}
                        </div>

                        <div className={styles["prescriptions-create-form-group"]}>
                            <label htmlFor="description">
                                <i className="fa-solid fa-pen"></i> Description:
                            </label>

                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={values.description ?? ""}
                                onChange={handleChange}
                                className={inputClass("description")}
                                placeholder="Enter description"
                                autoComplete="off"
                                required
                            />

                            {errors.description && (
                                <p className={styles["error-text"]}>{errors.description}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles["prescriptions-create-btn-small"]}
                            disabled={formLoading}
                        >
                            Create
                        </button>

                        <Link
                            to="/staff-area/prescriptions"
                            className={styles["prescriptions-cancel-btn"]}
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

export default PrescriptionsCreate;