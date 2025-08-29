import { useEffect, useState } from "react";
import type { UserDataFromId } from "../types";
import http from "../utils/request";
import { getJwtDecodedData } from "../utils/getJwtDecodedData";

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Users/Account`;

export const useGetUserData = () => {
    const [userData, setUserData] = useState<UserDataFromId | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const decodedData = getJwtDecodedData();
        if (!decodedData) return;

        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (decodedData.AccountId) {
                    const response = await http.get<UserDataFromId>(`${baseUrl}/${decodedData.AccountId}`);
                    setUserData(response || null);
                } else if (decodedData.StaffId){
                    const response = await http.get<UserDataFromId>(`${baseUrl}/${decodedData.StaffId}`);
                    setUserData(response || null);
                }

            } catch (err) {
                setError("Failed to load user data, please try again later.");
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userData, isLoading, error };
};