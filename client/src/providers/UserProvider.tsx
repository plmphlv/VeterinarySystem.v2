import usePersistedState from "../hooks/usePersistedState";
import { UserContext } from "../contexts/UserContext";
import type { AuthData, UserProviderProps, UserContextType } from "../types";

export default function UserProvider({ children }: UserProviderProps) {
  const [authData, setAuthData] = usePersistedState<AuthData>("auth", {
    accessToken: "",
    refreshToken: "",
    isSuccessful: false,
    errorMessage: "",
  });

  const userLoginHandler = (resultData: AuthData) => {
    setAuthData(resultData);
  };

  const userLogoutHandler = () => {
    setAuthData({
      accessToken: "",
      refreshToken: "",
      isSuccessful: false,
      errorMessage: "",
    });
  };

  const contextValue: UserContextType = {
    ...authData,
    userLoginHandler,
    userLogoutHandler,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}