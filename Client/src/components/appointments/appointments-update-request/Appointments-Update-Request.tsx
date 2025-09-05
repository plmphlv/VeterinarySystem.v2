import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { UpdateAppointmentRequest, UpdateAppointmentRequestFieldErrors } from "../../../types";
import { useForm } from "../../../hooks/useForm";
import { useGetUserData } from "../../../hooks/useGetUserData";
import Dialog from "../../dialog/Dialog";
import Spinner from "../../spinner/Spinner";
import { useGetAppointmentDetails, useUpdateAppointmentRequest } from "../../../api/userAppointmentsAPI";

const initialValues: UpdateAppointmentRequest = {
    date: "",
    description: "",
    id: 0
};

const AppointmentsUpdateRequest: React.FC = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState<UpdateAppointmentRequestFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { getAppointmentDetails, cancelGetAppointmentDetails } = useGetAppointmentDetails();
    const { updateAppointmentRequest, cancelUpdateAppointmentRequest } = useUpdateAppointmentRequest();
    const navigate = useNavigate();

    const validateField = (
        field: keyof UpdateAppointmentRequest,
        value: string,
        allValues: UpdateAppointmentRequest
    ): string | undefined => {
        switch (field) {
            case "date":
                if (!value) return "Date is required.";

                const selectedDate = new Date(value);
                const now = new Date();

                const minDate = new Date();
                minDate.setDate(now.getDate() + 1);

                if (selectedDate < minDate) {
                    return "Date must be at least one day in the future.";
                }
                return undefined;

            case "description":
                if (!value) return "Description is required.";
                // value.trim().length < 10
                if (value.length < 10 || value.length > 255) return "Description must be between 10 and 255 characters.";
                return undefined;

            default:
                return undefined;
        }
    };

    const validate = (values: UpdateAppointmentRequest): UpdateAppointmentRequestFieldErrors => {
        const fieldErrors: UpdateAppointmentRequestFieldErrors = {};
        (Object.keys(values) as (keyof UpdateAppointmentRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, String(fieldValue), values);
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
                date: new Date(values.date).toISOString(),
            };

            await updateAppointmentRequest(payload);

            setDialog({ message: "Appointment request updated successfully!", type: "success" });
            setTimeout(() => navigate(`/appointments/${id}/details`), 1000);
        } catch (err) {
            setDialog({ message: "Updating appointment request failed.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, updateAppointmentRequestHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof UpdateAppointmentRequest;

        let parsedValue: string | number | null = value;

        changeValues({ ...values, [fieldName]: parsedValue });

        const valueForValidation = parsedValue ?? "";
        const errorMsg = validateField(fieldName, valueForValidation, { ...values, [fieldName]: parsedValue });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof UpdateAppointmentRequest) => {
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => cancelUpdateAppointmentRequest, []);

    useEffect(() => {
        if (!id) return;

        const fetchAppointmentDetails = async () => {
            try {
                setLoading(true);
                const details = await getAppointmentDetails({ id: Number(id) });

                if (details) {
                    const mapped: UpdateAppointmentRequest = {
                        description: details.description,
                        date: new Date(details.date).toISOString().slice(0, 16),
                        id: Number(id),
                    };
                    changeValues(mapped);
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

    useEffect(() => {
        return () => cancelUpdateAppointmentRequest();
    }, []);

    return (
        <>
            {(formLoading || userLoading || isLoading) && (
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

                        <button type="submit" className="add-pet-btn" disabled={formLoading}>
                            Update
                        </button>
                        <Link to={`/appointments/${id}/details`} className="cancel-btn">Cancel</Link>
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
