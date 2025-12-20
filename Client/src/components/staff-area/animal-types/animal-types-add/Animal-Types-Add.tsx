import type React from "react";
import { useEffect, useState } from "react";
import type { AddAnimalTypeRequest, AddAnimalTypeRequestFieldErrors, AnimalType } from "../../../../types";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { useAddAnimalType, useGetAnimalTypes } from "../../../../api/animalTypesAPI";
import { Link, useNavigate } from "react-router";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";

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
            } finally {

            }
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
            if (!userData) {
                return;
            }

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
        const { name, value, type } = e.target;
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
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => {
        return () => {
            cancelAddAnimalType();
        };
    }, []);

    useEffect(() => {
        return () => {
            cancelGetAnimalTypes();
        };
    }, []);

    return (
        <>
            {(formLoading || userLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className="animal-types-add">
                <div className="animal-types-add-container">
                    <h2>Add Animal Type</h2>
                    <form onSubmit={onSubmit} noValidate>
                        <div className="animal-types-add-form-group">
                            <label htmlFor="typeName">
                                <i className="fa-solid fa-pen"></i> Type Name:
                            </label>
                            <input
                                type="text"
                                id="typeName"
                                name="typeName"
                                value={values.typeName ?? ""}
                                onChange={handleChange}
                                className={inputClass("typeName")}
                                placeholder="Enter animal type name"
                                autoComplete="off"
                                required
                            />
                            {errors.typeName && <p className="error-text">{errors.typeName}</p>}
                        </div>

                        <button type="submit" className="animal-types-add-btn" disabled={formLoading}>
                            Add
                        </button>
                        <Link to="/staff-area/animal-types" className="animal-types-add-cancel-btn">Cancel</Link>
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

export default AnimalTypesAdd;
