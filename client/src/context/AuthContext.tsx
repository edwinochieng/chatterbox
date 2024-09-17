import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
}

interface AuthContextType {
  authTokens: AuthTokens | null;
  user: User | null;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const decodeToken = (token: string): User => {
    const payload = atob(token.split(".")[1]);
    return JSON.parse(payload);
  };

  const login = (tokens: AuthTokens) => {
    setAuthTokens(tokens);
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    const decodedUser = decodeToken(tokens.accessToken);
    setUser(decodedUser);
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  useEffect(() => {
    const storedTokens = localStorage.getItem("authTokens");
    if (storedTokens) {
      const tokens: AuthTokens = JSON.parse(storedTokens);
      setAuthTokens(tokens);
      const decodedUser = decodeToken(tokens.accessToken);
      setUser(decodedUser);
    }
  }, []);

  const isAuthenticated = !!authTokens;

  return (
    <AuthContext.Provider
      value={{ authTokens, user, login, logout, isAuthenticated }}
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
