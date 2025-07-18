import type { ChangeEvent, FormEvent } from "react";

// request.ts types start
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

export interface RequestParams<T> {
    method: HttpMethod;
    url: string;
    data?: T;
    options?: RequestOptions;
}
// request.ts types end

// authAPI.ts types start
export interface LoginRequest {
    IdentifyingCredential: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    isSuccessful: boolean;
    errorMessage?: string;
}

export interface RegisterRequest {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    userId: string;
}

export interface UserDataFromId {
    email: string,
    id: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

export interface UpdateAccountRequest {
    id: "string",
    firstName: "string",
    lastName: "string",
    address: "string",
    phoneNumber: "string"
}
// authAPI.ts types end

// UserContext.ts types start
export interface User {
    _id: string;
    email: string;
    username: string;
    accessToken: string;
}

export interface AuthData {
    accessToken: string;
    refreshToken: string;
    isSuccessful: boolean;
    errorMessage?: string;
}

export interface AccessToken {
    accessToken: string;
    refreshToken: string;
    isSuccessful: boolean;
    errorMessage?: string;
}

export interface UserContextType extends AuthData {
    userLoginHandler: (data: AuthData) => void;
    userLogoutHandler: () => void;
}
// UserContext.ts types end

// UserProvider.ts types start

export interface UserProviderProps {
    children: React.ReactNode;
}

// UserProvidet.ts types end

// useForm.ts types start

export type UseFormReturn<T> = {
    values: T;
    changeHandler: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    changeValues: (newValues: T) => void;
};

// userForm.ts types end

// Field errors types start:
export type RegisterFieldErrors = Partial<Record<keyof RegisterRequest, string>>;
export type LoginFieldErrors = Partial<Record<keyof LoginRequest, string>>;
// Field errors types end:

// Dialog types start:
export type DialogProps = {
    message: string;
    type: "success" | "error";
    onClose: () => void;
};
// Dialog types end

// useAuth types start

export interface JwtPayload {
    AccountId: "ba995470-a7ad-4e7f-8119-8587089f92c4",
}

// useAuth types end






