import type React from "react";
import Spinner from "../spinner/Spinner";
import { Link, useNavigate } from "react-router";
import Dialog from "../dialog/Dialog";
import type { CreateAppointmentRequest, CreateAppointmentRequestError } from "../../types";
import { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useCreateRequestAppointment } from "../../api/userAppointmentsAPI";
import { getJwtDecodedData } from "../../utils/getJwtDecodedData";

const initialValues: CreateAppointmentRequest = {
    date: "",
    description: "",
    staffId: "",
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
                const now = new Date();
                if (selectedDate <= now) {
                    return "Date must be in the future.";
                }
                return undefined;

            case "description":
                if (!value) return "Description is required.";
                if (value.trim().length < 10) return "Description must be at least 10 characters.";
                return undefined;

            case "staffId":
                if (!value) return "Staff ID is required.";
                if (value.trim().length !== 36) return "Staff ID must be 36 characters.";
                return undefined;

            default:
                return undefined;
        }
    };

    const validate = (values: CreateAppointmentRequest): CreateAppointmentRequestError => {
        const fieldErrors: CreateAppointmentRequestError = {};
        (Object.keys(values) as (keyof CreateAppointmentRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, String(fieldValue), values);
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

            if (!decodedData) {
                return;
            }

            const payload: CreateAppointmentRequest = {
                ...values,
                date: new Date(values.date).toISOString(),
            };

            console.log(payload);

            const response = await createRequestAppointment(payload);

            if (!response) {
                return;
            }

            setDialog({ message: "Appointment request created successfully!", type: "success" });
            setTimeout(() => {
                navigate("/appointments");
            }, 500);
        } catch {
            setDialog({ message: "Failed to create appointment request.", type: "error" });
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
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => {
        return () => {
            cancelCreateRequestAppointment();
        };
    }, []);

    return (
        <>
            {formLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className="my-pets-add">
                <div className="my-pets-add-container">
                    <h2>Request Appointment</h2>
                    <form onSubmit={onSubmit} noValidate>
                        <div className="my-pets-add-form-group">
                            <label htmlFor="date">Date of appointment:</label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={values.date ?? ""}
                                onChange={handleChange}
                                className={inputClass("date")}
                                required
                            />
                            {errors.date && <p className="error-text">{errors.date}</p>}
                        </div>

                        <div className="my-pets-add-form-group">
                            <label htmlFor="description">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={values.description ?? ""}
                                onChange={handleChange}
                                className={inputClass("description")}
                                placeholder="Enter appointment description"
                                autoComplete="off"
                                required
                            />
                            {errors.description && <p className="error-text">{errors.description}</p>}
                        </div>

                        <div className="my-pets-add-form-group">
                            <label htmlFor="staffId">Staff ID:</label>
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
                            {errors.staffId && <p className="error-text">{errors.staffId}</p>}
                        </div>

                        <button type="submit" className="add-pet-btn" disabled={formLoading}>
                            Request
                        </button>
                        <Link to="/my-pets" className="cancel-btn">Cancel</Link>
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

export default AppointmentsCreateRequest;
