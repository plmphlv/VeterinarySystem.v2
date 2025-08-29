import { useEffect, useRef } from "react";
import http from "../utils/request";
import type { CompleteAppointmentRequest, CreateAppointmentRequest, CreateAppointmentResponse, DeleteAppointmentRequest, EditAppointmentRequest, EditAppointmentResponse, GetAppointmentDetailsRequest } from "../types";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Appointments`;

export const useGetAppointmentDetails = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAppointmentDetails = async (data: GetAppointmentDetailsRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<GetAppointmentDetailsRequest>(
            `${baseUrl}/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { getAppointmentDetails, cancelGetAppointmentDetails: () => abortControllerRef.current?.abort() };
};

export const useCreateAppointment = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const createAppointment = async (data: CreateAppointmentRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<CreateAppointmentRequest, CreateAppointmentResponse>(
            `${baseUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { createAppointment, cancelCreateAppointment: () => abortControllerRef.current?.abort() };
};

export const useEditAppointment = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const editAppointment = async (data: EditAppointmentRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.put<EditAppointmentRequest, EditAppointmentResponse>(
            `${baseUrl}/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { editAppointment, cancelEditAppointment: () => abortControllerRef.current?.abort() };
};

export const useCompleteAppointment = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const completeAppointment = async (id: CompleteAppointmentRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.put(
            `${baseUrl}/CompleteAppointment/${id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { completeAppointment, cancelCompleteAppointment: () => abortControllerRef.current?.abort() };
};

export const useDeleteAppointment = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deleteAppointment = async (data: DeleteAppointmentRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeleteAppointmentRequest>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { deleteAppointment, cancelDeleteAppointment: () => abortControllerRef.current?.abort() };
};