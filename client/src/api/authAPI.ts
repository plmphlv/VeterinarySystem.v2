import { useContext, useRef, useEffect } from 'react';
import type { ChangePasswordRequest, ChangePasswordResponse, EditProfileRequest, EditProfileResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';
import http from '../utils/request';
import { UserContext } from '../contexts/UserContext';

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Users`;

export const useLogin = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const login = async (data: LoginRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<LoginRequest, LoginResponse>(
            `${baseUrl}/Login`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { login, cancelLogin: () => abortControllerRef.current?.abort() };
};

export const useRegister = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const register = async (data: RegisterRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.post<RegisterRequest, RegisterResponse>(
            `${baseUrl}/Register`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { register, cancelRegister: () => abortControllerRef.current?.abort() };
};

export const useLogout = () => {
    const { accessToken, userLogoutHandler } = useContext(UserContext);

    const logout = () => {     
        userLogoutHandler();
    };

    return {
        logout,
        isLoggedOut: !accessToken,
    };
};

export const useChangePassword = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const changePassword = async (data: ChangePasswordRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.put<ChangePasswordRequest, ChangePasswordResponse>(
            `${baseUrl}/ChangePassword`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { changePassword, cancelChangePassword: () => abortControllerRef.current?.abort() };
};


export const useEditProfile = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const editProfile = async (data: EditProfileRequest) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        return http.put<EditProfileRequest, EditProfileResponse>(
            `${baseUrl}/UpdateAccount/${data.id}`,
            data,
            { signal: abortControllerRef.current.signal }
        );
    };

    return { editProfile, cancelEditProfile: () => abortControllerRef.current?.abort() };
};

