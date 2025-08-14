import type React from "react";
import Spinner from "../spinner/Spinner";
import { Link, useNavigate } from "react-router";
import Dialog from "../dialog/Dialog";
import type { AddAnimalFieldErrors, AddAnimalRequest } from "../../types";
import { useEffect, useState } from "react";
import { useAddAnimal } from "../../api/animalsAPI";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useForm } from "../../hooks/useForm";

const initialValues: AddAnimalRequest = {
    name: "",
    age: undefined as unknown as number,
    weight: undefined as unknown as number,
    passportNumber: "",
    chipNumber: "",
    animalTypeId: 0,
    ownerId: ""
};

// TODO: Take the animal types dynamic from the database:
const animalTypes = [
    { id: 1, label: "Cat" },
    { id: 2, label: "Dog" },
    { id: 3, label: "Parrot" },
    { id: 4, label: "Bird" },
    { id: 5, label: "Livestock" },
    { id: 6, label: "Transportation Animal" },
    { id: 7, label: "Other mammal" }
];

const MyPetsAdd: React.FC = () => {
    const [errors, setErrors] = useState<AddAnimalFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { addAnimal, cancelAddAnimal } = useAddAnimal();
    const navigate = useNavigate();

    const validateField = (
        field: keyof AddAnimalRequest,
        value: string | number,
        allValues: AddAnimalRequest
    ): string | undefined => {
        switch (field) {
            case "name":
                if (!String(value).trim()) return "Name is required.";
                if (String(value).length < 2) return "Name must be at least 2 characters.";
                return undefined;
            case "age":
                if (value === "" || value === null || value === undefined) return "Age is required.";
                if (Number(value) < 0) return "Age cannot be negative.";
                return undefined;
            case "weight":
                if (value === "" || value === null || value === undefined) return "Weight is required.";
                if (Number(value) <= 0) return "Weight must be greater than 0.";
                return undefined;
            case "passportNumber":
                if (!String(value).trim()) return "Passport number is required.";
                return undefined;
            case "chipNumber":
                if (!String(value).trim()) return "Chip number is required.";
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
            const error = validateField(field, values[field], values);
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
            setErrors({});
            const payload: AddAnimalRequest = {
                ...values,
                ownerId: userData?.id || ""
            };
            
            await addAnimal(payload);

            setDialog({ message: "Pet added successfully!", type: "success" });
            setTimeout(() => {
                navigate("/my-pets");
            }, 500);
        } catch {
            setDialog({ message: "Adding pet failed.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, addAnimalHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let parsedValue: string | number = value;

        if ((type === "number" || name === "animalTypeId") && value !== "") {
            parsedValue = Number(value);
        }

        changeValues({ ...values, [name]: parsedValue });

        const fieldName = name as keyof AddAnimalRequest;
        const errorMsg = validateField(fieldName, parsedValue, { ...values, [name]: parsedValue });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof AddAnimalRequest) => {
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => {
        return () => {
            cancelAddAnimal();
        };
    }, []);

    return (
        <>
            {(formLoading || userLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className="my-pets-add">
                <div className="my-pets-add-container">
                    <h2>Add New Pet</h2>
                    <form onSubmit={onSubmit} noValidate>
                        <div className="my-pets-add-form-group">
                            <label htmlFor="name">
                                <i className="fa-solid fa-pen"></i> Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                className={inputClass("name")}
                                placeholder="Enter pet's name"
                                autoComplete="off"
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>

                        <div className="my-pets-add-form-group">
                            <label htmlFor="age">
                                <i className="fa-solid fa-calendar"></i> Age:
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={values.age ?? ""}
                                onChange={handleChange}
                                className={inputClass("age")}
                                placeholder="Enter pet's age"
                            />
                            {errors.age && <p className="error-text">{errors.age}</p>}
                        </div>

                        <div className="my-pets-add-form-group">
                            <label htmlFor="weight">
                                <i className="fa-solid fa-weight"></i> Weight:
                            </label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={values.weight ?? ""}
                                onChange={handleChange}
                                className={inputClass("weight")}
                                placeholder="Enter pet's weight"
                            />
                            {errors.weight && <p className="error-text">{errors.weight}</p>}
                        </div>

                        <div className="my-pets-add-form-group">
                            <label htmlFor="passportNumber">
                                <i className="fa-solid fa-passport"></i> Passport Number:
                            </label>
                            <input
                                type="text"
                                id="passportNumber"
                                name="passportNumber"
                                value={values.passportNumber}
                                onChange={handleChange}
                                className={inputClass("passportNumber")}
                                placeholder="Enter pet's passport number"
                            />
                            {errors.passportNumber && <p className="error-text">{errors.passportNumber}</p>}
                        </div>

                        <div className="my-pets-add-form-group">
                            <label htmlFor="chipNumber">
                                <i className="fa-solid fa-microchip"></i> Chip Number:
                            </label>
                            <input
                                type="text"
                                id="chipNumber"
                                name="chipNumber"
                                value={values.chipNumber}
                                onChange={handleChange}
                                className={inputClass("chipNumber")}
                                placeholder="Enter pet's chip number"
                            />
                            {errors.chipNumber && <p className="error-text">{errors.chipNumber}</p>}
                        </div>

                        <div className="my-pets-add-form-group">
                            <label htmlFor="animalTypeId">
                                <i className="fa-solid fa-paw"></i> Animal Type:
                            </label>
                            <select
                                id="animalTypeId"
                                name="animalTypeId"
                                value={values.animalTypeId}
                                onChange={handleChange}
                                className={inputClass("animalTypeId")}
                            >
                                <option value={0}>-- Select animal type --</option>
                                {animalTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.animalTypeId && <p className="error-text">{errors.animalTypeId}</p>}
                        </div>

                        <button type="submit" className="add-pet-btn" disabled={formLoading}>
                            Add Pet
                        </button>
                        <Link to="/my-pets" className="cancel-btn">Cancel</Link>
                    </form>
                </div>

                {dialog && (
                    <Dialog
                        message={dialog.message}
                        type={dialog.type}
                        onClose={() => setDialog(null)}
                    />
                )}
            </section>
        </>
    );
};

export default MyPetsAdd;
