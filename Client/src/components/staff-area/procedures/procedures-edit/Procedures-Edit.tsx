import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import type { EditProcedureErrors, EditProcedureRequest } from "../../../../types";
import { useEditProcedure, useGetProcedureDetails } from "../../../../api/proceduresAPI";
import styles from "./Procedures-Edit.module.css";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { getTomorrowDatetimeLocal, isoToDatetimeLocal } from "../../../../utils/formatDetails";

const initialValues: EditProcedureRequest = {
    name: "",
    description: "",
    date: "",
    id: 0
};

const ProceduresEdit: React.FC = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState<EditProcedureErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { getProcedureDetails, cancelGetProcedureDetails } = useGetProcedureDetails();
    const { editProcedure, cancelEditProcedure } = useEditProcedure();
    const navigate = useNavigate();

    const validateField = (
        field: keyof EditProcedureRequest,
        value: string | number,
        allValues: EditProcedureRequest
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
            case "id":
                if (value !== "" && value !== null && value !== undefined) {
                    const num = Number(value);
                    if (isNaN(num)) return "ID must be a number.";
                    if (num <= 0) return "ID must be greater than 0.";
                }
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: EditProcedureRequest): EditProcedureErrors => {
        const fieldErrors: EditProcedureErrors = {};
        (Object.keys(values) as (keyof EditProcedureRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, String(fieldValue), values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const editProcedureHandler = async (values: EditProcedureRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            const payload: EditProcedureRequest = {
                ...values,
                date: values.date
            };

            await editProcedure(payload);
            setDialog({ message: "Procedure edited successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/procedures/${id}/details`), 1500);
        } catch (err) {
            setDialog({ message: "Editing procedure failed.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, editProcedureHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof EditProcedureRequest;

        let parsedValue: string | number | null = value;
        if (type === "number") parsedValue = value === "" ? null : Number(value);
        else if (fieldName === "id") parsedValue = value === "" ? null : Number(value);

        changeValues({ ...values, [fieldName]: parsedValue });

        const errorMsg = validateField(fieldName, parsedValue ?? "", { ...values, [fieldName]: parsedValue });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof EditProcedureRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelEditProcedure();
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchProcedureDetails = async () => {
            try {
                setLoading(true);
                const details = await getProcedureDetails({ id: Number(id) });

                if (details) {
                    const mapped: EditProcedureRequest = {
                        name: details.name,
                        description: details.description,
                        date: isoToDatetimeLocal(details.date),
                        id: Number(id),
                    };
                    changeValues(mapped);
                }
            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching procedure details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchProcedureDetails();
        return () => cancelGetProcedureDetails();
    }, [id]);

    return (
        <div className={styles.pageContainer}>
            {(formLoading || userLoading || isLoading) && (
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
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                    <h1 className={styles.title}>Edit a Procedure</h1>
                    <p className={styles.subtitle}>Update medical procedure details</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="id">ID</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-hashtag ${styles.inputIcon}`}></i>
                            <input
                                type="number"
                                id="id"
                                name="id"
                                value={values.id}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.readOnly}`}
                                placeholder="ID"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">Procedure Name</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={values.name}
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
                            <i className={`fa-solid fa-align-left ${styles.textareaIcon}`}></i>
                            <textarea
                                id="description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                className={`${styles.textarea} ${inputClass("description")}`}
                                placeholder="Enter description..."
                                rows={5}
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
                                value={values.date}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("date")}`}
                                min={getTomorrowDatetimeLocal()}
                                required
                            />
                        </div>
                        {errors.date && <span className={styles.errorMsg}>{errors.date}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={formLoading}
                        >
                            <i className="fa-solid fa-check"></i> Save
                        </button>

                        <Link
                            to={`/staff-area/procedures/${id}/details`}
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

export default ProceduresEdit;