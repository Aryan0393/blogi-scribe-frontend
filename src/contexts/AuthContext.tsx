
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthState, User } from "@/types";
import { login as loginAPI, register as registerAPI, logout as logoutAPI } from "@/utils/api";
import { LoginCredentials, RegisterCredentials } from "@/types";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await loginAPI(credentials);
      
      setAuthState({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
      });
      
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      if (credentials.password !== credentials.confirm_password) {
        toast.error("Passwords do not match");
        return;
      }
      
      await registerAPI(credentials);
      toast.success("Registered successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const logout = () => {
    logoutAPI();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
