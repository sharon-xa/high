import type { Gender, Role } from "./user.types";

export interface User {
    id: string;
    name: string;
    email: string;
    birthdate: string;
    gender: Gender;
    role?: Role;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<AuthResult>;
    register: (userData: RegisterData) => Promise<AuthResult>;
    verifyOtp: (otp: string, email: string) => Promise<AuthResult>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    clearError: () => void;
    checkAuth: () => Promise<boolean>;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    gender: Gender;
    password: string;
}

export interface AuthResult {
    success: boolean;
    message?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}