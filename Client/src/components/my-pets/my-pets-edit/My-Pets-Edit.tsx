import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { AnimalType, EditAnimalFieldErrors, EditAnimalRequest } from "../../../types";
import { useGetAnimalTypes } from "../../../api/animalTypesAPI";
import { useForm } from "../../../hooks/useForm";
import { useGetUserData } from "../../../hooks/useGetUserData";
import { useEditAnimal, useGetAnimalDetails } from "../../../api/animalsAPI";
import Dialog from "../../dialog/Dialog";
import Spinner from "../../spinner/Spinner";
import styles from "./My-Pets-Edit.module.css";

const initialValues: EditAnimalRequest = {
    id: 0,
    name: "",
    age: null,
    weight: 1,
    passportNumber: null,
    chipNumber: null,
    animalTypeId: 0,
};

const MyPetsEdit: React.FC = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState<EditAnimalFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);

    const { isLoading: userLoading } = useGetUserData();
    const { getAnimalDetails, cancelGetAnimalDetails } = useGetAnimalDetails();
    const { editAnimal, cancelEditAnimal } = useEditAnimal();
    const { getAnimalTypes, cancelGetAnimalTypes } = useGetAnimalTypes();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimalTypes = async () => {
            try {
                const types = await getAnimalTypes();
                setAnimalTypes(types || []);
            } catch {
                setDialog({ message: "An error occurred while fetching animal types.", type: "error" });
            }
        };
        fetchAnimalTypes();
        return () => cancelGetAnimalTypes();
    }, []);

    const validateField = (
        field: keyof EditAnimalRequest,
        value: string | number,
        allValues: EditAnimalRequest
    ): string | undefined => {
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

    const validate = (values: EditAnimalRequest): EditAnimalFieldErrors => {
        const fieldErrors: EditAnimalFieldErrors = {};
        (Object.keys(values) as (keyof EditAnimalRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const editAnimalHandler = async (values: EditAnimalRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            const payload: EditAnimalRequest = {
                ...values,
                id: Number(id),
                age: values.age ?? null,
                passportNumber: values.passportNumber?.trim() === "" ? null : values.passportNumber,
                chipNumber: values.chipNumber?.trim() === "" ? null : values.chipNumber,
            };
            await editAnimal(payload);
            setDialog({ message: "Pet edited successfully!", type: "success" });
            setTimeout(() => navigate(`/my-pets/${id}/details`), 1500);
        } catch (error: any) {
            setDialog({ message: "Editing pet failed.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeValues, onSubmit } = useForm(initialValues, editAnimalHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof EditAnimalRequest;
        let parsedValue: string | number | null = value;
        if (type === "number") parsedValue = value === "" ? null : Number(value);
        else if (fieldName === "animalTypeId") parsedValue = value === "" ? 0 : Number(value);

        changeValues({ ...values, [fieldName]: parsedValue });
        const errorMsg = validateField(fieldName, parsedValue ?? "", { ...values, [fieldName]: parsedValue });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof EditAnimalRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => cancelEditAnimal, []);

    useEffect(() => {
        if (!id) return;
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const details = await getAnimalDetails(Number(id));
                if (details) {
                    const mapped: EditAnimalRequest = {
                        id: Number(id),
                        name: details.name,
                        age: details.age,
                        weight: details.weight,
                        passportNumber: details.passportNumber,
                        chipNumber: details.chipNumber,
                        animalTypeId: animalTypes.find(t => t.value === details.animalType)?.id ?? 0,
                    };
                    changeValues(mapped);
                }
            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching animal details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
        return () => cancelGetAnimalDetails();
    }, [id, animalTypes]);

    return (
        <div className={styles.pageContainer}>
            {(formLoading || userLoading || isLoading) && (
                <div className={styles.spinnerOverlay}><Spinner /></div>
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
                    <h1>Edit Pet</h1>
                    <p>Update your pet's details below</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                            <input
                                id="name"
                                name="name"
                                type="text"
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
                                    id="age"
                                    name="age"
                                    type="number"
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
                                    id="weight"
                                    name="weight"
                                    type="number"
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
                                <option value={0}>-- Select Type --</option>
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
                                id="passportNumber"
                                name="passportNumber"
                                type="text"
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
                                id="chipNumber"
                                name="chipNumber"
                                type="text"
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
                            <i className="fa-solid fa-check"></i> Save Changes
                        </button>
                        <Link to={`/my-pets/${id}/details`} className={styles.cancelBtn}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default MyPetsEdit;