import type React from "react";
import Spinner from "../../spinner/Spinner";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useEffect, useState } from "react";
import type { EditProfileRequest } from "../../../types";
import { useForm } from "../../hooks/useForm";
import { useEditProfile } from "../../../api/authAPI";
import { Link, useNavigate } from "react-router";

const initialValues: EditProfileRequest = {
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
};

const EditProfile: React.FC = () => {
    const [errors, setErrors] = useState<Partial<Record<keyof EditProfileRequest, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { userData, isLoading: isUserLoading, error } = useGetUserData();
    
    const { editProfile, cancelEditProfile } = useEditProfile();

    const navigate = useNavigate();

    const validateField = (
        field: keyof EditProfileRequest,
        value: string,
        allValues: EditProfileRequest
    ): string | undefined => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{7,15}$/;

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
                if (!phoneRegex.test(value)) return "Phone number must be between 7 and 15 digits.";
                return undefined;
            case "address":
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: EditProfileRequest): Partial<Record<keyof EditProfileRequest, string>> => {
        const fieldErrors: Partial<Record<keyof EditProfileRequest, string>> = {};
        (Object.keys(values) as (keyof EditProfileRequest)[]).forEach(field => {
            const error = validateField(field, values[field], values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const editProfileHandler = async (values: EditProfileRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            setErrors({});
            await editProfile(values);

            setDialog({ message: "Edit is successful!", type: "success" });
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (err: any) {
            setDialog({ message: err.errors.RegisterCommand[0] || "Edit failed.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const { values, changeHandler, onSubmit } = useForm(initialValues, editProfileHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        changeHandler(e);

        const fieldName = name as keyof EditProfileRequest;
        const errorMsg = validateField(fieldName, value, { ...values, [name]: value });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof EditProfileRequest) => {
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => {
        return () => {
            cancelEditProfile();
        };
    }, []);

    return (
        <>
            {isLoading || isUserLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            {userData ? (

                <div className="profile-card">
                    <h1 className="h1-profile">Edit Profile</h1>
                    <form onSubmit={onSubmit} noValidate>
                        {([
                            { name: "firstName", label: "First Name", type: "text", icon: "fa-pen", placeholder: "Enter your first name" },
                            { name: "lastName", label: "Last Name", type: "text", icon: "fa-pen", placeholder: "Enter your last name" },
                            { name: "phoneNumber", label: "Phone Number", type: "tel", icon: "fa-phone", placeholder: "0888123456" },
                            { name: "address", label: "Address", type: "text", icon: "fa-address-card", placeholder: "Enter your address (optional)" },
                        ] as const).map(({ name, label, type, icon, placeholder }) => (
                            <div className="field-edit-profile" key={name}>
                                <label htmlFor={name}>
                                    <i className={`fa-solid ${icon}`}></i> {label}:
                                </label>
                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    value={userData[name]}
                                    onChange={handleChange}
                                    className={inputClass(name)}
                                    placeholder={placeholder}
                                    autoComplete="off"
                                    required={name !== "address"}
                                />
                                {errors[name] && <p className="error-text">{errors[name]}</p>}
                            </div>
                        ))}

                        <button className="edit-button" type="submit" disabled={isLoading}>
                            Save
                        </button>

                        <Link to="/profile" className="edit-button">Cancel</Link>

                        {dialog && <div className={`dialog ${dialog.type}`}>{dialog.message}</div>}
                    </form>
                </div>
            ) : !isLoading && !error ? (
                <p>No user data found.</p>
            ) : null}
        </>
    )
}

export default EditProfile;