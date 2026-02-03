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
import { getTomorrowDatetimeLocal } from "../../../../utils/formatDetails";

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
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelCreateProcedure();
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

            <section className={styles.card}>
                <header className={styles.cardHeader}>
                    <h1>Create Procedure</h1>
                    <p>Log a new medical procedure</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Procedure Name</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={values.name ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("name")}`}
                                placeholder="Enter procedure name"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-pen ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={values.description ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("description")}`}
                                placeholder="Enter details about the procedure"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="date">Date</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-calendar-days ${styles.inputIcon}`}></i>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={values.date ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("date")}`}
                                min={getTomorrowDatetimeLocal()}
                                required
                            />
                        </div>
                        {errors.date && <span className={styles.errorMsg}>{errors.date}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="animalId">Animal ID</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-paw ${styles.inputIcon}`}></i>
                                <input
                                    type="number"
                                    id="animalId"
                                    name="animalId"
                                    value={values.animalId ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("animalId")}`}
                                    placeholder="Animal ID"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            {errors.animalId && <span className={styles.errorMsg}>{errors.animalId}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="staffId">Staff ID</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-user-doctor ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    id="staffId"
                                    name="staffId"
                                    value={values.staffId ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("staffId")}`}
                                    placeholder="Staff ID"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            {errors.staffId && <span className={styles.errorMsg}>{errors.staffId}</span>}
                        </div>
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
                            to="/staff-area/procedures"
                            className={styles.cancelBtn}
                        >
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ProceduresCreate;