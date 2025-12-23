import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { AnimalType, EditAnimalTypeRequest, EditAnimalTypeRequestFieldErrors } from "../../../../types";
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

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, async (values) => {
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
    });

    useEffect(() => {
        const fetchAnimalTypes = async () => {
            setLoading(true);
            const types = await getAnimalTypes();
            const current = types?.find(t => t.id === Number(id));
            if (current) {
                changeValues({ id: current.id, typeName: current.value });
            }
            setLoading(false);
        };
        fetchAnimalTypes();
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
        if (errors[field]) return styles.error;
        if (values[field] && !errors[field]) return styles.success;
        return "";
    };

    useEffect(() => cancelEditAnimalType, []);

    return (
        <>
            {(formLoading || userLoading || isLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["animal-types-edit"]}>
                <div className={styles["animal-types-edit-container"]}>
                    <h2>Edit Animal Type</h2>
                    <form onSubmit={onSubmit} noValidate>
                        <div className={styles["animal-types-edit-form-group"]}>
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
                            {errors.typeName && <p className={styles["error-text"]}>{errors.typeName}</p>}
                        </div>

                        <button type="submit" className={styles["animal-types-edit-save-btn"]} disabled={formLoading}>
                            Save
                        </button>
                        <Link to={`/staff-area/animal-types`} className={styles["animal-types-edit-cancel-btn"]}>
                            Cancel
                        </Link>
                    </form>
                </div>

                {dialog && <Dialog message={dialog.message} type={dialog.type} onClose={() => setDialog(null)} />}
            </section>
        </>
    );
};

export default AnimalTypesEdit;