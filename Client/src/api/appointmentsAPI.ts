import { useEffect, useRef } from "react";
import http from "../utils/request";

// Import for user appointments:
import type { Appointment, CreateRequestAppointment, CreateRequestAppointmentResponse, DeleteAppointmentRequest, DeleteAppointmentResponse, GetAllAppointmentsRequest, GetAppointmentDetailsRequest, GetAppointmentDetailsResponse, GetOwnerAppointmentsRequest, UpdateAppointmentRequest, UpdateAppointmentResponse } from "../types";

// Import for staff appointments:
import type { CompleteAppointmentRequest, CreateAppointmentRequest, CreateAppointmentResponse, EditAppointmentRequest, EditAppointmentResponse } from "../types";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Appointments`;

// User appointments (staff members have access too):
export const useGetAllAppointments = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllAppointments = async (
        data: GetOwnerAppointmentsRequest | GetAllAppointmentsRequest
    ) => {
        abortControllerRef.current = new AbortController();

        const queryParams = new URLSearchParams();

        if (data.OwnerId) queryParams.append("OwnerId", data.OwnerId);
        if (data.StaffId) queryParams.append("StaffId", data.StaffId);
        if (data.Status) queryParams.append("Status", data.Status);
        if (data.StartDate) queryParams.append("StartDate", data.StartDate);
        if (data.EndDate) queryParams.append("EndDate", data.EndDate);

        const url = `${baseUrl}/GetAppointments?${queryParams.toString()}`;

        return http.get<Appointment[]>(url, {
            signal: abortControllerRef.current.signal,
        });
    };


    return { getAllAppointments, cancelGetAllAppointments: () => abortControllerRef.current?.abort() };
};

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

        return http.get<GetAppointmentDetailsResponse>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { getAppointmentDetails, cancelGetAppointmentDetails: () => abortControllerRef.current?.abort() };
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

        console.log(`API: ${data.date}`);

        return http.put<UpdateAppointmentRequest, UpdateAppointmentResponse>(
            `${baseUrl}/UpdateAppointmentRequest/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { updateAppointmentRequest, cancelUpdateAppointmentRequest: () => abortControllerRef.current?.abort() };
};

export const useDeleteAppointmentRequest = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deleteAppointmentRequest = async (data: DeleteAppointmentRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeleteAppointmentResponse>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { deleteAppointmentRequest, cancelDeleteAppointmentRequest: () => abortControllerRef.current?.abort() };
};

// Staff Appointments (only for staff members):
export const useGetAllAppointmentsStaff = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllAppointmentsStaff = async (data: GetOwnerAppointmentsRequest | GetAllAppointmentsRequest) => {
        abortControllerRef.current = new AbortController();

        const queryParams = new URLSearchParams();

        if (data.OwnerId) queryParams.append("OwnerId", data.OwnerId);
        if (data.StaffId) queryParams.append("StaffId", data.StaffId);
        if (data.Status) queryParams.append("Status", data.Status);
        if (data.StartDate) queryParams.append("StartDate", data.StartDate);
        if (data.EndDate) queryParams.append("EndDate", data.EndDate);

        const url = `${baseUrl}/GetAppointments?${queryParams.toString()}`;

        return http.get<Appointment[]>(url, {
            signal: abortControllerRef.current.signal,
        });
    };


    return { getAllAppointmentsStaff, cancelGetAllAppointmentsStaff: () => abortControllerRef.current?.abort() };
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