"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  quickLogin: (type: "free" | "premium") => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("tech_inject_token");
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("tech_inject_token", data.token);
  };

  const quickLogin = async (type: "free" | "premium") => {
    if (type === "free") {
      await login("free@techinject.io", "User@12345");
    } else {
      await login("premium@techinject.io", "Premium@12345");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tech_inject_token");
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, quickLogin, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
