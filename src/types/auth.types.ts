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
}

export interface AuthActions {
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    updateUser: (userData: Partial<User>) => void;
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

export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    gender: Gender;
    password: string;
    confirmPassword: string;
}