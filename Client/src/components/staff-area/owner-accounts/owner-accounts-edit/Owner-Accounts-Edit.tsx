import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { EditOwnerAccountFieldErrors, EditOwnerAccountRequest, } from "../../../../types";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Owner-Accounts-Edit.module.css";
import { useEditOwnerAccount, useGetOwnerAccountDetails } from "../../../../api/ownerAccountsAPI";

const initialValues: EditOwnerAccountRequest = {
    firstName: "",
    lastName: "",
    address: null,
    phoneNumber: "",
    id: ""
};

const OwnerAccountsEdit: React.FC = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState<EditOwnerAccountFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { getOwnerAccountDetails, cancelGetOwnerAccountDetails } = useGetOwnerAccountDetails();
    const { editOwnerAccount, cancelEditOwnerAccount } = useEditOwnerAccount();
    const navigate = useNavigate();

    const validateField = (
        field: keyof EditOwnerAccountRequest,
        value: string,
        allValues: EditOwnerAccountRequest
    ): string | undefined => {
        const phoneRegex = /^(?:\+\d(?: ?\d){11}|\d(?: ?\d){9})$/;

        switch (field) {
            case "firstName":
                if (!value.trim()) return "First name is required.";
                if (value.length < 2) return "First name must be at least 2 characters.";
                return undefined;
            case "lastName":
                if (!value.trim()) return "Last name is required.";
                if (value.length < 2) return "Last name must be at least 2 characters.";
                return undefined;
            case "phoneNumber":
                if (!value.trim()) return "Phone number is required.";
                if (!phoneRegex.test(value)) return "Phone number must be between 10 and 16 digits.";
                return undefined;
            case "address":
                if (value?.length > 0 && value?.length < 2) return "Address must be at least 2 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: EditOwnerAccountRequest): Partial<Record<keyof EditOwnerAccountRequest, string>> => {
        const fieldErrors: Partial<Record<keyof EditOwnerAccountRequest, string>> = {};
        (Object.keys(values) as (keyof EditOwnerAccountRequest)[]).forEach(field => {
            const fieldValue = values[field] ?? "";
            const error = validateField(field, fieldValue, values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const editOwnerAccountHandler = async (values: EditOwnerAccountRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);

        if (!id) {
            return;
        }

        try {
            const payload: EditOwnerAccountRequest = {
                ...values,
                id: id,
                address: values.address?.trim() === "" ? null : values.address
            };

            await editOwnerAccount(payload);
            setDialog({ message: "Owner account is edited successfully!", type: "success" });
            setTimeout(() => navigate(`/staff-area/owner-accounts/${id}/details`), 1500);
        } catch (err) {
            setDialog({ message: "Failed editing owner account.", type: "error" });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, editOwnerAccountHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof EditOwnerAccountRequest;

        changeValues({ ...values, [fieldName]: value });

        const errorMsg = validateField(fieldName, value, { ...values, [fieldName]: value });
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg || undefined }));
    };

    const inputClass = (field: keyof EditOwnerAccountRequest) => {
        if (errors[field]) return styles.error;
        if (values[field] && !errors[field]) return styles.success;
        return "";
    };

    useEffect(() => cancelEditOwnerAccount, []);

    useEffect(() => {
        if (!id) return;

        const fetchOwnerAccountDetails = async () => {
            try {
                setLoading(true);
                const ownerAccountDetails = await getOwnerAccountDetails(id);

                if (ownerAccountDetails) {
                    changeValues({
                        id: ownerAccountDetails.id,
                        firstName: ownerAccountDetails.firstName || "",
                        lastName: ownerAccountDetails.lastName || "",
                        phoneNumber: ownerAccountDetails.phoneNumber || "",
                        address: ownerAccountDetails.address || "",
                    });
                }
            } catch (err: any) {
                setDialog({ message: err.title || "An error occurred while fetching appointment details.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchOwnerAccountDetails();
        return () => cancelGetOwnerAccountDetails();
    }, [id]);
    return (
        <>
            {(isLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <h1 className={styles["owner-accounts-edit-h1"]}>
                Edit Profile
            </h1>

            {id ? (
                <div className={styles["owner-accounts-edit-container"]}>
                    <div className={styles["owner-accounts-edit-card"]}>
                        <form onSubmit={onSubmit} noValidate>
                            {([
                                {
                                    name: "firstName",
                                    label: "First Name",
                                    type: "text",
                                    icon: "fa-pen",
                                    placeholder: "Enter your first name",
                                },
                                {
                                    name: "lastName",
                                    label: "Last Name",
                                    type: "text",
                                    icon: "fa-pen",
                                    placeholder: "Enter your last name",
                                },
                                {
                                    name: "phoneNumber",
                                    label: "Phone Number",
                                    type: "tel",
                                    icon: "fa-phone",
                                    placeholder:
                                        "Enter your phone number",
                                },
                                {
                                    name: "address",
                                    label: "Address (Optional)",
                                    type: "text",
                                    icon: "fa-map-marker-alt",
                                    placeholder:
                                        "Enter your address",
                                },
                            ] as const).map(
                                ({
                                    name,
                                    label,
                                    type,
                                    icon,
                                    placeholder,
                                }) => (
                                    <div
                                        className={
                                            styles[
                                            "owner-accounts-edit-field"
                                            ]
                                        }
                                        key={name}
                                    >
                                        <label htmlFor={name}>
                                            <i
                                                className={`fa-solid ${icon}`}
                                            ></i>{" "}
                                            {label}:
                                        </label>

                                        <input
                                            type={type}
                                            id={name}
                                            name={name}
                                            value={values[name] ?? ""}
                                            onChange={handleChange}
                                            className={inputClass(name)}
                                            placeholder={placeholder}
                                            autoComplete="off"
                                            required={
                                                name !== "address"
                                            }
                                        />

                                        {errors[name] && (
                                            <p
                                                className={
                                                    styles["error-text"]
                                                }
                                            >
                                                {errors[name]}
                                            </p>
                                        )}
                                    </div>
                                )
                            )}

                            <div
                                className={
                                    styles["owner-accounts-edit-btns"]
                                }
                            >
                                <button
                                    className={
                                        styles[
                                        "owner-accounts-edit-save-btn"
                                        ]
                                    }
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    Save
                                </button>

                                <Link to={`/staff-area/owner-accounts/${id}/details`} className={styles["owner-accounts-edit-cancel-btn"]}>Cancel</Link>
                            </div>

                            {dialog && (
                                <Dialog
                                    message={dialog.message}
                                    type={dialog.type}
                                    onClose={() => setDialog(null)}
                                />
                            )}
                        </form>
                    </div>
                </div>
            ) : !isLoading && !id ? (
                <p className={styles["owner-accounts-edit-no-user-data"]}>No user data found.</p>
            ) : null}
        </>
    );
};

export default OwnerAccountsEdit;