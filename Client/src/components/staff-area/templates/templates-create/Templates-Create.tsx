import type React from "react";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { Link, useNavigate } from "react-router";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Templates-Create.module.css";
import type { CreateTemplateRequest } from "../../../../types";
import { useCreateTemplate } from "../../../../api/templatesAPI";

const initialValues: CreateTemplateRequest = {
    name: "",
    type: "",
    content: "",
    isActive: true
};

const TemplatesCreate: React.FC = () => {
    const [errors, setErrors] = useState<Partial<Record<keyof CreateTemplateRequest, string>>>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { createTemplate, cancelCreateTemplate } = useCreateTemplate();
    const navigate = useNavigate();

    const validateField = (
        field: keyof CreateTemplateRequest,
        value: string | boolean,
        allValues: CreateTemplateRequest
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

    const validate = (values: CreateTemplateRequest): Partial<Record<keyof CreateTemplateRequest, string>> => {
        const fieldErrors: Partial<Record<keyof CreateTemplateRequest, string>> = {};
        (Object.keys(values) as (keyof CreateTemplateRequest)[]).forEach(field => {
            const error = validateField(field, values[field], values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const createTemplateHandler = async (values: CreateTemplateRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            setErrors({});
            if (!userData) return;

            await createTemplate(values);

            setDialog({ message: "Template created successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/templates`), 1500);
        } catch {
            setDialog({ message: "Failed creating template.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, createTemplateHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof CreateTemplateRequest;

        let parsedValue: string | boolean = value;

        // Handle select boolean for isActive
        if (fieldName === "isActive") {
            parsedValue = value === "true";
        }

        changeValues({ ...values, [fieldName]: parsedValue });

        const errorMsg = validateField(fieldName, parsedValue, { ...values, [fieldName]: parsedValue });
        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof CreateTemplateRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field] && field !== "isActive") return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelCreateTemplate();
    }, []);

    return (
        <div className={styles.pageContainer}>
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

            <section className={styles.card}>
                <header className={styles.cardHeader}>
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-file-circle-plus"></i>
                    </div>
                    <h1 className={styles.title}>Create a Template</h1>
                    <p className={styles.subtitle}>Add a new reusable template</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Template Name</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("name")}`}
                                placeholder="e.g. Vaccination Reminder"
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
                                    placeholder="e.g. Email, Document"
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
                                    value={values.isActive.toString()}
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
                                placeholder="Enter the template content here..."
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
                            <i className="fa-solid fa-plus"></i> Create Template
                        </button>

                        <Link
                            to="/staff-area/templates"
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

export default TemplatesCreate;