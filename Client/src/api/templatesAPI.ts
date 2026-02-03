import { useEffect, useRef } from "react";
import http from "../utils/request";
import type { CreateTemplateRequest, CreateTemplateResponse, DeleteTemplateRequest, EditTemplateRequest, EditTemplateResponse, GetAllTemplatesRequest, GetTemplateDetailsRequest, Template } from "../types";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Templates`;

export const useGetAllTemplates = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllTemplates = async (data: GetAllTemplatesRequest) => {
        abortControllerRef.current = new AbortController();

        const queryParams = new URLSearchParams();

        if (data.Type) queryParams.append("Type", data.Type);
        if (data.Name) queryParams.append("Name", data.Name);
        if (data.IsActive) queryParams.append("IsActive", data.IsActive.toString());

        const url = `${baseUrl}?${queryParams.toString()}`;

        return http.get<Template[]>(url, {
            signal: abortControllerRef.current.signal,
        });
    };

    return { getAllTemplates, cancelGetAllTemplates: () => abortControllerRef.current?.abort() };
};

export const useGetTemplateDetails = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getTemplateDetails = async (id: string) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<GetTemplateDetailsRequest>(
            `${baseUrl}/${id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return {
        getTemplateDetails,
        cancelGetTemplateDetails: () => abortControllerRef.current?.abort(),
    };
};

export const useCreateTemplate = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const createTemplate = async (data: CreateTemplateRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<CreateTemplateRequest, CreateTemplateResponse>(
            `${baseUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { createTemplate, cancelCreateTemplate: () => abortControllerRef.current?.abort() };
};

export const useEditTemplate = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const editTemplate = async (data: EditTemplateRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.put<EditTemplateRequest, EditTemplateResponse>(
            `${baseUrl}/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { editTemplate, cancelEditTemplate: () => abortControllerRef.current?.abort() };
};


export const useDeleteTemplate = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deleteTemplate = async (id: string) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeleteTemplateRequest>(
            `${baseUrl}/${id}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { deleteTemplate, cancelDeleteTemplate: () => abortControllerRef.current?.abort() };
};