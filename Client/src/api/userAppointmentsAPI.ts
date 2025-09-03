import { useEffect, useRef } from "react";
import http from "../utils/request";
import { getJwtDecodedData } from "../utils/getJwtDecodedData";
import type { Appointment, CreateRequestAppointment, CreateRequestAppointmentResponse, GetAllAppointmentsRequest, GetOwnerAppointmentsRequest, UpdateAppointmentRequest, UpdateAppointmentResponse } from "../types";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Appointments`;
const decodedData = getJwtDecodedData();

export const useGetAllAppointments = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllAppointments = async (data: GetOwnerAppointmentsRequest | GetAllAppointmentsRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        const queryParams = new URLSearchParams();

        if (decodedData?.AccountId || decodedData?.StaffId) {
            if (data.OwnerId) queryParams.append("OwnerId", data.OwnerId);
            if (data.StaffId) queryParams.append("StaffId", data.StaffId);
            if (data.Status) queryParams.append("Status", data.Status);
            if (data.StartDate) queryParams.append("StartDate", data.StartDate);
            if (data.EndDate) queryParams.append("EndDate", data.EndDate);

            const url = `${baseUrl}/GetAppointments?${queryParams.toString()}`;
            return http.get<Appointment[]>(url, { signal: abortControllerRef.current.signal });
        }
    };

    return { getAllAppointments, cancelGetAllAppointments: () => abortControllerRef.current?.abort() };
};


export const useCreateRequestAppointment = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const createRequestAppointment = async (data: CreateRequestAppointment) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<CreateRequestAppointment, CreateRequestAppointmentResponse>(
            `${baseUrl}/RequestAppointment`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { createRequestAppointment, cancelCreateRequestAppointment: () => abortControllerRef.current?.abort() };
};

export const useUpdateAppointmentRequest = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const updateAppointmentRequest = async (data: UpdateAppointmentRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<UpdateAppointmentRequest, UpdateAppointmentResponse>(
            `${baseUrl}/UpdateAppointmentRequest/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { updateAppointmentRequest, cancelUpdateAppointmentRequest: () => abortControllerRef.current?.abort() };
};