import type React from "react";
import { useEffect, useState } from "react";
import { useGetUserData } from "../../../../hooks/useGetUserData";
import { Link, useNavigate } from "react-router";
import { useForm } from "../../../../hooks/useForm";
import Spinner from "../../../spinner/Spinner";
import Dialog from "../../../dialog/Dialog";
import styles from "./Staff-Profiles-Add.module.css";
import type {
    AddStaffProfileRequest,
    AddStaffProfilesRequestFieldErrors,
} from "../../../../types";
import { useAddStaffProfile } from "../../../../api/staffProfilesAPI";
import { getJwtDecodedData } from "../../../../utils/getJwtDecodedData";

const initialValues: AddStaffProfileRequest = {
    userId: "",
};

const StaffProfilesAdd: React.FC = () => {
    const [errors, setErrors] = useState<AddStaffProfilesRequestFieldErrors>({});
    const [formLoading, setFormLoading] = useState(false);
    const [dialog, setDialog] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const { userData, isLoading: userLoading } = useGetUserData();
    const { addStaffProfile, cancelAddStaffProfile } = useAddStaffProfile();
    const navigate = useNavigate();

    const decodedData = getJwtDecodedData();

    const role =
        decodedData?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

    useEffect(() => {
        if (role !== "SuperAdministrator") {
            navigate("/staff-area/staff-profiles");
        }
    }, [role, navigate]);

    if (role !== "SuperAdministrator") {
        return null;
    }

    const validateField = (
        field: keyof AddStaffProfileRequest,
        value: string,
        allValues: AddStaffProfileRequest
    ): string | undefined => {
        switch (field) {
            case "userId":
                if (!String(value).trim()) return "User ID is required.";
                if (String(value).trim().length < 2)
                    return "User ID must be at least 2 characters.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (
        values: AddStaffProfileRequest
    ): AddStaffProfilesRequestFieldErrors => {
        const fieldErrors: AddStaffProfilesRequestFieldErrors = {};
        (Object.keys(values) as (keyof AddStaffProfileRequest)[]).forEach(
            (field) => {
                const fieldValue = values[field] ?? "";
                const error = validateField(field, fieldValue, values);
                if (error) fieldErrors[field] = error;
            }
        );
        return fieldErrors;
    };

    const addStaffProfileHandler = async (
        values: AddStaffProfileRequest
    ) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setFormLoading(true);
        try {
            setErrors({});
            if (!userData) return;

            const payload: AddStaffProfileRequest = {
                userId: values.userId,
            };

            await addStaffProfile(payload);

            setDialog({
                message: "Staff profile added successfully!",
                type: "success",
            });
            setTimeout(
                () => navigate(`/staff-area/staff-profiles`),
                1500
            );
        } catch {
            setDialog({
                message: "Failed adding staff profile.",
                type: "error",
            });
        } finally {
            setFormLoading(false);
        }
    };

    const { values, onSubmit, changeValues } = useForm(
        initialValues,
        addStaffProfileHandler
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const fieldName = name as keyof AddStaffProfileRequest;

        const parsedValue: string = value;

        changeValues({ ...values, [fieldName]: parsedValue });

        const errorMsg = validateField(fieldName, parsedValue, {
            ...values,
            [fieldName]: parsedValue,
        });

        setErrors((prev) => ({
            ...prev,
            [fieldName]: errorMsg || undefined,
        }));
    };

    const inputClass = (field: keyof AddStaffProfileRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field])
            return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelAddStaffProfile();
    }, [cancelAddStaffProfile]);

    return (
        <div className={styles.pageContainer}>
            {(formLoading || userLoading) && (
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

            <section className={styles.card}>
                <header className={styles.cardHeader}>
                    <div className={styles.iconCircle}>
                        <i className="fa-solid fa-user-plus"></i>
                    </div>
                    <h1 className={styles.title}>Add a Staff Profile</h1>
                    <p className={styles.subtitle}>Register a new staff member</p>
                </header>

                <form onSubmit={onSubmit} noValidate className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="userId">
                            User ID
                        </label>
                        <div className={styles.inputWrapper}>
                            <i className={`fa-solid fa-id-badge ${styles.inputIcon}`}></i>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={values.userId ?? ""}
                                onChange={handleChange}
                                className={`${styles.input} ${inputClass("userId")}`}
                                placeholder="Enter user ID"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {errors.userId && <span className={styles.errorMsg}>{errors.userId}</span>}
                    </div>

                    <div className={styles.actionGroup}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={formLoading}
                        >
                            <i className="fa-solid fa-plus"></i> Add Profile
                        </button>

                        <Link
                            to="/staff-area/staff-profiles"
                            className={styles.cancelBtn}
                        >
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default StaffProfilesAdd;