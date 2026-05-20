import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

export interface User {
  id?: number;
  name: string;
  email: string;
  plan: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("corbit_token");
  });

  const [user, setUserState] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("corbit_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    setAuthTokenGetter(() => token);
  }, [token]);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("corbit_token", newToken);
    } else {
      localStorage.removeItem("corbit_token");
      setUser(null); // Also clear user when token is cleared
    }
    setTokenState(newToken);
  };

  const setUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem("corbit_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("corbit_user");
    }
    setUserState(newUser);
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
