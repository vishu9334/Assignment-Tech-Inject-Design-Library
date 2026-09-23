"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  loginWithSecret: (secret: string) => Promise<void>;
  loginWithCredentials: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("tech_inject_admin_token");
    const savedAdmin = localStorage.getItem("tech_inject_admin_user");
    if (savedToken && savedAdmin) {
      try {
        setToken(savedToken);
        setAdmin(JSON.parse(savedAdmin));
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithSecret = async (secret: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Admin login failed");
    }

    setToken(data.token);
    setAdmin(data.user);
    localStorage.setItem("tech_inject_admin_token", data.token);
    localStorage.setItem("tech_inject_admin_user", JSON.stringify(data.user));
  };

  const loginWithCredentials = async (email: string, pass: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Admin login failed");
    }

    setToken(data.token);
    setAdmin(data.user);
    localStorage.setItem("tech_inject_admin_token", data.token);
    localStorage.setItem("tech_inject_admin_user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("tech_inject_admin_token");
    localStorage.removeItem("tech_inject_admin_user");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        loginWithSecret,
        loginWithCredentials,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
