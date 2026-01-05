import { Lock, Mail } from "lucide-react";
import { type LoginFormData } from "../../schemas/authSchemas";
import { useLocation, useNavigate } from "react-router";
import { useAuthPageStore } from "../../stores/authStores/authPageStore";
import { useEffect } from "react";
import { useLogin } from "../../hooks/useAuth";
import { useAuthForms } from "../../contexts/AuthFormsContext";

import Input from "../ui/Input";
import LoadingSpinner from "../ui/LoadingSpinner";

interface LocationState {
	from?: {
		pathname: string;
	};
}

const LoginTab = () => {
	const { setLoginMutation } = useAuthPageStore();
	const { loginForm } = useAuthForms();

	const location = useLocation();
	const navigate = useNavigate();
	const from = (location.state as LocationState)?.from?.pathname || "/";
	const loginMutation = useLogin();

	const handleLoginSubmit = (data: LoginFormData) => {
		console.log("Submit Login");
		loginMutation!.mutate(data, {
			onSuccess: (res) => {
				console.log(res);
				navigate(from, { replace: true });
			},
		});
	};

	useEffect(() => {
		setLoginMutation(loginMutation);
	}, []);

	return (
		<form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="flex flex-col gap-12">
			<div className="flex flex-col gap-5">
				{/* Email Input */}
				<div>
					<Input
						value={loginForm.watch("email")}
						onChangeFunc={(e) => loginForm.setValue("email", e.target.value)}
						Icon={Mail}
						type="email"
						inputName="email"
						placeholder="Email"
					/>
					{loginForm.formState.errors.email && (
						<p className="text-red-500 text-sm mt-1">
							{loginForm.formState.errors.email.message}
						</p>
					)}
				</div>

				{/* Password Input */}
				<div>
					<Input
						value={loginForm.watch("password")}
						onChangeFunc={(e) => loginForm.setValue("password", e.target.value)}
						Icon={Lock}
						type="password"
						inputName="password"
						placeholder="Password"
					/>
					{loginForm.formState.errors.password && (
						<p className="text-red-500 text-sm mt-1">
							{loginForm.formState.errors.password.message}
						</p>
					)}
				</div>

				{/* Forgot Password Link */}
				<div className="text-left">
					<a
						href="/forgot-password"
						className="text-gray-400 text-sm underline hover:text-gray-300 transition-colors"
					>
						Forgot Password?
					</a>
				</div>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				// disabled={loginMutation.isPending || !loginForm.formState.isValid}
				className={`w-full h-14 p-3 border-none rounded-4xl bg-primary text-lg ${
					loginMutation.isPending
						? "cursor-not-allowed opacity-70"
						: "cursor-pointer opacity-100"
				}`}
			>
				{loginMutation.isPending ? <LoadingSpinner customSize="h-6 border-2" /> : "Login"}
			</button>
		</form>
	);
};

export default LoginTab;
