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

    /* ================= ROLE GUARD ================= */

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

    /* ================================================= */

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
        } catch {
            setDialog({
                message: "Failed adding staff profile.",
                type: "error",
            });
        } finally {
            setFormLoading(false);
            setTimeout(
                () => navigate(`/staff-area/staff-profiles`),
                1500
            );
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
        if (errors[field]) return `${styles.input} ${styles.error}`;
        if (values[field] && !errors[field])
            return `${styles.input} ${styles.success}`;
        return styles.input;
    };

    useEffect(() => {
        return () => cancelAddStaffProfile();
    }, [cancelAddStaffProfile]);

    return (
        <>
            {(formLoading || userLoading) && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles["staff-profiles-add"]}>
                <div className={styles["staff-profiles-add-container"]}>
                    <h2>Add Staff Profile</h2>

                    <form onSubmit={onSubmit} noValidate>
                        <div
                            className={
                                styles["staff-profiles-add-form-group"]
                            }
                        >
                            <label htmlFor="userId">
                                <i className="fa-solid fa-pen"></i> User ID:
                            </label>

                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={values.userId ?? ""}
                                onChange={handleChange}
                                className={inputClass("userId")}
                                placeholder="Enter user ID"
                                autoComplete="off"
                                required
                            />

                            {errors.userId && (
                                <p className={styles["error-text"]}>
                                    {errors.userId}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={
                                styles["staff-profiles-add-btn-small"]
                            }
                            disabled={formLoading}
                        >
                            Add
                        </button>

                        <Link
                            to="/staff-area/staff-profiles"
                            className={
                                styles["staff-profiles-add-cancel-btn"]
                            }
                        >
                            Cancel
                        </Link>
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

export default StaffProfilesAdd;
