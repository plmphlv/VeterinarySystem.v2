import { createContext, useContext } from 'react';
import type { UserContextType } from '../types';

export const UserContext = createContext<UserContextType>({
    user: null,
    userLoginHandler: () => {},
    userLogoutHandler: () => {},
});

export function useUserContext(): UserContextType {
    return useContext(UserContext);
}