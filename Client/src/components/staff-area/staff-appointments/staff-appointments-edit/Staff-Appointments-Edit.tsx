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
                if (!String(value).trim()) {
                    return "Description is required.";
                }
                if (String(value).trim().length < 2) {
                    return "Description must be at least 2 characters.";
                }
                return undefined;

            case "staffId":
                if (!String(value).trim()) {
                    return "Staff ID is required.";
                }
                return undefined;

            case "id":
                if (!value) return "ID is required.";
                if (Number(value) <= 0) {
                    return "ID must be a positive number.";
                }
                return undefined;

            case "status": {
                const allowedStatuses: StaffEditAppointmentRequest["status"][] =
                    [
                        "Pending_Review",
                        "Confirmed",
                        "Completed",
                        "Cancelled",
                        "Missed",
                    ];

                if (!allowedStatuses.includes(value as any)) {
                    return "Invalid status.";
                }
                return undefined;
            }

            default:
                return undefined;
        }
    };

    const validate = (
        values: StaffEditAppointmentRequest
    ): StaffEditAppointmentRequestFieldErrors => {
        const fieldErrors: StaffEditAppointmentRequestFieldErrors = {};

        (Object.keys(values) as (keyof StaffEditAppointmentRequest)[]).forEach(
            field => {
                const error = validateField(field, values[field], values);
                if (error) fieldErrors[field] = error;
            }
        );

        return fieldErrors;
    };


    const editAppointmentHandler = async (
        values: StaffEditAppointmentRequest
    ) => {
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

            setTimeout(
                () => navigate(`/staff-area/appointments/${id}/details`),
                1500
            );
        } catch {
            setDialog({
                message: "Editing appointment failed.",
                type: "error",
            });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, onSubmit, changeValues } = useForm(
        initialValues,
        editAppointmentHandler
    );


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof StaffEditAppointmentRequest;

        const parsedValue =
            type === "number" ? Number(value) : value;

        const updatedValues = {
            ...values,
            [fieldName]: parsedValue,
        };

        changeValues(updatedValues);

        const errorMsg = validateField(
            fieldName,
            parsedValue,
            updatedValues
        );

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg,
        }));
    };

    const inputClass = (field: keyof StaffEditAppointmentRequest) => {
        if (errors[field]) {
            return `${styles.input} ${styles.error}`;
        }
        if (values[field] && !errors[field]) {
            return `${styles.input} ${styles.success}`;
        }
        return styles.input;
    };

    useEffect(() => {
        return () => cancelEditAppointment();
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchAppointmentDetails = async () => {
            try {
                setLoading(true);
                const details = await getAppointmentDetails({
                    id: Number(id),
                });

                console.log(details?.staffMemberId);
                

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
                    message:
                        err?.title ??
                        "An error occurred while fetching appointment details.",
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
        <>
            {(formLoading || userLoading || isLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["appointments-edit"]}>
                <div className={styles["appointments-edit-container"]}>
                    <h2>Edit Appointment</h2>

                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles["appointments-edit-form-group"]}>
                            <label htmlFor="date">
                                <i className="fa-solid fa-calendar-days"></i>{" "}
                                Date:
                            </label>

                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={values.date}
                                onChange={handleChange}
                                className={inputClass("date")}
                                min={getTomorrowDatetimeLocal()}
                                required
                            />

                            {errors.date && (
                                <p className={styles["error-text"]}>
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        <div className={styles["appointments-edit-form-group"]}>
                            <label htmlFor="description">
                                <i className="fa-solid fa-comment"></i>{" "}
                                Description:
                            </label>

                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                className={inputClass("description")}
                                required
                            />

                            {errors.description && (
                                <p className={styles["error-text"]}>
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className={styles["appointments-edit-form-group"]}>
                            <label htmlFor="staffId">
                                <i className="fa-solid fa-user"></i>{" "}
                                Staff ID:
                            </label>

                            <input
                                type="text"
                                id="staffId"
                                name="staffId"
                                value={values.staffId}
                                onChange={handleChange}
                                className={inputClass("staffId")}
                                required
                            />

                            {errors.staffId && (
                                <p className={styles["error-text"]}>
                                    {errors.staffId}
                                </p>
                            )}
                        </div>

                        <div className={styles["appointments-edit-form-group"]}>
                            <label htmlFor="id">
                                <i className="fa-solid fa-hashtag"></i>{" "}
                                ID:
                            </label>

                            <input
                                type="number"
                                id="id"
                                name="id"
                                value={values.id}
                                onChange={handleChange}
                                className={inputClass("id")}
                                required
                            />

                            {errors.id && (
                                <p className={styles["error-text"]}>
                                    {errors.id}
                                </p>
                            )}
                        </div>

                        <div className={styles["appointments-edit-form-group"]}>
                            <label htmlFor="status">
                                <i className="fa-solid fa-flag"></i>{" "}
                                Status:
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={values.status}
                                onChange={handleChange}
                                className={inputClass("status")}
                                required
                            >
                                <option value="Pending_Review">
                                    Pending review
                                </option>
                                <option value="Confirmed">
                                    Confirmed
                                </option>
                                <option value="Completed">
                                    Completed
                                </option>
                                <option value="Cancelled">
                                    Cancelled
                                </option>
                                <option value="Missed">
                                    Missed
                                </option>
                            </select>

                            {errors.status && (
                                <p className={styles["error-text"]}>
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={styles["appointments-edit-btn-small"]}
                            disabled={formLoading}
                        >
                            Save
                        </button>

                        <Link
                            to="/staff-area/appointments"
                            className={styles["appointments-cancel-btn"]}
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

export default StaffAppointmentsEdit;
