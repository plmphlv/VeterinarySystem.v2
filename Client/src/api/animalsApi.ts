import { useContext, useRef, useEffect } from 'react';
import http from '../utils/request';
import { UserContext } from '../contexts/UserContext';
import type { AddAnimalRequest, AddAnimalResponse, MyAnimal, MyAnimalsRequest } from '../types';

const AnimalsUrl = `${import.meta.env.VITE_BASE_API_URL}/Animals`;
const AnimalTypesUrl = `${import.meta.env.VITE_BASE_API_URL}/AnimalTypes`;

export const useGetAllAnimals = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllAnimals = async (data: MyAnimalsRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<MyAnimal[]>(
            `${AnimalsUrl}?OwnerId=${data.ownerId}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { getAllAnimals, cancelGetAllAnimals: () => abortControllerRef.current?.abort() };
};

// export const useAddAnimal = () => {
//     const abortControllerRef = useRef<AbortController | null>(null);

//     useEffect(() => {
//         return () => {
//             abortControllerRef.current?.abort();
//         };
//     }, []);

//     const addAnimal = async (data: AddAnimalRequest) => {
//         abortControllerRef.current?.abort();
//         abortControllerRef.current = new AbortController();

//         return http.post<AddAnimalRequest, AddAnimalResponse>(
//             `${AnimalsUrl}`,
//             data,
//             { signal: abortControllerRef.current.signal }
//         );
//     };

//     return { addAnimal, cancelAddAnimal: () => abortControllerRef.current?.abort() };
// };
