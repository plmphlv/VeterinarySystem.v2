import type React from "react";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { Link, useNavigate } from "react-router";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Staff-Appointments-Create.module.css";
import type { StaffCreateAppointmentRequest, StaffCreateAppointmentRequestFieldErrors } from "../../../../types";
import { useCreateAppointment } from "../../../../api/appointmentsAPI";
import { getTomorrowDatetimeLocal } from "../../../../utils/formatDetails";

const initialValues: StaffCreateAppointmentRequest = {
    date: "",
    description: "",
    staffId: "",
    ownerId: ""
};

const StaffAppointmentsCreate: React.FC = () => {
    const [errors, setErrors] = useState<StaffCreateAppointmentRequestFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { createAppointment, cancelCreateAppointment } = useCreateAppointment();
    const navigate = useNavigate();

    const validateField = (
        field: keyof StaffCreateAppointmentRequest,
        value: string | number,
        allValues: StaffCreateAppointmentRequest
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
                if (!String(value).trim()) return "Description is required.";
                if (String(value).trim().length < 2) return "Description must be at least 2 characters.";
                return undefined;
            case "staffId":
                if (!String(value).trim()) return "Staff ID is required.";
                if (String(value).trim().length < 2) return "Staff ID must be at least 2 characters.";
                return undefined;
            case "ownerId":
                if (!String(value).trim()) return "Owner ID is required.";
                if (String(value).trim().length < 2) return "Owner ID must be at least 2 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: StaffCreateAppointmentRequest): StaffCreateAppointmentRequestFieldErrors => {
        const fieldErrors: StaffCreateAppointmentRequestFieldErrors = {};
        (Object.keys(values) as (keyof StaffCreateAppointmentRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const createAppointmentHandler = async (values: StaffCreateAppointmentRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            setErrors({});
            if (!userData) return;

            const payload: StaffCreateAppointmentRequest = {
                ...values,
                ownerId: values.ownerId ?? null,
            };

            await createAppointment(payload);

            setDialog({ message: "Appointment created successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/appointments`), 1500);
        } catch {
            setDialog({ message: "Failed creating appointment.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, createAppointmentHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof StaffCreateAppointmentRequest;

        let parsedValue: string | number | null = value;

        changeValues({ ...values, [fieldName]: parsedValue });

        const errorMsg = validateField(fieldName, parsedValue ?? "", { ...values, [fieldName]: parsedValue });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof StaffCreateAppointmentRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelCreateAppointment();
    }, []);

    return (
        <div className={styles.container}>
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
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <h1 className={styles.title}>Create Appointment</h1>
                    <p className={styles.subtitle}>Schedule a new appointment for a client</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="date">
                            <i className="fa-solid fa-calendar"></i> Date & Time
                        </label>
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
                        {errors.date && <span className={styles.errorMsg}>{errors.date}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">
                            <i className="fa-solid fa-pen"></i> Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={values.description ?? ""}
                            onChange={handleChange}
                            className={`${styles.input} ${inputClass("description")}`}
                            placeholder="Enter appointment description"
                            autoComplete="off"
                            required
                        />
                        {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="staffId">
                            <i className="fa-solid fa-user-doctor"></i>Staff ID
                        </label>
                        <input
                            type="text"
                            id="staffId"
                            name="staffId"
                            value={values.staffId ?? ""}
                            onChange={handleChange}
                            className={`${styles.input} ${inputClass("staffId")}`}
                            placeholder="Enter staff ID"
                            autoComplete="off"
                            required
                        />
                        {errors.staffId && <span className={styles.errorMsg}>{errors.staffId}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="ownerId">
                            <i className="fa-solid fa-id-badge"></i> Owner ID
                        </label>
                        <input
                            type="text"
                            id="ownerId"
                            name="ownerId"
                            value={values.ownerId ?? ""}
                            onChange={handleChange}
                            className={`${styles.input} ${inputClass("ownerId")}`}
                            placeholder="Enter owner ID"
                            autoComplete="off"
                            required
                        />
                        {errors.ownerId && <span className={styles.errorMsg}>{errors.ownerId}</span>}
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
                            to="/staff-area/appointments"
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

export default StaffAppointmentsCreate;