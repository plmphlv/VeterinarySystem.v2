import type React from "react";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { Link, useNavigate } from "react-router";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import type { CreateProcedureRequest, CreateProcedureErrors } from "../../../../types";
import styles from "./Procedures-Create.module.css";
import { useCreateProcedure } from "../../../../api/proceduresAPI";

const initialValues: CreateProcedureRequest = {
    name: "",
    description: "",
    date: "",
    animalId: null,
    staffId: ""
};

const ProceduresCreate: React.FC = () => {
    const [errors, setErrors] = useState<CreateProcedureErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { createProcedure, cancelCreateProcedure } = useCreateProcedure();
    const navigate = useNavigate();

    const validateField = (
        field: keyof CreateProcedureRequest,
        value: string | number,
        allValues: CreateProcedureRequest
    ): string | undefined => {
        switch (field) {
            case "name":
                if (!String(value).trim()) return "Name is required.";
                if (String(value).trim().length < 2) return "Name must be at least 2 characters.";
                return undefined;
            case "description":
                if (!String(value).trim()) return "Description is required.";
                if (String(value).trim().length < 2) return "Description must be at least 2 characters.";
                return undefined;
            case "date":
                if (!value) return "Date is required.";
                const selectedDate = new Date(value);
                const minDate = new Date();
                minDate.setDate(minDate.getDate() + 1);
                if (selectedDate < minDate) return "Date must be at least one day in the future.";
                return undefined;
            case "animalId":
                if (value !== "" && value !== null && value !== undefined) {
                    const num = Number(value);
                    if (isNaN(num)) return "Animal ID must be a number.";
                    if (num <= 0) return "Animal ID must be greater than 0.";
                }
                return undefined;
            case "staffId":
                if (!String(value).trim()) return "Staff ID is required.";
                if (String(value).trim().length < 2) return "Staff ID must be at least 2 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: CreateProcedureRequest): CreateProcedureErrors => {
        const fieldErrors: CreateProcedureErrors = {};
        (Object.keys(values) as (keyof CreateProcedureRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const createProcedureHandler = async (values: CreateProcedureRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            setErrors({});
            if (!userData) return;

            const payload: CreateProcedureRequest = {
                ...values,
                animalId: values.animalId ?? null,
            };

            await createProcedure(payload);

            setDialog({ message: "Procedure created successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/procedures`), 1500);
        } catch {
            setDialog({ message: "Failed creating procedure.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, createProcedureHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof CreateProcedureRequest;

        let parsedValue: string | number | null = value;
        if (type === "number") parsedValue = value === "" ? null : Number(value);
        else if (fieldName === "animalId") parsedValue = value === "" ? null : Number(value);

        changeValues({ ...values, [fieldName]: parsedValue });

        const errorMsg = validateField(fieldName, parsedValue ?? "", { ...values, [fieldName]: parsedValue });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof CreateProcedureRequest) => {
        if (errors[field]) return `${styles.input} ${styles.error}`;
        if (values[field] && !errors[field]) return `${styles.input} ${styles.success}`;
        return styles.input;
    };

    useEffect(() => {
        return () => cancelCreateProcedure();
    }, []);

    return (
        <>
            {(formLoading || userLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["procedures-create"]}>
                <div className={styles["procedures-create-container"]}>
                    <h2>Create Procedure</h2>

                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles["procedures-create-form-group"]}>
                            <label htmlFor="name">
                                <i className="fa-solid fa-pen"></i> Name:
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={values.name ?? ""}
                                onChange={handleChange}
                                className={inputClass("name")}
                                placeholder="Enter name"
                                autoComplete="off"
                                required
                            />

                            {errors.name && (
                                <p className={styles["error-text"]}>{errors.name}</p>
                            )}
                        </div>

                        <div className={styles["procedures-create-form-group"]}>
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

                        <div className={styles["procedures-create-form-group"]}>
                            <label htmlFor="date">
                                <i className="fa-solid fa-pen"></i> Date of procedure:
                            </label>

                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={values.date ?? ""}
                                onChange={handleChange}
                                className={`${styles["appointments-create-form-group"]} ${inputClass("date")}`}
                                placeholder="Select date"
                                autoComplete="off"
                                required
                            />
                            {errors.date && <p className={styles["error-text"]}>{errors.date}</p>}
                        </div>

                        <div className={styles["procedures-create-form-group"]}>
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

                        <div className={styles["procedures-create-form-group"]}>
                            <label htmlFor="staffId">
                                <i className="fa-solid fa-pen"></i> Staff ID:
                            </label>

                            <input
                                type="text"
                                id="staffId"
                                name="staffId"
                                value={values.staffId ?? ""}
                                onChange={handleChange}
                                className={inputClass("staffId")}
                                placeholder="Enter staff ID"
                                autoComplete="off"
                                required
                            />

                            {errors.staffId && (
                                <p className={styles["error-text"]}>{errors.staffId}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles["procedures-create-btn-small"]}
                            disabled={formLoading}
                        >
                            Create
                        </button>

                        <Link
                            to="/staff-area/procedures"
                            className={styles["procedures-cancel-btn"]}
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

export default ProceduresCreate;