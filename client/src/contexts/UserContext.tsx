import { createContext, useContext } from "react";
import type { UserContextType } from "../types";

export const UserContext = createContext<UserContextType>({
    accessToken: "",
    refreshToken: "",
    isSuccessful: false,
    errorMessage: "",
    userLoginHandler: () => { },
    userLogoutHandler: () => { },
});

export function useUserContext() {
    return useContext(UserContext);
}