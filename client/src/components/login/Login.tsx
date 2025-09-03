import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../api/authAPI";
import type { LoginFieldErrors, LoginRequest } from "../../types";
import { useForm } from "../../hooks/useForm";
import Dialog from "../dialog/Dialog";
import Spinner from "../spinner/Spinner";
import { UserContext } from "../../contexts/UserContext";

const initialValues: LoginRequest = {
    IdentifyingCredential: "",
    password: ""
};

const Login: React.FC = () => {
    const [errors, setErrors] = useState<LoginFieldErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [dialog, setDialog] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { login, cancelLogin } = useLogin();
    const navigate = useNavigate();
    const { userLoginHandler } = useContext(UserContext);

    const validateField = (field: keyof LoginRequest, value: string): string | undefined => {
        switch (field) {
            case "IdentifyingCredential":
                if (!value.trim()) return "Email or username is required.";
                return undefined;
            case "password":
                if (!value.trim()) return "Password is required.";
                return undefined;
            default:
                return undefined;
        }
    };

    const validate = (values: LoginRequest): LoginFieldErrors => {
        const fieldErrors: LoginFieldErrors = {};
        (Object.keys(values) as (keyof LoginRequest)[]).forEach(field => {
            const error = validateField(field, values[field]);
            if (error) fieldErrors[field] = error;
        });
        return fieldErrors;
    };

    const loginHandler = async (values: LoginRequest) => {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setDialog({ message: "Please fill in all required fields.", type: "error" });
            return;
        }

        setIsLoading(true);
        try {
            setErrors({});
            const authData = await login(values);

            if (!authData || !authData.hasOwnProperty('accessToken') || authData?.errorMessage || authData.isSuccessful === false) {
                throw new Error(`${authData?.errorMessage}`) || new Error("Login failed.");
            }

            setDialog({ message: "Login is successful.", type: "success" });
            setTimeout(() => {
                userLoginHandler(authData);
                navigate('/');
            }, 500);
        } catch (err: any) {            
            if (!err.status) {
                setDialog({ message: "Invalid username or password.", type: "error" });
                changeValues({ ...values, password: "" });
                return;
            }

            if (err.errors.Password) {
                setDialog({ message: err.errors.Password[0], type: "error" });
                return;
            }

            setDialog({ message: err.detail || err.errorMessage || "Login failed, please try again later.", type: "error" });
            changeValues({ ...values, password: "" });
            return;
        } finally {
            setIsLoading(false);
        }
    };

    const { values, changeHandler, onSubmit, changeValues } = useForm(initialValues, loginHandler);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        changeHandler(e);

        const fieldName = name as keyof LoginRequest;
        const errorMsg = validateField(fieldName, value);

        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg || undefined
        }));
    };

    const inputClass = (field: keyof LoginRequest) => {
        if (errors[field]) return "input error";
        if (values[field] && !errors[field]) return "input success";
        return "input";
    };

    useEffect(() => {
        return () => {
            cancelLogin();
        };
    }, []);

    return (
        <>
            {isLoading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}

            <section className="login">
                <div className="login-container">
                    <h2>Login</h2>
                    <form onSubmit={onSubmit} noValidate>
                        {([
                            {
                                name: "IdentifyingCredential",
                                label: "Email Address or Username",
                                type: "text",
                                icon: "fa-envelope",
                                placeholder: "Enter your email or username"
                            },
                            {
                                name: "password",
                                label: "Password",
                                type: "password",
                                icon: "fa-key",
                                placeholder: "Enter your password"
                            }
                        ] as const).map(({ name, label, type, icon, placeholder }) => (
                            <div className="login-form-group" key={name}>
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
                                {errors[name] && <p className="error-text">{errors[name]}</p>}
                            </div>
                        ))}

                        <button type="submit" className="register-btn" disabled={isLoading}>
                            Login
                        </button>
                    </form>
                    <div className="login-bottom-text">
                        Don't have an account? <Link to="/register">Register</Link>
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

export default Login;