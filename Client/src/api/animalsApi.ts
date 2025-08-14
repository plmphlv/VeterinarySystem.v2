import { useRef, useEffect } from 'react';
import http from '../utils/request';
import type { AddAnimalRequest, AddAnimalResponse, Animal, GetAllAnimalsRequest, GetAnimalDetailsRequest, GetAnimalDetailsResponse } from '../types';

const AnimalsUrl = `${import.meta.env.VITE_BASE_API_URL}/Animals`;

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
            `${AnimalsUrl}?OwnerId=${data.ownerId}`,
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
            `${AnimalsUrl}/Details/${id}`,
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
            `${AnimalsUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { addAnimal, cancelAddAnimal: () => abortControllerRef.current?.abort() };
};

