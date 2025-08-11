import { useEffect, useState } from "react";
import type { UserDataFromId } from "../../types";
import { getUserId } from "../../utils/getUserId";
import http from "../../utils/request";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Users/Account`;

export const useGetUserData = () => {
    const [userData, setUserData] = useState<UserDataFromId | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = getUserId();
        if (!id) return;

        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await http.get<UserDataFromId>(`${baseUrl}/${id}`);
                setUserData(response ?? null);
            } catch (err) {
                console.error("Failed to fetch user data by ID", err);
                setError("Failed to load user data");
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userData, isLoading, error };
};