import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { UpdateAppointmentRequest, UpdateAppointmentRequestErrors, } from "../../../types";
import { useForm } from "../../../hooks/useForm";
import { useGetUserData } from "../../../hooks/useGetUserData";
import Dialog from "../../dialog/Dialog";
import Spinner from "../../spinner/Spinner";
import { useGetAppointmentDetails, useUpdateAppointmentRequest } from "../../../api/appointmentsAPI";
import styles from "./Appointments-Update-Request.module.css";
import { getTomorrowDatetimeLocal, isoToDatetimeLocal } from "../../../utils/formatDetails";

const initialValues: UpdateAppointmentRequest = {
    date: "",
    description: "",
    id: 0
};

const AppointmentsUpdateRequest: React.FC = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState<UpdateAppointmentRequestErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { isLoading: userLoading } = useGetUserData();
    const { getAppointmentDetails, cancelGetAppointmentDetails } = useGetAppointmentDetails();
    const { updateAppointmentRequest, cancelUpdateAppointmentRequest } = useUpdateAppointmentRequest();
    const navigate = useNavigate();

    const validateField = (field: keyof UpdateAppointmentRequest, value: string, allValues: UpdateAppointmentRequest): string | undefined => {
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

    const validate = (values: UpdateAppointmentRequest): UpdateAppointmentRequestErrors => {
        const fieldErrors: UpdateAppointmentRequestErrors = {};
        (Object.keys(values) as (keyof UpdateAppointmentRequest)[]).forEach(field => {
            const error = validateField(field, String(values[field] ?? ""), values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const updateAppointmentRequestHandler = async (values: UpdateAppointmentRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            const payload: UpdateAppointmentRequest = {
                ...values,
                date: values.date,
            };

            await updateAppointmentRequest(payload);
            setDialog({ message: "Appointment request updated successfully!", type: "success" });
            setTimeout(() => navigate(`/appointments/${id}/details`), 1500);
        } catch {
            setDialog({ message: "Updating appointment request failed.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, onSubmit, changeValues } = useForm(initialValues, updateAppointmentRequestHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof UpdateAppointmentRequest;

        changeValues({ ...values, [fieldName]: value });
        const errorMsg = validateField(fieldName, value, { ...values, [fieldName]: value });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof UpdateAppointmentRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => cancelUpdateAppointmentRequest, []);

    useEffect(() => {
        if (!id) return;

        const fetchAppointmentDetails = async () => {
            try {
                setLoading(true);
                const details = await getAppointmentDetails({ id: Number(id) });
                if (details) {
                    changeValues({
                        description: details.description,
                        date: isoToDatetimeLocal(details.date),
                        id: Number(id),
                    });
                }
            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching appointment details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetails();
        return () => cancelGetAppointmentDetails();
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
                    <h1>Update Appointment</h1>
                    <p>Modify your request details below</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="date">New Date & Time</label>
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
                            <i className={`fa-solid fa-pen ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={values.description ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("description")}`}
                                placeholder="Reason for change..."
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button type="submit" className={styles.submitBtn} disabled={formLoading}>
                            <i className="fa-solid fa-check"></i> Confirm
                        </button>
                        <Link to={`/appointments/${id}/details`} className={styles.cancelBtn}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AppointmentsUpdateRequest;