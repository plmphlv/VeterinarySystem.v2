import type React from "react";
import { useEffect, useState } from "react";
import type { AddAnimalFieldErrors, AddAnimalRequest, AnimalType } from "../../../types";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { useGetAnimalTypes } from "../../../api/animalTypesAPI";
import { useAddAnimal } from "../../../api/animalsAPI";
import { Link, useNavigate } from "react-router";
import Spinner from "../../spinner/Spinner";
import Dialog from "../../dialog/Dialog";
import { useForm } from "../../../hooks/useForm";
import styles from "./My-Pets-Add.module.css";

const initialValues: AddAnimalRequest = {
    name: "",
    age: null,
    weight: null,
    passportNumber: null,
    chipNumber: null,
    animalTypeId: 0,
    ownerId: ""
};

const MyPetsAdd: React.FC = () => {
    const [errors, setErrors] = useState<AddAnimalFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { addAnimal, cancelAddAnimal } = useAddAnimal();
    const { getAnimalTypes, cancelGetAnimalTypes } = useGetAnimalTypes();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimalTypes = async () => {
            try {
                setErrors({});
                const types = await getAnimalTypes();
                setAnimalTypes(types || []);
            } catch {
                setDialog({ message: "An error occurred while fetching animal types.", type: "error" });
                setTimeout(() => navigate(`/my-pets`), 1500);
            }
        };
        fetchAnimalTypes();
        return () => cancelGetAnimalTypes();
    }, []);

    const validateField = (field: keyof AddAnimalRequest, value: string | number, allValues: AddAnimalRequest): string | undefined => {
        switch (field) {
            case "name":
                if (!String(value).trim()) return "Name is required.";
                if (String(value).trim().length < 2) return "Name must be at least 2 characters.";
                return undefined;
            case "age":
                if (value !== "" && value !== null && value !== undefined) {
                    const num = Number(value);
                    if (isNaN(num)) return "Age must be a number.";
                    if (num <= 0) return "Age must be greater than 0.";
                }
                return undefined;
            case "weight":
                if (value === "" || value === null || value === undefined) return "Weight is required.";
                if (Number(value) <= 0) return "Weight must be greater than 0.";
                return undefined;
            case "passportNumber":
                if (String(value).trim().length > 0 && String(value).trim().length < 2) return "Passport number must be at least 2 characters.";
                return undefined;
            case "chipNumber":
                if (String(value).trim().length > 0 && String(value).trim().length < 2) return "Chip number must be at least 2 characters.";
                return undefined;
            case "animalTypeId":
                if (Number(value) <= 0) return "Please select an animal type.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: AddAnimalRequest): AddAnimalFieldErrors => {
        const fieldErrors: AddAnimalFieldErrors = {};
        (Object.keys(values) as (keyof AddAnimalRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const addAnimalHandler = async (values: AddAnimalRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            if (!userData) return;

            const payload: AddAnimalRequest = {
                ...values,
                ownerId: userData.id,
                age: values.age ?? null,
                passportNumber: values.passportNumber?.trim() === "" ? null : values.passportNumber,
                chipNumber: values.chipNumber?.trim() === "" ? null : values.chipNumber,
            };

            await addAnimal(payload);

            setDialog({ message: "Pet added successfully!", type: "success" });
            setTimeout(() => navigate(`/my-pets`), 1500);
        } catch (error: any) {
            const status = error?.status || error?.response?.status;
            const message =
                error?.message ||
                error?.response?.data?.message ||
                "An unexpected error occurred.";

            if (status === 400) {
                if (message.toLowerCase().includes("passport")) {
                    setErrors(prev => ({
                        ...prev,
                        passportNumber: message
                    }));
                } else if (message.toLowerCase().includes("chip")) {
                    setErrors(prev => ({
                        ...prev,
                        chipNumber: message
                    }));
                } else {
                    setDialog({ message, type: "error" });
                }
                return;
            }

            setDialog({
                message: "Server error. Please try again later.",
                type: "error"
            });

        } finally {
            setFormLoading(false);
        }
    };

    const { values, onSubmit, changeValues } = useForm(initialValues, addAnimalHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof AddAnimalRequest;

        let parsedValue: string | number | null = value;
        if (type === "number") parsedValue = value === "" ? null : Number(value);
        else if (fieldName === "animalTypeId") parsedValue = value === "" ? 0 : Number(value);

        changeValues({ ...values, [fieldName]: parsedValue });

        const errorMsg = validateField(fieldName, parsedValue ?? "", { ...values, [fieldName]: parsedValue });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof AddAnimalRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => () => cancelAddAnimal(), []);

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
                        <i className="fa-solid fa-paw"></i>
                    </div>
                    <h1 className={styles.title}>Add a Pet</h1>
                    <p className={styles.subtitle}>Enter your pet's details below</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={values.name ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("name")}`}
                                placeholder="Enter pet's name"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="age">Age</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-calendar-days ${styles.inputIcon}`}></i>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={values.age ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("age")}`}
                                    placeholder="Optional"
                                />
                            </div>
                            {errors.age && <span className={styles.errorMsg}>{errors.age}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="weight">Weight (kg)</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-weight-scale ${styles.inputIcon}`}></i>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={values.weight ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("weight")}`}
                                    placeholder="Required"
                                    required
                                />
                            </div>
                            {errors.weight && <span className={styles.errorMsg}>{errors.weight}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="animalTypeId">Animal Type</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-tag ${styles.inputIcon}`}></i>
                            <select
                                id="animalTypeId"
                                name="animalTypeId"
                                value={values.animalTypeId}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.selectInput} ${inputClass("animalTypeId")}`}
                                required
                            >
                                {animalTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.value}</option>
                                ))}
                            </select>
                        </div>
                        {errors.animalTypeId && <span className={styles.errorMsg}>{errors.animalTypeId}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="passportNumber">Passport Number</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-passport ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="passportNumber"
                                name="passportNumber"
                                value={values.passportNumber ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("passportNumber")}`}
                                placeholder="Optional"
                            />
                        </div>
                        {errors.passportNumber && <span className={styles.errorMsg}>{errors.passportNumber}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="chipNumber">Chip Number</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-microchip ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="chipNumber"
                                name="chipNumber"
                                value={values.chipNumber ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("chipNumber")}`}
                                placeholder="Optional"
                            />
                        </div>
                        {errors.chipNumber && <span className={styles.errorMsg}>{errors.chipNumber}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button type="submit" className={styles.submitBtn} disabled={formLoading}>
                            <i className="fa-solid fa-plus"></i> Add Pet
                        </button>
                        <Link to="/my-pets" className={styles.cancelBtn}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default MyPetsAdd;