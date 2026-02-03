import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { EditPrescriptionErrors, EditPrescriptionRequest, } from "../../../../types";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Prescriptions-Edit.module.css";
import { useEditPrescription, useGetPrescriptionDetails } from "../../../../api/prescriptionsAPI";

const initialValues: EditPrescriptionRequest = {
    id: null,
    description: ""
};

const PrescriptionsEdit: React.FC = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState<EditPrescriptionErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { getPrescriptionDetails, cancelGetPrescriptionDetails } = useGetPrescriptionDetails();
    const { editPrescription, cancelEditPrescription } = useEditPrescription();
    const navigate = useNavigate();

    const validateField = (
        field: keyof EditPrescriptionRequest,
        value: string | number,
        allValues: EditPrescriptionRequest
    ): string | undefined => {
        switch (field) {
            case "id":
                if (value !== "" && value !== null && value !== undefined) {
                    const num = Number(value);
                    if (isNaN(num)) return "Prescription ID must be a number.";
                    if (num <= 0) return "Prescription ID must be greater than 0.";
                }
                return undefined;
            case "description":
                if (!String(value).trim()) return "Description is required.";
                if (String(value).trim().length < 2) return "Description must be at least 2 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: EditPrescriptionRequest): EditPrescriptionErrors => {
        const fieldErrors: EditPrescriptionErrors = {};
        (Object.keys(values) as (keyof EditPrescriptionRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const editPrescriptionHandler = async (values: EditPrescriptionRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            const payload: EditPrescriptionRequest = {
                ...values,
                id: values.id ?? null,
            };

            await editPrescription(payload);
            setDialog({ message: "Prescription is edited successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/prescriptions/${id}/details`), 1500);
        } catch (err) {
            setDialog({ message: "Failed editing prescription.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, editPrescriptionHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof EditPrescriptionRequest;

        let parsedValue: string | number | null = value;
        if (type === "number") parsedValue = value === "" ? null : Number(value);
        else if (fieldName === "id") parsedValue = value === "" ? null : Number(value);

        changeValues({ ...values, [fieldName]: parsedValue });

        const errorMsg = validateField(fieldName, parsedValue ?? "", { ...values, [fieldName]: parsedValue });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof EditPrescriptionRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelEditPrescription();
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchPrescriptionDetails = async () => {
            try {
                setLoading(true);

                const prescriptionDetails = await getPrescriptionDetails({
                    id: Number(id),
                });

                if (prescriptionDetails) {
                    changeValues({
                        id: prescriptionDetails.id || null,
                        description: prescriptionDetails.description || "",
                    });
                }
            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching appointment details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptionDetails();
        return () => cancelGetPrescriptionDetails();
    }, [id]);

    return (
        <div className={styles.container}>
            {(isLoading || formLoading) && (
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

            {id ? (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                            <i className="fa-solid fa-file-pen"></i>
                        </div>
                        <h1 className={styles.title}>Edit Prescription</h1>
                        <p className={styles.subtitle}>Update medication details</p>
                    </header>

                    <form onSubmit={onSubmit} noValidate className={styles.form}>
                        {([
                            {
                                name: "id",
                                label: "Prescription ID",
                                type: "number",
                                icon: "fa-hashtag",
                                placeholder: "Enter the prescription ID",
                            },
                            {
                                name: "description",
                                label: "Description",
                                type: "text",
                                icon: "fa-comment-medical",
                                placeholder: "Enter the new description",
                            }
                        ] as const).map(({ name, label, type, icon, placeholder }) => (
                            <div className={styles.formGroup} key={name}>
                                <label htmlFor={name}>
                                    <i className={`fa-solid ${icon}`}></i> {label}
                                </label>
                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    value={values[name] ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass(name)}`}
                                    placeholder={placeholder}
                                    autoComplete="off"
                                />
                                {errors[name] && <span className={styles.errorMsg}>{errors[name]}</span>}
                            </div>
                        ))}

                        <div className={styles.actionGroup}>
                            <button
                                className={styles.saveBtn}
                                type="submit"
                                disabled={isLoading || formLoading}
                            >
                                <i className="fa-solid fa-check"></i> Save
                            </button>

                            <Link 
                                to={`/staff-area/prescriptions/${id}/details`} 
                                className={styles.cancelBtn}
                            >
                                <i className="fa-solid fa-xmark"></i> Cancel
                            </Link>
                        </div>
                    </form>
                </article>
            ) : !isLoading && !id ? (
                <p className={styles.noData}>No user data found.</p>
            ) : null}
        </div>
    );
};

export default PrescriptionsEdit;