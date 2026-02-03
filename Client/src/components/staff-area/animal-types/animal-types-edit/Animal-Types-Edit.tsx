import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { EditAnimalTypeRequest, EditAnimalTypeRequestFieldErrors } from "../../../../types";
import { useEditAnimalType, useGetAnimalTypes } from "../../../../api/animalTypesAPI";
import { useForm } from "../../../../hooks/useForm";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import Dialog from "../../../dialog/Dialog";
import Spinner from "../../../spinner/Spinner";
import styles from "./Animal-Types-Edit.module.css";

const initialValues: EditAnimalTypeRequest = {
    id: 0,
    typeName: "",
};

const AnimalTypesEdit: React.FC = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState<EditAnimalTypeRequestFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { getAnimalTypes, cancelGetAnimalTypes } = useGetAnimalTypes();
    const { editAnimalType, cancelEditAnimalType } = useEditAnimalType();
    const navigate = useNavigate();

    const editHandler = async (values: EditAnimalTypeRequest) => {
        const validationErrors: EditAnimalTypeRequestFieldErrors = {};
        if (!values.typeName || values.typeName.trim().length < 2) {
            validationErrors.typeName = "Type name must be at least 2 characters.";
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            const payload: EditAnimalTypeRequest = {
                ...values,
                id: Number(id),
                typeName: values.typeName.trim(),
            };
            await editAnimalType(payload);
            setDialog({ message: "Animal type name edited successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/animal-types`), 1500);
        } catch {
            setDialog({ message: "Failed editing animal type name.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, onSubmit, changeValues } = useForm(initialValues, editHandler);

    useEffect(() => {
        const fetchAnimalTypes = async () => {
            setLoading(true);
            try {
                const types = await getAnimalTypes();
                const current = types?.find(t => t.id === Number(id));
                if (current) {
                    changeValues({ id: current.id, typeName: current.value });
                }
            } catch {
                setDialog({ message: "Error fetching details", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchAnimalTypes();
        return () => cancelGetAnimalTypes();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof EditAnimalTypeRequest;
        changeValues({ ...values, [fieldName]: value });

        const errorMsg = !value.trim()
            ? "Type name is required."
            : value.trim().length < 2
            ? "Type name must be at least 2 characters."
            : undefined;

        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
    };

    const inputClass = (field: keyof EditAnimalTypeRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => cancelEditAnimalType, []);

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
                    <h1>Edit Animal Type</h1>
                    <p>Update the animal category name</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="typeName">Type Name</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-tag ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="typeName"
                                name="typeName"
                                value={values.typeName ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("typeName")}`}
                                placeholder="Edit type name"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.typeName && <span className={styles.errorMsg}>{errors.typeName}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={formLoading}
                        >
                            <i className="fa-solid fa-check"></i> Save
                        </button>
                        <Link
                            to={`/staff-area/animal-types`}
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

export default AnimalTypesEdit;