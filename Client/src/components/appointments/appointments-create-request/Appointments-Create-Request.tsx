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
                date: new Date(values.date).toISOString(),
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof CreateAppointmentRequest;

        changeValues({ ...values, [fieldName]: value });

        const errorMsg = validateField(fieldName, value, { ...values, [fieldName]: value });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof CreateAppointmentRequest) => {
        if (errors[field]) return "error";
        if (values[field] && !errors[field]) return "success";
        return "";
    };

    useEffect(() => {
        return () => cancelCreateRequestAppointment();
    }, []);

    return (
        <>
            {formLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["appointments-create-request"]}>
                <div className={styles["appointments-create-request-container"]}>
                    <h2>Request Appointment</h2>
                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles["appointments-create-request-form-group"]}>
                            <label htmlFor="date">Date of appointment:</label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={values.date ?? ""}
                                onChange={handleChange}
                                className={`${styles["appointments-create-request-form-group"]} ${inputClass("date")}`}
                                required
                            />
                            {errors.date && <p className={styles["error-text"]}>{errors.date}</p>}
                        </div>

                        <div className={styles["appointments-create-request-form-group"]}>
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={values.description ?? ""}
                                onChange={handleChange}
                                className={`${styles["appointments-create-request-form-group"]} ${inputClass("description")}`}
                                placeholder="Enter appointment description"
                                autoComplete="off"
                                required
                            />
                            {errors.description && <p className={styles["error-text"]}>{errors.description}</p>}
                        </div>

                        <button type="submit" className={styles["appointments-create-request-btn"]} disabled={formLoading}>
                            Request
                        </button>
                        <Link to="/appointments" className={styles["appointments-create-request-cancel-btn"]}>Cancel</Link>
                    </form>
                </div>
            </section>

            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}
        </>
    );
};

export default AppointmentsCreateRequest;
