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

    const { userData, isLoading: userLoading } = useGetUserData();
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
        } catch {
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
        if (errors[field]) return `${styles["input"]} ${styles.error}`;
        if (values[field] && !errors[field]) return `${styles["input"]} ${styles.success}`;
        return styles["input"];
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
                console.log(err);
                setDialog({ message: err.title || "An error occurred while fetching animal details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
        return () => cancelGetAnimalDetails();
    }, [id, animalTypes]);

    return (
        <>
            {(formLoading || userLoading || isLoading) && (
                <div className="spinner-overlay"><Spinner /></div>
            )}

            <section className={styles["my-pets-edit"]}>
                <div className={styles["my-pets-edit-container"]}>
                    <h2>Edit Pet</h2>
                    <form onSubmit={onSubmit} noValidate>
                        {["name", "age", "weight", "passportNumber", "chipNumber"].map(field => (
                            <div className={styles["my-pets-edit-form-group"]} key={field}>
                                <label htmlFor={field}>{field === "name" ? "Name:" : field.charAt(0).toUpperCase() + field.slice(1) + ":"}</label>
                                <input
                                    id={field}
                                    name={field}
                                    type={field === "age" || field === "weight" ? "number" : "text"}
                                    value={values[field as keyof EditAnimalRequest] ?? ""}
                                    onChange={handleChange}
                                    className={inputClass(field as keyof EditAnimalRequest)}
                                    placeholder={`Enter new pet's ${field}`}
                                />
                                {errors[field as keyof EditAnimalRequest] && <p className={styles["error-text"]}>{errors[field as keyof EditAnimalRequest]}</p>}
                            </div>
                        ))}

                        <div className={styles["my-pets-edit-form-group"]}>
                            <label htmlFor="animalTypeId">Animal Type:</label>
                            <select
                                id="animalTypeId"
                                name="animalTypeId"
                                value={values.animalTypeId}
                                onChange={handleChange}
                                className={inputClass("animalTypeId")}
                                required
                            >
                                <option value={0}>-- Select new animal type --</option>
                                {animalTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.value}</option>
                                ))}
                            </select>
                            {errors.animalTypeId && <p className={styles["error-text"]}>{errors.animalTypeId}</p>}
                        </div>

                        <button type="submit" className={styles["my-pets-edit-pet-btn"]} disabled={formLoading}>Save</button>
                        <Link to={`/my-pets/${id}/details`} className={styles["my-pets-edit-cancel-btn"]}>Cancel</Link>
                    </form>
                </div>
            </section>

            {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}
        </>
    );
};

export default MyPetsEdit;