import { useEffect, useRef } from "react";
import type { GetOwnerAccountDetailsRequest } from "../types";
import http from "../utils/request";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/OwnerAccounts`;

export const useGetOwnerAccountDetails = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getOwnerAccountDetails = async (id: string) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<GetOwnerAccountDetailsRequest>(
            `${baseUrl}/${id}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { getOwnerAccountDetails, cancelGetOwnerAccountDetails: () => abortControllerRef.current?.abort() };
};