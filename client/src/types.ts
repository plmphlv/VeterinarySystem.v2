import type { ChangeEvent, FormEvent } from "react";

// request.ts types start
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
    signal?: AbortSignal;
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
    address: string,
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

// ChangePassword types start
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}
// ChangePassword types end

// Edit Profile types start

export interface EditProfileRequest {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
}

export interface EditProfileResponse {
    message: string;
}
// Edit Profile types end  

// usePersistedState types start

export interface NewState {
    accessToken: string;
    refreshToken: string;
    isSuccessful: boolean;
    errorMessage?: string;
}

// Animals types start
export interface Animal {
    id: string;
    name: string;
    animalType: string;
}

export type GetAllAnimalsErrors = Partial<Record<keyof GetAllAnimalsRequest, string>>;
export type GetAnimalDetailsErrors = Partial<Record<keyof GetAnimalDetailsRequest, string>>;
export type AddAnimalFieldErrors = Partial<Record<keyof AddAnimalRequest, string>>;
export type EditAnimalFieldErrors = Partial<Record<keyof EditAnimalRequest, string>>;

export interface GetAllAnimalsRequest {
    ownerId: string;
}

export interface GetAnimalDetailsRequest {
    id: number;
}

export interface GetAnimalDetailsResponse {
    name: string,
    age: number,
    weight: number,
    passportNumber: string,
    chipNumber: string,
    ownerName: string
    animalType: string,
}

export interface AddAnimalRequest {
    name: string,
    age: number,
    weight: number,
    passportNumber: string,
    chipNumber: string,
    animalTypeId: number,
    ownerId: string
}

export interface AddAnimalResponse {
    number: number;
}

export interface EditAnimalRequest {
    id: number;
    name: string,
    age: number,
    weight: number,
    passportNumber: string,
    chipNumber: string,
    animalTypeId: number,
}

export interface EditAnimalResponse {
    message: string;
}

export interface DeleteAnimalRequest {
    id: number;
}

export interface DeleteAnimalResponse {
    message: string;
}
// Animals types end

// AnimalTypes types start
export interface AnimalType {
    id: number;
    value: string;
}

export interface AddAnimalTypeRequest {
    id: number;
    typeName: string;
}

export interface AddAnimalTypeResponse {
    number: number;
}

export interface EditAnimalTypeRequest {
    id: number;
    typeName: string;
}

export interface EditAnimalTypeResponse {
    message: string;
}

export interface DeleteAnimalTypeRequest {
    id: number;
}

export interface DeleteAnimalTypeResponse {
    message: string;
}
// AnimalTypes types end

// OwnerAccounts types start

export interface GetOwnerAccountDetailsRequest {
    id: string;
}

export interface GetOwnerAccountDetailsResponse {
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    id: string
}

export interface CreateOwnerAccountRequest {
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
}

export interface CreateOwnerAccountRequest {
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
}

export interface CreateOwnerAccountResponse {
    id: string;
}

export interface EditOwnerAccountRequest {
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    id: string
}

export interface EditOwnerAccountResponse {
    message: string
}

export interface DeleteOwnerAccountRequest {
    id: string;
}

export interface DeleteOwnerAccountResponse {
    message: string;
}

// OwnerAccounts types end




