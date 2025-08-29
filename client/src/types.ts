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

export interface ResetPasswordRequest {
    userId: string,
    newPassword: string,
    confirmNewPassword: string
}

export interface ResetPasswordResponse {
    message: string;
}

export interface GetUserAccountRequest {
    id: string;
}

export interface GetUserAccountResponse {
    id: string,
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
    email: string
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
export interface JwtDecodedData {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: "StaffMember",
    AccountId?: string;
    StaffId?: string;
    exp: number;
    iss: string;
    aud: string;
}

export interface JwtAccountIdPayload {
    AccountId: string,
}

export interface JwtAccountExpPayload {
    exp: number,
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
    address?: string | null;
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

// usePersistedState types end

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
    age?: number | null,
    weight: number,
    passportNumber?: string | null,
    chipNumber?: string | null,
    animalTypeId: number,
    ownerId: string
}

export interface AddAnimalResponse {
    number: number;
}

export interface EditAnimalRequest {
    id: number;
    name: string,
    age?: number | null,
    weight: number,
    passportNumber?: string | null,
    chipNumber?: string | null,
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

// User Appointments types start:

export interface GetOwnerAppointmentsRequest {
    OwnerId: string;
    StaffId?: string;
    Status?: "Pending_Review" | "Confirmed" | "Completed" | "Cancelled" | "Missed";
    StartDate?: string; // or Date
    EndDate?: string; // or Date
}

export interface GetAllAppointmentsRequest {
    OwnerId?: string;
    StaffId?: string;
    Status?: "Pending_Review" | "Confirmed" | "Completed" | "Cancelled" | "Missed";
    StartDate?: string; // or Date, or transform the date to string before send request
    EndDate?: string; // or Date
}

export interface CreateRequestAppointment {
    date: string, // or Date
    description: string,
    staffId: string
}

export interface CreateRequestAppointmentResponse {
    message: number;
}

export interface UpdateAppointmentRequest {
    date: string;
    description: string;
    staffId: string;
    id: string;
}

export interface UpdateAppointmentResponse {
    message: number;
}

// User Appointments types end

// Staff Appointments types start:

export interface GetAppointmentDetailsRequest {
    id: number;
}

export interface GetAppointmentDetailsResponse {
    id: number;
    appointmentStatus: string;
    date: string;
    animalOwnerName: string;
    staffMemberName: string;
    desctiption: string;
}

export interface CreateAppointmentRequest {
    date: string;
    description: string;
    staffId: string;
    ownerId: string;
}

export interface CreateAppointmentResponse {
    message: number;
}

export interface EditAppointmentRequest {
    date: string;
    description: string;
    staffId: string;
    id: number;
    status: "Pending_Review" | "Confirmed" | "Completed" | "Cancelled" | "Missed";
}

export interface EditAppointmentResponse {
    message: number;
}

export interface CompleteAppointmentRequest {
    id: number;
}

export interface CompleteAppointmentResponse {
    message: number;
}

export interface DeleteAppointmentRequest {
    id: number;
}

export interface DeleteAppointmentResponse {
    message: number;
}


// Staff Appointments types end