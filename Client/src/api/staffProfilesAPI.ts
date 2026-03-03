import { useEffect, useRef } from "react";
import http from "../utils/request";
import type { GetAllStaffProfilesRequest, GetStaffMembersResponse, GetStaffProfileDetailsResponse, AddStaffProfileRequest, AddStaffProfileResponse, DeleteStaffProfileResponse, StaffProfile } from "../types";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/StaffProfiles`;

export const useGetAllStaffProfiles = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getAllStaffProfiles = async (data: GetAllStaffProfilesRequest) => {
        abortControllerRef.current = new AbortController();

        const queryParams = new URLSearchParams();

        if (data.name) queryParams.append("Name", data.name);
        if (data.phoneNumber) queryParams.append("PhoneNumber", data.phoneNumber);
        if (data.email) queryParams.append("Email", data.email);

        const url = `${baseUrl}?${queryParams.toString()}`;

        return http.get<StaffProfile[]>(url, {
            signal: abortControllerRef.current.signal,
        });
    };

    return { getAllStaffProfiles, cancelGetAllStaffProfiles: () => abortControllerRef.current?.abort() };
};

export const useGetStaffProfileDetails = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getStaffProfileDetails = async (id: string) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<GetStaffProfileDetailsResponse>(
            `${baseUrl}/${id}`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return {
        getStaffProfileDetails,
        cancelGetStaffProfileDetails: () => abortControllerRef.current?.abort(),
    };
};

export const useAddStaffProfile = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const addStaffProfile = async (data: AddStaffProfileRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<AddStaffProfileRequest, AddStaffProfileResponse>(
            `${baseUrl}`,
            data,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { addStaffProfile, cancelAddStaffProfile: () => abortControllerRef.current?.abort() };
};

export const useDeleteStaffProfile = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const deleteStaffProfile = async (id: string) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.delete<DeleteStaffProfileResponse>(
            `${baseUrl}/${id}`,
            { signal: abortControllerRef.current.signal }
        );   
    };

    return { deleteStaffProfile, cancelDeleteStaffProfile: () => abortControllerRef.current?.abort() };
};

export const useGetStaffMembers = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const getStaffMembers = async () => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.get<GetStaffMembersResponse>(
            `${baseUrl}/GetStaffMembers`,
            { signal: abortControllerRef.current.signal }
        );
    };

    return {
        getStaffMembers,
        cancelGetStaffMembers: () => abortControllerRef.current?.abort(),
    };
};
