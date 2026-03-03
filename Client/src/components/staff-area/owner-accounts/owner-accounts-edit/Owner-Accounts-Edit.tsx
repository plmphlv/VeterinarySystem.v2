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
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
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
        <div className={styles.pageContainer}>
            {(isLoading || formLoading) && (
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

            {id ? (
                <article className={styles.card}>
                    <header className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                            <i className="fa-solid fa-user-pen"></i>
                        </div>
                        <h1 className={styles.title}>Edit an Owner Account</h1>
                        <p className={styles.subtitle}>Update client information</p>
                    </header>

                    <form onSubmit={onSubmit} noValidate className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="firstName">First Name</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={values.firstName ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("firstName")}`}
                                    placeholder="Enter first name"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="lastName">Last Name</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-file-signature ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={values.lastName ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("lastName")}`}
                                    placeholder="Enter last name"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-phone ${styles.inputIcon}`}></i>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={values.phoneNumber ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("phoneNumber")}`}
                                    placeholder="Enter phone number"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            {errors.phoneNumber && <span className={styles.errorMsg}>{errors.phoneNumber}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="address">Address (Optional)</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-map-marker-alt ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={values.address ?? ""}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("address")}`}
                                    placeholder="Enter address"
                                    autoComplete="off"
                                />
                            </div>
                            {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
                        </div>

                        <div className={styles.actionGroup}>
                            <button
                                type="submit"
                                className={styles.saveBtn}
                                disabled={isLoading || formLoading}
                            >
                                <i className="fa-solid fa-check"></i> Save
                            </button>

                            <Link
                                to={`/staff-area/owner-accounts/${id}/details`}
                                className={styles.cancelBtn}
                            >
                                <i className="fa-solid fa-xmark"></i> Cancel
                            </Link>
                        </div>
                    </form>
                </article>
            ) : (
                !isLoading && !id && <p className={styles.noData}>No user data found.</p>
            )}
        </div>
    );
};

export default OwnerAccountsEdit;