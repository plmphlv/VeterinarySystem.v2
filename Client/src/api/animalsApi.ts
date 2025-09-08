import { useRef, useEffect } from 'react';
import http from '../utils/request';
import type { AddAnimalRequest, AddAnimalResponse, Animal, DeleteAnimalRequest, EditAnimalRequest, EditAnimalResponse, GetAllAnimalsRequest, GetAnimalDetailsRequest, GetAnimalDetailsResponse } from '../types';

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Animals`;

export const useGetAllAnimals = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllAnimals = async (data: GetAllAnimalsRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<Animal[]>(
            `${baseUrl}?OwnerId=${data.ownerId}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { getAllAnimals, cancelGetAllAnimals: () => abortControllerRef.current?.abort() };
};

export const useGetAnimalDetails = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAnimalDetails = async (id: number) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<GetAnimalDetailsResponse>(
            `${baseUrl}/Details/${id}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { getAnimalDetails, cancelGetAnimalDetails: () => abortControllerRef.current?.abort() };
};

export const useAddAnimal = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const addAnimal = async (data: AddAnimalRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<AddAnimalRequest, AddAnimalResponse>(
            `${baseUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { addAnimal, cancelAddAnimal: () => abortControllerRef.current?.abort() };
};

export const useEditAnimal = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const editAnimal = async (data: EditAnimalRequest) => {
        abortControllerRef.current = new AbortController();

        return http.put<EditAnimalRequest, EditAnimalResponse>(
            `${baseUrl}/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { editAnimal, cancelEditAnimal: () => abortControllerRef.current?.abort() };
};

export const useDeleteAnimal = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deleteAnimal = async (data: DeleteAnimalRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeleteAnimalRequest>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { deleteAnimal, cancelDeleteAnimal: () => abortControllerRef.current?.abort() };
};

