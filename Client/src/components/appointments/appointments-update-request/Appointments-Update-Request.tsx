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

    const { userData, isLoading: userLoading } = useGetUserData();
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

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, updateAppointmentRequestHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof UpdateAppointmentRequest;

        changeValues({ ...values, [fieldName]: value });
        const errorMsg = validateField(fieldName, value, { ...values, [fieldName]: value });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof UpdateAppointmentRequest) => {
        if (errors[field]) return styles.error;
        if (values[field] && !errors[field]) return styles.success;
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
        <>
            {(formLoading || userLoading || isLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["appointments-update-request"]}>
                <div className={styles["appointments-update-request-container"]}>
                    <h2>Update Appointment Request</h2>
                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles["appointments-update-request-form-group"]}>
                            <label htmlFor="date">Date of appointment:</label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={values.date ?? ""}
                                onChange={handleChange}
                                className={inputClass("date")}
                                min={getTomorrowDatetimeLocal()}
                                required
                            />
                            {errors.date && <p className={styles["error-text"]}>{errors.date}</p>}
                        </div>

                        <div className={styles["appointments-update-request-form-group"]}>
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={values.description ?? ""}
                                onChange={handleChange}
                                className={inputClass("description")}
                                placeholder="Enter new appointment description"
                                autoComplete="off"
                                required
                            />
                            {errors.description && <p className={styles["error-text"]}>{errors.description}</p>}
                        </div>

                        <button type="submit" className={styles["appointments-update-request-btn"]} disabled={formLoading}>
                            Update
                        </button>
                        <Link to={`/appointments/${id}/details`} className={styles["appointments-update-request-cancel-btn"]}>Cancel</Link>
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

export default AppointmentsUpdateRequest;
