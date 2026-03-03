import type React from "react";
import Spinner from "../../spinner/Spinner";
import { Link, useNavigate } from "react-router";
import Dialog from "../../dialog/Dialog";
import type { CreateAppointmentRequest, CreateAppointmentRequestError } from "../../../types";
import { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import { useCreateRequestAppointment } from "../../../api/appointmentsAPI";
import { getJwtDecodedData } from "../../../utils/getJwtDecodedData";
import styles from "./Appointments-Create-Request.module.css";
import { getTomorrowDatetimeLocal } from "../../../utils/formatDetails";

const initialValues: CreateAppointmentRequest = {
    date: "",
    description: "",
};

const AppointmentsCreateRequest: React.FC = () => {
    const [errors, setErrors] = useState<CreateAppointmentRequestError>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const navigate = useNavigate();
    const decodedData = getJwtDecodedData();
    const { createRequestAppointment, cancelCreateRequestAppointment } = useCreateRequestAppointment();

    const validateField = (
        field: keyof CreateAppointmentRequest,
        value: string,
        allValues: CreateAppointmentRequest
    ): string | undefined => {
        switch (field) {
            case "date":
                if (!value) return "Date is required.";
                const selectedDate = new Date(value);
                const minDate = new Date();
                minDate.setDate(minDate.getDate() + 1);
                if (selectedDate < minDate) return "Date must be at least one day in the future.";
                return undefined;
            case "description":
                if (!value) return "Description is required.";
                if (value.length < 10 || value.length > 255) return "Description must be between 10 and 255 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: CreateAppointmentRequest): CreateAppointmentRequestError => {
        const fieldErrors: CreateAppointmentRequestError = {};
        (Object.keys(values) as (keyof CreateAppointmentRequest)[]).forEach(field => {
            const error = validateField(field, String(values[field] ?? ""), values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const createAppointmentRequestHandler = async (values: CreateAppointmentRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            setErrors({});
            if (!decodedData) return;

            const payload: CreateAppointmentRequest = {
                ...values,
                date: values.date,
            };

            const response = await createRequestAppointment(payload);
            if (!response) return;

            setDialog({ message: "Appointment request created successfully!", type: "success" });
            setTimeout(() => navigate(`/appointments`), 1500);
        } catch {
            setDialog({ message: "Failed to create appointment request, please try again later.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeValues, onSubmit } = useForm(initialValues, createAppointmentRequestHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof CreateAppointmentRequest;

        changeValues({ ...values, [fieldName]: value });

        const errorMsg = validateField(fieldName, value, { ...values, [fieldName]: value });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof CreateAppointmentRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelCreateRequestAppointment();
    }, []);

    return (
        <div className={styles.pageContainer}>
            {formLoading && (
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
                        <i className="fa-solid fa-calendar-plus"></i>
                    </div>
                    <h1 className={styles.title}>Request an Appointment</h1>
                    <p className={styles.subtitle}>Schedule a new visit for your pet</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="date">Date & Time</label>
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

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-align-left ${styles.textareaIcon}`}></i>
                            <textarea
                                id="description"
                                name="description"
                                value={values.description ?? ""}
                                onChange={handleChange}
                                className={`${styles.textarea} ${inputClass("description")}`}
                                placeholder="E.g. Annual vaccination..."
                                rows={5}
                                required
                            />
                        </div>
                        {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button type="submit" className={styles.submitBtn} disabled={formLoading}>
                            <i className="fa-solid fa-paper-plane"></i> Send Request
                        </button>
                        <Link to="/appointments" className={styles.cancelBtn}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AppointmentsCreateRequest;