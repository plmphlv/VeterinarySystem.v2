import { useEffect, useRef } from "react";
import http from "../utils/request";
import type { CreateProcedureRequest, CreateProcedureResponse, DeleteProcedureRequest, EditProcedureRequest, EditProcedureResponse, GetAllProceduresRequest, GetAllProceduresResponse, GetProcedureDetailsRequest, GetProcedureDetailsResponse, Procedure } from "../types";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Procedures`;

export const useGetAllProcedures = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllProcedures = async (data: GetAllProceduresRequest) => {
        abortControllerRef.current = new AbortController();

        const queryParams = new URLSearchParams();

        if (data.StaffId) queryParams.append("StaffId", data.StaffId);
        if (data.AnimalId) queryParams.append("AnimalId", (data.AnimalId).toString());
        if (data.ProcedureName) queryParams.append("ProcedureName", data.ProcedureName);
        if (data.Description) queryParams.append("Description", data.Description);
        if (data.StartDate) queryParams.append("StartDate", data.StartDate);
        if (data.EndDate) queryParams.append("EndDate", data.EndDate);

        const url = `${baseUrl}/SearchProcedures?${queryParams.toString()}`;

        return http.get<Procedure[]>(url, {
            signal: abortControllerRef.current.signal,
        });
    };

    return { getAllProcedures, cancelGetAllProcedures: () => abortControllerRef.current?.abort() };
};

export const useGetProcedureDetails = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getProcedureDetails = async (data: GetProcedureDetailsRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<GetProcedureDetailsResponse>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return {
        getProcedureDetails,
        cancelGetProcedureDetails: () => abortControllerRef.current?.abort(),
    };
};

export const useCreateProcedure = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const createProcedure = async (data: CreateProcedureRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<CreateProcedureRequest, CreateProcedureResponse>(
            `${baseUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { createProcedure, cancelCreateProcedure: () => abortControllerRef.current?.abort() };
};

export const useEditProcedure = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const editProcedure = async (data: EditProcedureRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.put<EditProcedureRequest, EditProcedureResponse>(
            `${baseUrl}/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { editProcedure, cancelEditProcedure: () => abortControllerRef.current?.abort() };
};

export const useDeleteProcedure = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deleteProcedure = async (data: DeleteProcedureRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeleteProcedureRequest>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { deleteProcedure, cancelDeleteProcedure: () => abortControllerRef.current?.abort() };
};