"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookieStore } from "@/helper/store";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing access token on mount
    const checkAuthStatus = async () => {
      const token = await getCookieStore(process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string);
      if (token) {
        setAccessToken(token);
        setIsAuthenticated(true);
      }
    };

    checkAuthStatus();
  }, []);

  const handleSetAccessToken = (token: string | null) => {
    setAccessToken(token);
    setIsAuthenticated(!!token);
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    // Clear cookies
    document.cookie = `${process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        setAccessToken: handleSetAccessToken,
        logout,
      }}
    >
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