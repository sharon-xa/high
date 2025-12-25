import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";

export const authKeys = {
	all: ["auth"] as const,
	verify: () => [...authKeys.all, "verify"] as const,
	user: () => [...authKeys.all, "user"] as const,
};

export const useLogin = () => {
	const { setAuth } = useAuthStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: (data) => {
			setAuth(data.user, data.token);
			queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: authApi.register,
	});
};

export const useVerifyOtp = () => {
	const { setAuth } = useAuthStore();

	return useMutation({
		mutationFn: ({ otp, email }: { otp: string; email: string }) =>
			authApi.verifyOtp(otp, email),
		onSuccess: (data) => {
			if (data.user && data.token) {
				setAuth(data.user, data.token);
			}
		},
	});
};

export const useResendOtp = () => {
	return useMutation({
		mutationFn: (email: string) => authApi.resendOtp(email),
	});
};

export const useLogout = () => {
	const { clearAuth } = useAuthStore();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => {
			clearAuth();
			queryClient.clear();
			navigate("/auth");
		},
		onError: () => {
			clearAuth();
			queryClient.clear();
			navigate("/auth");
		},
	});
};

export const useCheckAuth = () => {
	const { token, setAuth, clearAuth } = useAuthStore();

	return useMutation({
		mutationFn: authApi.verifyToken,
		onSuccess: (data) => {
			if (token) {
				setAuth(data.user, token);
			}
		},
		onError: () => {
			clearAuth();
		},
	});
};

export const useAuthState = () => {
	const { user, token, isAuthenticated } = useAuthStore();
	const { isPending, isError } = useCheckAuth();

	return {
		user,
		token,
		isAuthenticated,
		isPending: isPending && !!token,
		isError,
	};
};
