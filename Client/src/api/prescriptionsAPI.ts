import { useEffect, useRef } from "react";
import http from "../utils/request";
import type { CreatePrescriptionRequest, CreatePrescriptionResponse, DeletePrescriptionRequest, EditPrescriptionRequest, EditPrescriptionResponse, GetAllPrescriptionsRequest, GetAppointmentDetailsRequest, GetPrescriptionDetailsRequest, GetPrescriptionDetailsResponse, Prescription } from "../types";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Prescriptions`;

export const useGetAllPrescriptions = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllPrescriptions = async (data: GetAllPrescriptionsRequest) => {
        abortControllerRef.current = new AbortController();

        const queryParams = new URLSearchParams();

        if (data.AnimalId !== undefined) {
            queryParams.append("AnimalId", String(data.AnimalId));
        }
        if (data.StaffId) {
            queryParams.append("StaffId", data.StaffId);
        }
        if (data.StartDate) {
            queryParams.append("StartDate", data.StartDate);
        }
        if (data.EndDate) {
            queryParams.append("EndDate", data.EndDate);
        }
        if (data.PrescriptionNumber) {
            queryParams.append("PrescriptionNumber", data.PrescriptionNumber);
        }

        const query = queryParams.toString();

        const url = query
            ? `${baseUrl}?${query}`
            : `${baseUrl}`;

        return http.get<Prescription[]>(url, {
            signal: abortControllerRef.current.signal,
        });
    };

    return {
        getAllPrescriptions,
        cancelGetAllPrescriptions: () => abortControllerRef.current?.abort(),
    };
};

export const useGetPrescriptionDetails = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getPrescriptionDetails = async (data: GetPrescriptionDetailsRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<GetPrescriptionDetailsResponse>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return {
        getPrescriptionDetails,
        cancelGetPrescriptionDetails: () => abortControllerRef.current?.abort(),
    };
};

export const useCreatePrescription = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const createPrescription = async (data: CreatePrescriptionRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<CreatePrescriptionRequest, CreatePrescriptionResponse>(
            `${baseUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { createPrescription, cancelCreatePrescription: () => abortControllerRef.current?.abort() };
};

export const useEditPrescription = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const editPrescription = async (data: EditPrescriptionRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.put<EditPrescriptionRequest, EditPrescriptionResponse>(
            `${baseUrl}/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { editPrescription, cancelEditPrescription: () => abortControllerRef.current?.abort() };
};

export const useDeletePrescription = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deletePrescription = async (data: DeletePrescriptionRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeletePrescriptionRequest>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { deletePrescription, cancelDeletePrescription: () => abortControllerRef.current?.abort() };
};