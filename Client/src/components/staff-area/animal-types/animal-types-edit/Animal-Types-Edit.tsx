import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { AnimalType, EditAnimalTypeRequest, EditAnimalTypeRequestFieldErrors } from "../../../../types";
import { useEditAnimalType, useGetAnimalTypes } from "../../../../api/animalTypesAPI";
import { useForm } from "../../../../hooks/useForm";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import Dialog from "../../../dialog/Dialog";
import Spinner from "../../../spinner/Spinner";

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
    const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { getAnimalTypes, cancelGetAnimalTypes } = useGetAnimalTypes();
    const { editAnimalType, cancelEditAnimalType } = useEditAnimalType();
    const navigate = useNavigate();

    useEffect(() => {
    const fetchAnimalTypes = async () => {
        setLoading(true);

        const types = await getAnimalTypes();
        const current = types?.find(t => t.id === Number(id));

        if (current) {
            changeValues({
                id: current.id,
                typeName: current.value,
            });
        }

        setLoading(false);
    };

    fetchAnimalTypes();
}, [id]);


    const validateField = (
        field: keyof EditAnimalTypeRequest,
        value: string | number,
        allValues: EditAnimalTypeRequest
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

    const validate = (values: EditAnimalTypeRequest): EditAnimalTypeRequestFieldErrors => {
        const fieldErrors: EditAnimalTypeRequestFieldErrors = {};
        (Object.keys(values) as (keyof EditAnimalTypeRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const editAnimalTypeHandler = async (values: EditAnimalTypeRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        
        try {
            const payload: EditAnimalTypeRequest = {
                ...values,
                id: Number(id),
                typeName: values.typeName.trim()
            };

            console.log(payload);
            
            await editAnimalType(payload);            

            setDialog({ message: "Animal type name edited successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/animal-types`), 1500);
        } catch (err) {
            setDialog({ message: "Failed editing animal type name.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, editAnimalTypeHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const fieldName = name as keyof EditAnimalTypeRequest;

        const parsedValue = value;

        // if (type === "number") {
        //     parsedValue = value === "" ? null : Number(value);
        // } else if (fieldName === "id") {
        //     parsedValue = value === "" ? 0 : Number(value);
        // }

        changeValues({ ...values, [fieldName]: parsedValue });

        const valueForValidation = parsedValue ?? "";
        const errorMsg = validateField(fieldName, valueForValidation, { ...values, [fieldName]: parsedValue });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof EditAnimalTypeRequest) => {
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => cancelEditAnimalType, []);

    return (
        <>
            {(formLoading || userLoading || isLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className="my-pets-add">
                <div className="my-pets-add-container">
                    <h2>Edit Animal Type</h2>
                    <form onSubmit={onSubmit} noValidate>
                        <div className="my-pets-add-form-group">
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
                                placeholder="Edit type name"
                                autoComplete="off"
                                required
                            />
                            {errors.typeName && <p className="error-text">{errors.typeName}</p>}
                        </div>

                        <button type="submit" className="add-pet-btn" disabled={formLoading}>
                            Save
                        </button>
                        <Link to={`/staff-area/animal-types`} className="cancel-btn">Cancel</Link>
                    </form>
                </div>
            </section>

            {dialog && (
                <Dialog
                    message={dialog.message}
                    type={dialog.type}
                    onClose={() => setDialog(null)}
                />
            )}
        </>
    );
};

export default AnimalTypesEdit;
