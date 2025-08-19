import { useEffect, useRef } from "react";
import http from "../utils/request";
import type { AddAnimalTypeRequest, AddAnimalTypeResponse, AnimalType, DeleteAnimalTypeRequest, EditAnimalTypeRequest, EditAnimalTypeResponse } from "../types";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/AnimalTypes`;

export const useGetAnimalTypes = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAnimalTypes = async () => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<AnimalType[]>(
            `${baseUrl}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { getAnimalTypes, cancelGetAnimalTypes: () => abortControllerRef.current?.abort() };
};

export const useAddAnimalType = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const addAnimalType = async (data: AddAnimalTypeRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<AddAnimalTypeRequest, AddAnimalTypeResponse>(
            `${baseUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { addAnimalType, cancelAddAnimalType: () => abortControllerRef.current?.abort() };
};

export const useEditAnimalType = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const editAnimalType = async (data: EditAnimalTypeRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<EditAnimalTypeRequest, EditAnimalTypeResponse>(
            `${baseUrl}/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { editAnimalType, cancelEditAnimalType: () => abortControllerRef.current?.abort() };
};

export const useDeleteAnimalType = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deleteAnimalType = async (data: DeleteAnimalTypeRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeleteAnimalTypeRequest>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { deleteAnimalType, cancelDeleteAnimalType: () => abortControllerRef.current?.abort() };
};
