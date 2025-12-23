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
        } catch {
            setDialog({ message: "Adding pet failed.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, addAnimalHandler);

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
        if (errors[field]) return `${styles["input"]} ${styles.error}`;
        if (values[field] && !errors[field]) return `${styles["input"]} ${styles.success}`;
        return styles["input"];
    };

    useEffect(() => () => cancelAddAnimal(), []);
    useEffect(() => () => cancelGetAnimalTypes(), []);

    return (
        <>
            {(formLoading || userLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["my-pets-add"]}>
                <div className={styles["my-pets-add-container"]}>
                    <h2>Add New Pet</h2>
                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles["my-pets-add-form-group"]}>
                            <label htmlFor="name"><i className="fa-solid fa-pen"></i> Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={values.name ?? ""}
                                onChange={handleChange}
                                className={inputClass("name")}
                                placeholder="Enter pet's name"
                                autoComplete="off"
                                required
                            />
                            {errors.name && <p className={styles["error-text"]}>{errors.name}</p>}
                        </div>

                        {/* Останалите input полета се повтарят със същия pattern */}
                        <div className={styles["my-pets-add-form-group"]}>
                            <label htmlFor="age"><i className="fa-solid fa-calendar"></i> Age:</label>
                            <input type="number" id="age" name="age" value={values.age ?? ""} onChange={handleChange} className={inputClass("age")} placeholder="Enter pet's age (optional)" />
                            {errors.age && <p className={styles["error-text"]}>{errors.age}</p>}
                        </div>

                        <div className={styles["my-pets-add-form-group"]}>
                            <label htmlFor="weight"><i className="fa-solid fa-weight"></i> Weight:</label>
                            <input type="number" id="weight" name="weight" value={values.weight ?? ""} onChange={handleChange} className={inputClass("weight")} placeholder="Enter pet's weight" required />
                            {errors.weight && <p className={styles["error-text"]}>{errors.weight}</p>}
                        </div>

                        <div className={styles["my-pets-add-form-group"]}>
                            <label htmlFor="passportNumber"><i className="fa-solid fa-passport"></i> Passport Number:</label>
                            <input type="text" id="passportNumber" name="passportNumber" value={values.passportNumber ?? ""} onChange={handleChange} className={inputClass("passportNumber")} placeholder="Enter pet's passport number (optional)" />
                            {errors.passportNumber && <p className={styles["error-text"]}>{errors.passportNumber}</p>}
                        </div>

                        <div className={styles["my-pets-add-form-group"]}>
                            <label htmlFor="chipNumber"><i className="fa-solid fa-microchip"></i> Chip Number:</label>
                            <input type="text" id="chipNumber" name="chipNumber" value={values.chipNumber ?? ""} onChange={handleChange} className={inputClass("chipNumber")} placeholder="Enter pet's chip number (optional)" />
                            {errors.chipNumber && <p className={styles["error-text"]}>{errors.chipNumber}</p>}
                        </div>

                        <div className={styles["my-pets-add-form-group"]}>
                            <label htmlFor="animalTypeId"><i className="fa-solid fa-paw"></i> Animal Type:</label>
                            <select id="animalTypeId" name="animalTypeId" value={values.animalTypeId} onChange={handleChange} className={inputClass("animalTypeId")} required>
                                <option value={0}>-- Select animal type --</option>
                                {animalTypes.map(type => <option key={type.id} value={type.id}>{type.value}</option>)}
                            </select>
                            {errors.animalTypeId && <p className={styles["error-text"]}>{errors.animalTypeId}</p>}
                        </div>

                        <button type="submit" className={styles["add-pet-btn"]} disabled={formLoading}>Add</button>
                        <Link to="/my-pets" className={styles["cancel-add-pet-btn"]}>Cancel</Link>
                    </form>
                </div>

                {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}
            </section>
        </>
    );
};

export default MyPetsAdd;