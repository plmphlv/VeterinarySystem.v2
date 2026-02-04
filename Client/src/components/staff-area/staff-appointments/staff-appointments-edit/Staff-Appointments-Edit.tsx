import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import { useForm } from "../../../../hooks/useForm";
import { useGetUserData } from "../../../../hooks/useGetUserData";

import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

import styles from "./Staff-Appointments-Edit.module.css";

import { getTomorrowDatetimeLocal, isoToDatetimeLocal } from "../../../../utils/formatDetails";
import { useGetAppointmentDetails, useEditAppointment } from "../../../../api/appointmentsAPI";

import type { AppointmentStatus, StaffEditAppointmentRequest, StaffEditAppointmentRequestFieldErrors } from "../../../../types";

const initialValues: StaffEditAppointmentRequest = {
    date: "",
    description: "",
    staffId: "",
    id: 0,
    status: "Pending_Review",
};

const StaffAppointmentsEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [errors, setErrors] = useState<StaffEditAppointmentRequestFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { getAppointmentDetails, cancelGetAppointmentDetails } = useGetAppointmentDetails();
    const { editAppointment, cancelEditAppointment } = useEditAppointment();

    const validateField = (
        field: keyof StaffEditAppointmentRequest,
        value: string | number,
        allValues: StaffEditAppointmentRequest
    ): string | undefined => {
        switch (field) {
            case "date": {
                if (!value) return "Date is required.";
                const selectedDate = new Date(value);
                const minDate = new Date();
                minDate.setDate(minDate.getDate() + 1);
                if (selectedDate < minDate) {
                    return "Date must be at least one day in the future.";
                }
                return undefined;
            }
            case "description":
                if (!String(value).trim()) return "Description is required.";
                if (String(value).trim().length < 2) return "Description must be at least 2 characters.";
                return undefined;
            case "staffId":
                if (!String(value).trim()) return "Staff ID is required.";
                return undefined;
            case "id":
                if (!value) return "ID is required.";
                if (Number(value) <= 0) return "ID must be a positive number.";
                return undefined;
            case "status": {
                const allowedStatuses: StaffEditAppointmentRequest["status"][] =
                    ["Pending_Review", "Confirmed", "Completed", "Cancelled", "Missed"];
                if (!allowedStatuses.includes(value as any)) return "Invalid status.";
                return undefined;
            }
            default:
                return undefined;
        }
    };

    const validate = (values: StaffEditAppointmentRequest): StaffEditAppointmentRequestFieldErrors => {
        const fieldErrors: StaffEditAppointmentRequestFieldErrors = {};
        (Object.keys(values) as (keyof StaffEditAppointmentRequest)[]).forEach(
            field => {
                const error = validateField(field, values[field], values);
                if (error) fieldErrors[field] = error;
            }
        );
        return fieldErrors;
    };

    const editAppointmentHandler = async (values: StaffEditAppointmentRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            await editAppointment(values);
            setDialog({
                message: "Appointment edited successfully!",
                type: "success",
            });
            setTimeout(() => navigate(`/staff-area/appointments/${id}/details`), 1500);
        } catch {
            setDialog({
                message: "Editing appointment failed.",
                type: "error",
            });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, onSubmit, changeValues } = useForm(initialValues, editAppointmentHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof StaffEditAppointmentRequest;
        const parsedValue = type === "number" ? Number(value) : value;

        const updatedValues = { ...values, [fieldName]: parsedValue };
        changeValues(updatedValues);

        const errorMsg = validateField(fieldName, parsedValue, updatedValues);
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
    };

    const inputClass = (field: keyof StaffEditAppointmentRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelEditAppointment();
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchAppointmentDetails = async () => {
            try {
                setLoading(true);
                const details = await getAppointmentDetails({ id: Number(id) });
                if (details) {
                    changeValues({
                        date: isoToDatetimeLocal(details.date),
                        description: details.description,
                        staffId: String(details?.staffMemberId ?? ""),
                        id: Number(id),
                        status: details.appointmentStatus as AppointmentStatus,
                    });
                }
            } catch (err: any) {
                setDialog({
                    message: err?.title ?? "An error occurred while fetching appointment details.",
                    type: "error",
                });
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

            <article className={styles.card}>
                <header className={styles.cardHeader}>
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                    <h1 className={styles.title}>Edit an Appointment</h1>
                    <p className={styles.subtitle}>Update appointment details</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
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

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-pen ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("description")}`}
                                required
                            />
                        </div>
                        {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="staffId">Staff ID</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-user-doctor ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="staffId"
                                name="staffId"
                                value={values.staffId}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("staffId")}`}
                                required
                            />
                        </div>
                        {errors.staffId && <span className={styles.errorMsg}>{errors.staffId}</span>}
                    </div>

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
                                className={`${styles.input} ${inputClass("id")}`}
                                required
                                readOnly
                            />
                        </div>
                        {errors.id && <span className={styles.errorMsg}>{errors.id}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-flag ${styles.inputIcon}`}></i>
                            <select
                                id="status"
                                name="status"
                                value={values.status}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.selectInput} ${inputClass("status")}`}
                                required
                            >
                                <option value="Pending_Review">Pending review</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Missed">Missed</option>
                            </select>
                        </div>
                        {errors.status && <span className={styles.errorMsg}>{errors.status}</span>}
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

export default StaffAppointmentsEdit;