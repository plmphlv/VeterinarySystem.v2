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

const initialValues: EditAnimalRequest = {
    id: 0,
    name: "",
    age: 0,
    weight: 0,
    passportNumber: "",
    chipNumber: "",
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
    const { getAnimalTypes, cancelGetAnimalTypes } = useGetAnimalTypes()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimalTypes = async () => {
            try {
                const animalTypes = await getAnimalTypes();
                setAnimalTypes(animalTypes || []);
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

    const validate = (values: EditAnimalRequest): EditAnimalFieldErrors => {
        const fieldErrors: EditAnimalFieldErrors = {};
        (Object.keys(values) as (keyof EditAnimalRequest)[]).forEach(field => {
            const error = validateField(field, values[field], values);
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
            };

            await editAnimal(payload);

            setDialog({ message: "Pet updated successfully!", type: "success" });
            setTimeout(() => navigate(`/my-pets/${id}/info`), 1000);
        } catch {
            setDialog({ message: "Updating pet failed.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, editAnimalHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let parsedValue: string | number = value;
        if ((type === "number" || name === "animalTypeId") && value !== "") {
            parsedValue = Number(value);
        }

        changeValues({ ...values, [name]: parsedValue });

        const fieldName = name as keyof EditAnimalRequest;
        const errorMsg = validateField(fieldName, parsedValue, { ...values, [name]: parsedValue });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof EditAnimalRequest) => {
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => cancelEditAnimal, []);

    useEffect(() => {
        if (!id) return;

        const fetchAnimalDetails = async () => {
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
                        animalTypeId: findAnimalTypeId(details.animalType),
                    };
                    changeValues(mapped);
                }
            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching animal details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchAnimalDetails();
        return () => cancelGetAnimalDetails();
    }, [id, animalTypes]);


    const findAnimalTypeId = (typeName: string): number => {
        const found = animalTypes.find(t => t.value === typeName);
        return found ? found.id : 0;
    };

    return (
        <>
            {(formLoading || userLoading || isLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className="my-pets-add">
                <div className="my-pets-add-container">
                    <h2>Edit Pet</h2>
                    <form onSubmit={onSubmit} noValidate>
                        {/* Inputs */}
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
                                        {type.value}
                                    </option>
                                ))}
                            </select>
                            {errors.animalTypeId && <p className="error-text">{errors.animalTypeId}</p>}
                        </div>

                        <button type="submit" className="add-pet-btn" disabled={formLoading}>
                            Save
                        </button>
                        <Link to={`/my-pets/${id}/info`} className="cancel-btn">Cancel</Link>
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

export default MyPetsEdit;
