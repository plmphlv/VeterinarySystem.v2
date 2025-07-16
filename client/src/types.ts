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
    emailOrUsername: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    isSuccessful: number;
    errorMessage: string;
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
// authAPI.ts types end

// UserContext.ts types start
export interface User {
    _id: string;
    email: string;
    username: string;
    accessToken: string;
}

export interface UserContextType {
    user: User | null;
    userLoginHandler: (user: User) => void;
    userLogoutHandler: () => void;
}
// UserContext.ts types end

// useForm.ts types start

export type UseFormReturn<T> = {
  values: T;
  changeHandler: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  changeValues: (newValues: T) => void;
};

// userForm.ts types end

// Field errors types start:
export type FieldErrors = Partial<Record<keyof RegisterRequest, string>>;
// Field errors types end:

// Dialog types start:
export type DialogProps = {
    message: string;
    type: "success" | "error";
    onClose: () => void;
};
// Dialog types end





