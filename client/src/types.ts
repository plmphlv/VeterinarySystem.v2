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
    accountId?: string,
    staffId?: string
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
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string,
    AccountId: string;
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
    weight: number | null,
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
    name: string;
    age: number | null;
    weight: number;
    passportNumber: string | null;
    chipNumber: string | null;
    animalTypeId: number;
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

export type AddAnimalTypeRequestFieldErrors = Partial<Record<keyof AddAnimalTypeRequest, string>>;
export type EditAnimalTypeRequestFieldErrors = Partial<Record<keyof EditAnimalTypeRequest, string>>;

// AnimalTypes types end

// OwnerAccounts types start

export interface OwnerAccount {
    id: string;
    fullName: string;
    phoneNumber: string;
}

export interface GetOwnerAccountDetailsRequest {
    id: string;
}

export interface GetOwnerAccountDetailsResponse {
    firstName: string,
    lastName: string,
    address?: string,
    phoneNumber: string,
    id: string
}

export interface CreateOwnerAccountRequest {
    firstName: string,
    lastName: string,
    address?: string | null;
    phoneNumber: string,
}

export interface CreateOwnerAccountResponse {
    id: string;
}

export interface EditOwnerAccountRequest {
    firstName: string,
    lastName: string,
    address?: string | null;
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

export interface SearchOwnerAccountRequest {
    name?: string;
    email?: string;
    phoneNumber?: string;
}

export interface SearchOwnerAccountResponse {
    id: string;
    fullName: string;
    phoneNumber: string;
}

export type GetOwnerAccountDetailsRequestErrors = Partial<Record<keyof GetOwnerAccountDetailsRequest, string>>;
export type SearchOwnerAccountRequestErrors = Partial<Record<keyof SearchOwnerAccountRequest, string>>;
export type CreateOwnerAccountDetailsRequestErrors = Partial<Record<keyof CreateOwnerAccountRequest, string>>;
export type EditOwnerAccountFieldErrors = Partial<Record<keyof EditOwnerAccountRequest, string>>;

// OwnerAccounts types end

// Prescriptions types start:

export interface Prescription {
    id: number;
    number: string;
    issueDate: string;
    staffName: string;
}

export interface GetAllPrescriptionsRequest {
    AnimalId?: number;
    StaffId?: string;
    StartDate?: string;
    EndDate?: string;
    PrescriptionNumber?: string;
}

export interface GetAllPrescriptionsResponse {
    id: number;
    number: string;
    issueDate: string;
    staffName: string;
}

export interface GetPrescriptionDetailsRequest {
    id: number;
}

export interface GetPrescriptionDetailsResponse {
    id: number;
    number: string;
    issueDate: string;
    staffName: string;
    description: string;
    animalId: number;
    animalName: string;
    ownerName: string;
}

export interface CreatePrescriptionRequest {
    animalId: number | null;
    description: string;
}

export interface CreatePrescriptionResponse {
    number: number;
}

export interface EditPrescriptionRequest {
    id: number | null;
    description: string;
}

export interface EditPrescriptionResponse {
    message: string;
}

export interface DeletePrescriptionRequest {
    id: number;
}

export interface DeletePrescriptionResponse {
    message: string;
}

export type GetAllPrescriptionsErrors = Partial<Record<keyof GetAllPrescriptionsRequest, string>>;
export type CreatePrescriptionErrors = Partial<Record<keyof CreatePrescriptionRequest, string>>;
export type EditPrescriptionErrors = Partial<Record<keyof EditPrescriptionRequest, string>>;

// Prescriptions types end

// Procedures types start:

export interface Procedure {
    id: number;
    name: string;
    date: string;
}

export interface GetAllProceduresRequest {
    StaffId?: string;
    AnimalId?: number;
    ProcedureName?: string;
    Description?: string;
    StartDate?: string;
    EndDate?: string;
}

export interface GetAllProceduresResponse {
    id: number;
    name: string;
    date: string;
}

export interface GetProcedureDetailsRequest {
    id: number;
}

export interface GetProcedureDetailsResponse {
    name: string;
    description: string;
    date: string;
    id: number;
    animalId: number;
    animalName: string;
    staffProfileId: number;
    staffMemberName: string;
}

export interface CreateProcedureRequest {
    name: string;
    description: string;
    date: string;
    animalId: number | null;
    staffId: string;
}

export interface CreateProcedureResponse {
    number: number;
}

export interface EditProcedureRequest {
    name: string;
    description: string;
    date: string;
    id: number;
}

export interface EditProcedureResponse {
    message: string;
}

export interface DeleteProcedureRequest {
    id: number;
}

export interface DeleteProcedureResponse {
    message: string;
}

export type GetAllProceduresErrors = Partial<Record<keyof GetAllProceduresRequest, string>>;
export type GetProcedureDetailsErrors = Partial<Record<keyof GetProcedureDetailsRequest, string>>;
export type CreateProcedureErrors = Partial<Record<keyof CreateProcedureRequest, string>>;
export type EditProcedureErrors = Partial<Record<keyof EditProcedureRequest, string>>;

// Procedures types end


// User Appointments types start:

export interface GetAppointmentDetailsRequest {
    id: number;
}

export interface GetAppointmentDetailsResponse {
    id: number;
    appointmentStatus: string;
    date: string;
    animalOwnerName: string;
    staffMemberId: string;
    staffMemberName: string;
    description: string;
}

export type AppointmentStatus = "Pending_Review" | "Confirmed" | "Completed" | "Cancelled" | "Missed";

export interface Appointment {
    id: number;
    status: "Pending_Review" | "Confirmed" | "Completed" | "Cancelled" | "Missed";
    date: string; // or Date
    staffMemberName: string;
}

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

export interface CreateAppointmentRequest {
    date: string, // or Date
    description: string,
}

export interface CreateAppointmentRequestResponse {
    message: number;
}

export interface UpdateAppointmentRequest {
    date: string;
    description: string;
    id: number;
}

export interface UpdateAppointmentResponse {
    message: number;
}

export interface DeleteAppointmentRequest {
    id: number;
}

export interface DeleteAppointmentResponse {
    message: number;
}

export type GetAllAppointmentsErrors = Partial<Record<keyof GetAllAppointmentsRequest, string>>;
export type GetAppointmentDetailsErrors = Partial<Record<keyof GetAppointmentDetailsRequest, string>>;
export type CreateAppointmentRequestError = Partial<Record<keyof CreateAppointmentRequest, string>>;
export type UpdateAppointmentRequestErrors = Partial<Record<keyof UpdateAppointmentRequest, string>>;

// User Appointments types end

// Staff Appointments types start:

export interface StaffCreateAppointmentRequest {
    date: string;
    description: string;
    staffId: string;
    ownerId: string;
}

export interface StaffCreateAppointmentResponse {
    message: number;
}

export interface StaffEditAppointmentRequest {
    date: string;
    description: string;
    staffId: string;
    id: number;
    status: "Pending_Review" | "Confirmed" | "Completed" | "Cancelled" | "Missed";
}

export interface StaffEditAppointmentResponse {
    message: number;
}

// export interface StaffDeleteAppointmentRequest {
//     id: number;
// }

// export interface StaffDeleteAppointmentResponse {
//     message: number;
// }

export type StaffCreateAppointmentRequestFieldErrors = Partial<Record<keyof StaffCreateAppointmentRequest, string>>;
export type StaffEditAppointmentRequestFieldErrors = Partial<Record<keyof StaffEditAppointmentRequest, string>>;

// Staff Appointments types end

// StaffProfiles types start:

export interface StaffProfile {
    id: string;
    name: string;
}

export interface GetAllStaffProfilesRequest {
    name?: string;
    phoneNumber?: string;
    email?: string;
}

export interface GetAllStaffProfilesResponse {
    id: string;
    name: string;
}

export interface GetStaffProfileDetailsRequest {
    id: string;
}

export interface GetStaffProfileDetailsResponse {
    id: string;
    name: string;
    phoneNumber: string;
}

export interface AddStaffProfileRequest {
    userId: string;
}

export interface AddStaffProfileResponse {
    message: string;
}

// export interface DeleteStaffProfileRequest {
//     id: string;
// }

export interface DeleteStaffProfileResponse {
    message: string;
}

export interface GetStaffMembersResponse {
    id: string;
    value: string;
}

export type GetAllStaffProfilesRequestFieldErrors = Partial<Record<keyof GetAllStaffProfilesRequest, string>>;
export type GetStaffProfilesDetailsRequestFieldErrors = Partial<Record<keyof GetStaffProfileDetailsRequest, string>>;
export type AddStaffProfilesRequestFieldErrors = Partial<Record<keyof AddStaffProfileRequest, string>>;

// StaffProfiles types end

// Templates types start:

export interface Template {
    name: string;
    type: string;
    isActive: boolean;
    id: number;
    createdAt: string;
    lastModifiedDate: string;
    createdBy: string;
    lastModifiedBy: string;
}

export interface GetAllTemplatesRequest {
    Type?: string;
    Name?: string;
    IsActive?: boolean;
}

export interface GetAllTemplatesResponse {
    name: string;
    type: string;
    isActive: boolean;
    id: number;
    createdAt: string;
    lastModifiedDate: string;
    createdBy: string;
    lastModifiedBy: string;
}

export interface GetAllTemplatesResponse {
    name: string;
    type: string;
    isActive: boolean;
    id: number;
    createdAt: string;
    lastModifiedDate: string;
    createdBy: string;
    lastModifiedBy: string;
}

export interface GetTemplateDetailsRequest {
    id: number;
}

export interface GetTemplateDetailsResponse {
    name: string;
    type: string;
    isActive: boolean;
    id: number;
    content: string;
}

export interface GetTemplateDetailsResponse {
    name: string;
    type: string;
    isActive: boolean;
    id: number;
    content: string;
}

export interface CreateTemplateRequest {
    name: string;
    type: string;
    isActive: boolean;
    content: string;
}

export interface CreateTemplateResponse {
    value: number;
}

export interface EditTemplateRequest {
    name: string;
    type: string;
    isActive: boolean;
    id: number;
    content: string;
}

export interface EditTemplateResponse {
    message: string;
}

export interface DeleteTemplateRequest {
    id: number;
}

export interface DeleteTemplateResponse {
    message: string;
}

// Templates types end