import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  userId: string;
  exp: number;
}

interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  emailVerified: Date | null;
  password: string;
  imageUrl: string | null;
  bio: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  authTokens: AuthTokens | null;
  user: User | null;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
  isAuthenticated: boolean;
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const decodeToken = (token: string): User => {
    const payload = atob(token.split(".")[1]);
    return JSON.parse(payload);
  };

  const login = (tokens: AuthTokens) => {
    setAuthTokens(tokens);
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    const decodedUser = decodeToken(tokens.accessToken);
    setUser(decodedUser);

    scheduleTokenRefresh(tokens.accessToken);
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    clearTimeout(refreshTimeoutId);
  };

  let refreshTimeoutId: NodeJS.Timeout;

  const scheduleTokenRefresh = (accessToken: string) => {
    const decoded = decodeToken(accessToken);
    const expiresIn = decoded.exp * 1000 - Date.now() - 60000; // Refresh 1 minute before expiry
    refreshTimeoutId = setTimeout(refreshToken, expiresIn);
  };

  const refreshToken = async () => {
    try {
      const storedTokens = localStorage.getItem("authTokens");
      if (!storedTokens) return;

      const tokens: AuthTokens = JSON.parse(storedTokens);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
        {
          refreshToken: tokens.refreshToken,
        }
      );

      const newTokens = {
        accessToken: data.accessToken,
        refreshToken: tokens.refreshToken,
      };

      setAuthTokens(newTokens);
      localStorage.setItem("authTokens", JSON.stringify(newTokens));

      const decodedUser = decodeToken(newTokens.accessToken);
      setUser(decodedUser);

      scheduleTokenRefresh(newTokens.accessToken);
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
    }
  };

  useEffect(() => {
    const storedTokens = localStorage.getItem("authTokens");
    if (storedTokens) {
      const tokens: AuthTokens = JSON.parse(storedTokens);
      setAuthTokens(tokens);
      const decodedUser = decodeToken(tokens.accessToken);
      setUser(decodedUser);

      scheduleTokenRefresh(tokens.accessToken);
    }

    return () => clearTimeout(refreshTimeoutId);
  }, []);

  const isAuthenticated = !!authTokens;

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        user,
        login,
        logout,
        isAuthenticated,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Must be used within an AuthProvider");
  }
  return context;
};
