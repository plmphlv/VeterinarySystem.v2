import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin, useRegister } from "../../api/authAPI";
import type { RegisterFieldErrors, RegisterRequest } from "../../types";
import { useForm } from "../../hooks/useForm";
import Dialog from "../dialog/Dialog";
import { UserContext } from "../../contexts/UserContext";
import Spinner from "../spinner/Spinner";
import styles from "./Register.module.css";

const initialValues: RegisterRequest = {
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
};

const Register: React.FC = () => {
    const [errors, setErrors] = useState<RegisterFieldErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { register, cancelRegister } = useRegister();
    const { login } = useLogin();

    const navigate = useNavigate();
    const { userLoginHandler } = useContext(UserContext);

    const validateField = (
        field: keyof RegisterRequest,
        value: string,
        allValues: RegisterRequest
    ): string | undefined => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/;
        const phoneRegex = /^(?:\+\d(?: ?\d){11}|\d(?: ?\d){9})$/;

        switch (field) {
            case "userName":
                if (!value.trim()) return "Username is required.";
                if (value.length < 2) return "Username must be at least 2 characters.";
                return undefined;
            case "email":
                if (!value.trim()) return "Email is required.";
                if (!emailRegex.test(value)) return "Invalid email format.";
                return undefined;
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
            case "password":
                if (!value.trim()) return "Password is required.";
                if (!passwordRegex.test(value)) return "Password must include uppercase, lowercase and a number.";
                if (allValues.confirmPassword && value !== allValues.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match." }));
                } else {
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }
                return undefined;
            case "confirmPassword":
                if (value !== allValues.password) return "Passwords do not match.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: RegisterRequest): RegisterFieldErrors => {
        const fieldErrors: RegisterFieldErrors = {};
        (Object.keys(values) as (keyof RegisterRequest)[]).forEach(field => {
            const error = validateField(field, values[field], values);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const registerHandler = async (values: RegisterRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            if (validationErrors.password || validationErrors.confirmPassword) {
                changeValues({
                    ...values,
                    password: "",
                    confirmPassword: ""
                });
            }
            return;
        }

        setIsLoading(true);
        try {
            setErrors({});
            await register(values);

            const IdentifyingCredential = values.email;
            const password = values.password;
            const authData = await login({ IdentifyingCredential, password });

            if (!authData || !authData.hasOwnProperty("accessToken") || authData?.errorMessage || authData.isSuccessful === false) {
                throw new Error(`${authData?.errorMessage}`);
            }

            setDialog({ message: "Register is successful!", type: "success" });
            setTimeout(() => {
                userLoginHandler(authData);
                navigate("/");
            }, 500);
        } catch (err: any) {
            if (err.status === 400) {
                setDialog({ message: err.errors.RegisterCommand[0] || "Registration failed.", type: "error" });
                changeValues({
                    ...values,
                    password: "",
                    confirmPassword: ""
                });
                return;
            } else if (err.status === 500) {
                setDialog({ message: "Registration failed, please try again later.", type: "error" });
                changeValues({
                    ...values,
                    password: "",
                    confirmPassword: ""
                });
                return;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, registerHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        changeHandler(e);

        const fieldName = name as keyof RegisterRequest;
        const errorMsg = validateField(fieldName, value, { ...values, [name]: value });

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof RegisterRequest) => {
        if (errors[field]) return `${styles.input} ${styles.error}`;
        if (values[field] && !errors[field]) return `${styles.input} ${styles.success}`;
        return styles.input;
    };

    useEffect(() => {
        return () => {
            cancelRegister();
        };
    }, []);

    return (
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className={styles.register}>
                <div className={styles["register-container"]}>
                    <h2>Register</h2>

                    <form onSubmit={onSubmit} noValidate>
                        {([
                            { name: "userName", label: "Username", type: "text", icon: "fa-user", placeholder: "Enter your username" },
                            { name: "email", label: "Email Address", type: "email", icon: "fa-envelope", placeholder: "Enter your email" },
                            { name: "firstName", label: "First Name", type: "text", icon: "fa-pen", placeholder: "Enter your first name" },
                            { name: "lastName", label: "Last Name", type: "text", icon: "fa-pen", placeholder: "Enter your last name" },
                            { name: "phoneNumber", label: "Phone Number", type: "tel", icon: "fa-phone", placeholder: "Enter your phone number" },
                            { name: "password", label: "Password", type: "password", icon: "fa-key", placeholder: "Create a password" },
                            { name: "confirmPassword", label: "Confirm Password", type: "password", icon: "fa-key", placeholder: "Confirm your password" },
                        ] as const).map(({ name, label, type, icon, placeholder }) => (
                            <div className={styles["register-form-group"]} key={name}>
                                <label htmlFor={name}>
                                    <i className={`fa-solid ${icon}`}></i> {label}:
                                </label>

                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    value={values[name]}
                                    onChange={handleChange}
                                    className={inputClass(name)}
                                    placeholder={placeholder}
                                    autoComplete="off"
                                />

                                {errors[name] && (
                                    <p className={styles["error-text"]}>{errors[name]}</p>
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            className={styles["register-btn"]}
                            disabled={isLoading}
                        >
                            Register
                        </button>
                    </form>

                    <div className={styles["register-bottom-text"]}>
                        Already registered? <Link to="/login">Login</Link>
                    </div>
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

export default Register;