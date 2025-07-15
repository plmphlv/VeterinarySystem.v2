import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';
import http from '../utils/request';

const baseUrl = 'https://localhost:44348/api/Users';

export const useLogin = () => {
    const login = async (data: LoginRequest) => {
        return http.post<LoginRequest, LoginResponse>(
            `${baseUrl}/Login`,
            data
        );
    };

    return { login };
};

export const useRegister = () => {
    const register = async (data: RegisterRequest) => {
        return http.post<RegisterRequest, RegisterResponse>(
            `${baseUrl}/Register`,
            data
        );
    };

    return { register };
};