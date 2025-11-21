import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthActions, LoginCredentials, RegisterData, AuthResult, AuthResponse, User } from '../types/auth.types';
import api from '../api/axiosConfig';
import axios from 'axios';

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action
            login: async (credentials: LoginCredentials): Promise<AuthResult> => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post<AuthResponse>('/auth/login', credentials);
                    const data = response.data;

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return { success: true };
                } catch (error) {
                    const errorMessage = axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Login failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    return { success: false, message: errorMessage };
                }
            },

            // Register action
            register: async (userData: RegisterData): Promise<AuthResult> => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post<AuthResponse>('/auth/register', userData);
                    const data = response.data;

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });

                    return { success: true };
                } catch (error) {
                    const errorMessage = axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Registration failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                    return { success: false, message: errorMessage };
                }
            },

            verifyOtp: async (otp: string, email: string): Promise<AuthResult> => {
                try {
                    const response = await api.post<AuthResult>('/auth/verify-email', { otp, email });
                    const data = response.data;

                    set({
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });

                    return data;
                } catch (error) {
                    const errorMessage = axios.isAxiosError(error)
                        ? error.response?.data?.message || error.message
                        : 'Registration failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                    return { success: false, message: errorMessage };
                }
            },

            // Logout action
            logout: (): void => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Update user data
            updateUser: (userData: Partial<User>): void => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...userData } });
                }
            },

            // Clear error
            clearError: (): void => {
                set({ error: null });
            },

            // Check if token is valid (optional, for token refresh)
            checkAuth: async (): Promise<boolean> => {
                const token = get().token;
                if (!token) {
                    set({ isAuthenticated: false, user: null });
                    return false;
                }

                try {
                    const response = await api.get<{ user: User }>('/auth/verify');
                    const data = response.data;
                    set({ user: data.user, isAuthenticated: true });
                    return true;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    set({ isAuthenticated: false, user: null, token: null });
                    return false;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
