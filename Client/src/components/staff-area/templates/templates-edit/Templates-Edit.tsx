import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import type { EditTemplateRequest } from "../../../../types";
import { useEditTemplate, useGetTemplateDetails } from "../../../../api/templatesAPI";
import styles from "./Templates-Edit.module.css";
import { useGetUserData } from "../../../../hooks/useGetUserData";

const initialValues: EditTemplateRequest = {
    id: 0,
    name: "",
    type: "",
    content: "",
    isActive: true
};

const TemplatesEdit: React.FC = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState<Partial<Record<keyof EditTemplateRequest, string>>>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { getTemplateDetails, cancelGetTemplateDetails } = useGetTemplateDetails();
    const { editTemplate, cancelEditTemplate } = useEditTemplate();
    const navigate = useNavigate();

    const validateField = (
        field: keyof EditTemplateRequest,
        value: string | boolean | number,
        allValues: EditTemplateRequest
    ): string | undefined => {
        switch (field) {
            case "name":
                if (typeof value === "string" && !value.trim()) return "Template Name is required.";
                if (typeof value === "string" && value.length < 3) return "Name must be at least 3 characters.";
                return undefined;
            case "type":
                if (typeof value === "string" && !value.trim()) return "Template Type is required.";
                return undefined;
            case "content":
                if (typeof value === "string" && !value.trim()) return "Content is required.";
                if (typeof value === "string" && value.length < 10) return "Content must be at least 10 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: EditTemplateRequest): Partial<Record<keyof EditTemplateRequest, string>> => {
        const fieldErrors: Partial<Record<keyof EditTemplateRequest, string>> = {};
        (Object.keys(values) as (keyof EditTemplateRequest)[]).forEach(field => {
            const error = validateField(field, values[field], values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const editTemplateHandler = async (values: EditTemplateRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            await editTemplate(values);
            setDialog({ message: "Template edited successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/templates/${id}/details`), 1500);
        } catch {
            setDialog({ message: "Failed editing template.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, editTemplateHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof EditTemplateRequest;

        let parsedValue: string | boolean | number = value;

        if (fieldName === "isActive") {
            parsedValue = value === "true";
        }

        changeValues({ ...values, [fieldName]: parsedValue });

        const errorMsg = validateField(fieldName, parsedValue, { ...values, [fieldName]: parsedValue });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof EditTemplateRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field] && field !== "isActive" && field !== "id") return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelEditTemplate();
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchTemplateDetails = async () => {
            try {
                setLoading(true);
                const details = await getTemplateDetails(id);

                if (details) {
                    changeValues({
                        id: details.id,
                        name: details.name,
                        type: details.type,
                        content: details.content,
                        isActive: details.isActive
                    });
                }
            } catch (err: any) {
                setDialog({ message: "Error fetching template details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchTemplateDetails();
        return () => cancelGetTemplateDetails();
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
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                    <h1 className={styles.title}>Edit Template</h1>
                    <p className={styles.subtitle}>Update template information</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="id">ID</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-hashtag ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="id"
                                name="id"
                                value={values.id ?? ""}
                                className={`${styles.input} ${styles.readOnly}`}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">Template Name</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-heading ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("name")}`}
                                placeholder="Enter template name"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="type">Type</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-tag ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    id="type"
                                    name="type"
                                    value={values.type}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("type")}`}
                                    placeholder="Enter type"
                                    required
                                />
                            </div>
                            {errors.type && <span className={styles.errorMsg}>{errors.type}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="isActive">Status</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-toggle-on ${styles.inputIcon}`}></i>
                                <select
                                    id="isActive"
                                    name="isActive"
                                    value={values.isActive?.toString()}
                                    onChange={handleChange}
                                    className={`${styles.input} ${styles.selectInput}`}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="content">Content</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-align-left ${styles.textareaIcon}`}></i>
                            <textarea
                                id="content"
                                name="content"
                                value={values.content}
                                onChange={handleChange}
                                className={`${styles.textarea} ${inputClass("content")}`}
                                placeholder="Edit template content..."
                                rows={6}
                                required
                            />
                        </div>
                        {errors.content && <span className={styles.errorMsg}>{errors.content}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={formLoading}
                        >
                            <i className="fa-solid fa-check"></i> Save Changes
                        </button>

                        <Link
                            to={`/staff-area/templates/${id}/details`}
                            className={styles.cancelBtn}
                        >
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default TemplatesEdit;