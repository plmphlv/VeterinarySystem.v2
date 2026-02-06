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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        <div className={styles.pageContainer}>
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

            {values.id ? (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                            <i className="fa-solid fa-file-pen"></i>
                        </div>
                        <h1 className={styles.title}>Edit a Prescription</h1>
                        <p className={styles.subtitle}>Update medication details</p>
                    </header>

                    <form onSubmit={onSubmit} noValidate className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="id">Prescription ID</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-hashtag ${styles.inputIcon}`}></i>
                                <input
                                    type="number"
                                    id="id"
                                    name="id"
                                    value={values.id ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${styles.readOnly}`}
                                    placeholder="Enter the prescription ID"
                                    autoComplete="off"
                                    readOnly
                                />
                            </div>
                            {errors.id && <span className={styles.errorMsg}>{errors.id}</span>}
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
                                    placeholder="Enter the new description..."
                                    rows={6}
                                    required
                                />
                            </div>
                            {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
                        </div>

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
            ) : !isLoading && (
                <p className={styles.noData}>No prescription found.</p>
            )}
        </div>
    );
};

export default PrescriptionsEdit;