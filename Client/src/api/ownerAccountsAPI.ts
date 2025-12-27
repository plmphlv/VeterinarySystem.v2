import { useEffect, useRef } from "react";
import type { CreateOwnerAccountRequest, CreateOwnerAccountResponse, DeleteOwnerAccountRequest, EditOwnerAccountRequest, EditOwnerAccountResponse, GetOwnerAccountDetailsRequest, GetOwnerAccountDetailsResponse, SearchOwnerAccountRequest, SearchOwnerAccountResponse } from "../types";
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

        return http.get<GetOwnerAccountDetailsResponse>(
            `${baseUrl}/${id}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { getOwnerAccountDetails, cancelGetOwnerAccountDetails: () => abortControllerRef.current?.abort() };
};

export const useCreateOwnerAccount = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const createOwnerAccount = async (data: CreateOwnerAccountRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<CreateOwnerAccountRequest, CreateOwnerAccountResponse>(
            `${baseUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { createOwnerAccount, cancelCreateOwnerAccount: () => abortControllerRef.current?.abort() };
};

export const useEditOwnerAccount = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const editOwnerAccount = async (data: EditOwnerAccountRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.put<EditOwnerAccountRequest, EditOwnerAccountResponse>(
            `${baseUrl}/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { editOwnerAccount, cancelEditOwnerAccount: () => abortControllerRef.current?.abort() };
};

export const useDeleteOwnerAccount = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deleteOwnerAccount = async (data: DeleteOwnerAccountRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeleteOwnerAccountRequest>(
            `${baseUrl}/${data.id}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { deleteOwnerAccount, cancelDeleteOwnerAccount: () => abortControllerRef.current?.abort() };
};

export const useSearchOwnerAccount = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const searchOwnerAccount = async (data: SearchOwnerAccountRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        const params = new URLSearchParams();

        if (data.name) {
            params.append("Name", data.name);
        }

        if (data.email) {
            params.append("Email", data.email);
        }

        if (data.phoneNumber) {
            params.append("PhoneNumber", data.phoneNumber);
        }

        return http.get<SearchOwnerAccountResponse[]>(
            `${baseUrl}/SearchOwners?${params.toString()}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return {
        searchOwnerAccount,
        cancelSearchOwnerAccount: () => abortControllerRef.current?.abort()
    };
};
