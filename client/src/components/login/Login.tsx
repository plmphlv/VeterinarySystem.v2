import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../api/authAPI";
import type { LoginFieldErrors, LoginRequest } from "../../types";
import { useForm } from "../../hooks/useForm";
import Dialog from "../dialog/Dialog";
import Spinner from "../spinner/Spinner";
import { UserContext } from "../../contexts/UserContext";
import styles from "./Login.module.css";

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

            if (!authData || authData.errorMessage || authData.isSuccessful === false) {
                throw new Error("Login failed.");
            }

            setDialog({ message: "Login is successful.", type: "success" });
            setTimeout(() => {
                userLoginHandler(authData);
                navigate("/");
            }, 500);
        } catch {
            setDialog({ message: "Invalid username or password.", type: "error" });
            changeValues({ ...values, password: "" });
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
            [fieldName]: errorMsg
        }));
    };

    const inputClass = (field: keyof LoginRequest) => {
        if (errors[field]) return styles.errorInput;
        if (values[field] && !errors[field]) return styles.successInput;
        return "";
    };

    useEffect(() => {
        return () => cancelLogin();
    }, []);

    return (
        <>
            {isLoading && (
                <div className={styles.spinnerOverlay}>
                    <Spinner />
                </div>
            )}

            <section className={styles.loginPage}>
                {dialog && (
                    <Dialog 
                        message={dialog.message} 
                        type={dialog.type} 
                        onClose={() => setDialog(null)} 
                    />
                )}

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h1>Welcome Back</h1>
                        <p>Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={onSubmit} noValidate className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="IdentifyingCredential">Email or Username</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-envelope ${styles.inputIcon}`}></i>
                                <input
                                    type="text"
                                    id="IdentifyingCredential"
                                    name="IdentifyingCredential"
                                    value={values.IdentifyingCredential}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("IdentifyingCredential")}`}
                                    placeholder="Enter your email or username"
                                    autoComplete="off"
                                />
                            </div>
                            {errors.IdentifyingCredential && <p className={styles.errorMsg}>{errors.IdentifyingCredential}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.inputWrapper}>
                                <i className={`fa-solid fa-key ${styles.inputIcon}`}></i>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    className={`${styles.input} ${inputClass("password")}`}
                                    placeholder="Enter your password"
                                    autoComplete="off"
                                />
                            </div>
                            {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
                        </div>

                        <button 
                            type="submit" 
                            className={styles.loginBtn}
                            disabled={isLoading}
                        >
                            Sign In
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;