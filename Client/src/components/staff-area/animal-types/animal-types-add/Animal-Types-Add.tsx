import type React from "react";
import { useEffect, useState } from "react";
import type { AddAnimalTypeRequest, AddAnimalTypeRequestFieldErrors, AnimalType } from "../../../../types";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { useAddAnimalType, useGetAnimalTypes } from "../../../../api/animalTypesAPI";
import { Link, useNavigate } from "react-router";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Animal-Types-Add.module.css";

const initialValues: AddAnimalTypeRequest = {
    typeName: ""
};

const AnimalTypesAdd: React.FC = () => {
    const [errors, setErrors] = useState<AddAnimalTypeRequestFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { getAnimalTypes, cancelGetAnimalTypes } = useGetAnimalTypes();
    const { addAnimalType, cancelAddAnimalType } = useAddAnimalType();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimalTypes = async () => {
            try {
                setErrors({});
                const animalTypes = await getAnimalTypes();
                setAnimalTypes(animalTypes || []);
            } catch (err: any) {
                setDialog({ message: "An error occurred while fetching animal types.", type: "error" });
                setTimeout(() => navigate(`/staff-area/animal-types`), 1500);
                return;
            } finally {}
        };

        fetchAnimalTypes();
    }, []);

    const validateField = (
        field: keyof AddAnimalTypeRequest,
        value: string | number,
        allValues: AddAnimalTypeRequest
    ): string | undefined => {
        switch (field) {
            case "typeName":
                if (!String(value).trim()) return "Type name is required.";
                if (String(value).trim().length < 2) return "Type name must be at least 2 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: AddAnimalTypeRequest): AddAnimalTypeRequestFieldErrors => {
        const fieldErrors: AddAnimalTypeRequestFieldErrors = {};
        (Object.keys(values) as (keyof AddAnimalTypeRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const addAnimalTypeHandler = async (values: AddAnimalTypeRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            setErrors({});
            if (!userData) return;

            const payload: AddAnimalTypeRequest = {
                ...values,
                typeName: values.typeName.trim()
            };

            await addAnimalType(payload);

            setDialog({ message: "Animal type added successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/animal-types`), 1500);
        } catch {
            setDialog({ message: "Failed adding animal type.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, addAnimalTypeHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof AddAnimalTypeRequest;

        let parsedValue: string | number | null = value;

        changeValues({ ...values, [fieldName]: parsedValue });

        const valueForValidation = parsedValue ?? "";
        const errorMsg = validateField(fieldName, valueForValidation, { ...values, [fieldName]: parsedValue });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof AddAnimalTypeRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelAddAnimalType();
    }, []);

    useEffect(() => {
        return () => cancelGetAnimalTypes();
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
                    <h1>Add Animal Type</h1>
                    <p>Define a new category for animals</p>
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
                                placeholder="Enter animal type name"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.typeName && <span className={styles.errorMsg}>{errors.typeName}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button
                            type="submit"
                            className={styles.addBtn}
                            disabled={formLoading}
                        >
                            <i className="fa-solid fa-plus"></i> Add
                        </button>

                        <Link
                            to="/staff-area/animal-types"
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

export default AnimalTypesAdd;