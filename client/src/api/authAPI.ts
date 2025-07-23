import { useContext } from 'react';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';
import http from '../utils/request';
import { UserContext } from '../contexts/UserContext';

const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/Users`;

export const useLogin = () => {
    const login = async (data: LoginRequest) => {
        return http.post<LoginRequest, LoginResponse>(
            `${baseUrl}/Login`,
            data
        );
    };

    console.log(baseUrl);
    

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

export const useLogout = () => {
    const { accessToken, userLogoutHandler } = useContext(UserContext);

    const logout = () => {
        localStorage.removeItem("auth");
        userLogoutHandler();
    };

    return {
        logout,
        isLoggedOut: !accessToken,
    };
};

// export const useEditProfile = () => {
//     const editProfile = async (data: LoginRequest) => {
//         return http.post<LoginRequest, LoginResponse>(
//             `${baseUrl}/Login`,
//             data
//         );
//     };

//     return { login };
// };
