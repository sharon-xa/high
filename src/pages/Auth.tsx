import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { Mail, Lock, User, Calendar, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Gender } from "../types/user.types";
import Input from "../components/formStuff/Input";
import Select from "../components/formStuff/Select";
import { useLogin, useRegister, useResendOtp, useVerifyOtp } from "../hooks/useAuth";
import {
	loginSchema,
	otpSchema,
	signupSchema,
	type LoginFormData,
	type OtpFormData,
	type SignupFormData,
} from "../schemas/authSchemas";

type TabType = "login" | "signup";

interface LocationState {
	from?: {
		pathname: string;
	};
}

const Auth = () => {
	const [activeTab, setActiveTab] = useState<TabType>("login");
	const [showOtpVerification, setShowOtpVerification] = useState(false);
	const [userEmail, setUserEmail] = useState("");

	const location = useLocation();
	const navigate = useNavigate();
	const from = (location.state as LocationState)?.from?.pathname || "/";

	const loginMutation = useLogin();
	const registerMutation = useRegister();
	const verifyOtpMutation = useVerifyOtp();
	const resendOtpMutation = useResendOtp();

	const loginForm = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const signupForm = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			birthdate: "",
			gender: "female",
			password: "",
			confirmPassword: "",
		},
	});

	const otpForm = useForm<OtpFormData>({
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: "" },
	});

	const handleLoginSubmit = (data: LoginFormData) => {
		console.log("Submit Login");
		loginMutation.mutate(data, {
			onSuccess: () => {
				navigate(from, { replace: true });
			},
		});
	};

	const handleSignupSubmit = (data: SignupFormData) => {
		const { confirmPassword, ...registerData } = data;

		registerMutation.mutate(registerData, {
			onSuccess: () => {
				setUserEmail(data.email);
				setShowOtpVerification(true);
			},
		});
	};

	const handleOtpSubmit = (data: OtpFormData) => {
		verifyOtpMutation.mutate(
			{ otp: data.otp, email: userEmail },
			{
				onSuccess: () => {
					// Reset everything
					setShowOtpVerification(false);
					signupForm.reset();
					loginForm.reset();
					otpForm.reset();
					setActiveTab("login");
					navigate("/auth", { replace: true });
				},
			}
		);
	};

	const handleResendOtp = () => {
		resendOtpMutation.mutate(userEmail);
	};

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab);
		setShowOtpVerification(false);
		loginForm.clearErrors();
		signupForm.clearErrors();
		loginMutation.reset();
		registerMutation.reset();
	};

	const getErrorMessage = (error: any) => {
		return error?.response?.data?.message || error?.message || "An error occurred";
	};

	const currentError = activeTab === "login" ? loginMutation.error : registerMutation.error;

	if (showOtpVerification) {
		return (
			<div className="min-h-dvh relative flex items-center justify-center">
				<div className="w-full max-w-md px-6">
					<div className="text-center mb-8">
						<h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
						<p className="text-gray-400 text-sm">
							We've sent a verification code to
							<br />
							<span className="font-semibold">{userEmail}</span>
						</p>
					</div>

					{/* Error Message */}
					{verifyOtpMutation.isError && (
						<div className="bg-red-500/20 border border-red-500 p-3 rounded-lg mb-5 text-center text-red-500">
							{getErrorMessage(verifyOtpMutation.error)}
						</div>
					)}

					{/* Success Message for Resend */}
					{resendOtpMutation.isSuccess && (
						<div className="bg-green-500/20 border border-green-500 p-3 rounded-lg mb-5 text-center text-green-500">
							OTP has been resent to your email
						</div>
					)}

					<form
						onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
						className="flex flex-col gap-6"
					>
						<div className="flex flex-col gap-2">
							<label className="text-sm text-gray-400">Enter OTP Code</label>
							<input
								type="text"
								{...otpForm.register("otp")}
								placeholder="000000"
								maxLength={6}
								className="w-full p-4 text-center text-2xl tracking-widest border-2 border-gray-600 rounded-xl bg-transparent focus:border-primary focus:outline-none"
								onChange={(e) => {
									const value = e.target.value.replace(/\D/g, "").slice(0, 6);
									otpForm.setValue("otp", value);
								}}
							/>
							{otpForm.formState.errors.otp && (
								<p className="text-red-500 text-sm">
									{otpForm.formState.errors.otp.message}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={verifyOtpMutation.isPending || !otpForm.formState.isValid}
							className={`w-full p-3 border-none rounded-4xl bg-primary text-lg ${
								verifyOtpMutation.isPending || !otpForm.formState.isValid
									? "cursor-not-allowed opacity-70"
									: "cursor-pointer opacity-100"
							}`}
						>
							{verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
						</button>

						<div className="text-center">
							<p className="text-sm text-gray-400 mb-2">Didn't receive the code?</p>
							<button
								type="button"
								onClick={handleResendOtp}
								disabled={resendOtpMutation.isPending}
								className="text-primary underline text-sm hover:text-primary/80 transition-colors disabled:opacity-50"
							>
								{resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
							</button>
						</div>

						<button
							type="button"
							onClick={() => setShowOtpVerification(false)}
							className="text-gray-400 text-sm hover:text-white transition-colors"
						>
							← Back to Sign Up
						</button>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center items-center gap-12 pt-32 pb-16">
			{/* Tab Buttons */}
			<div className="w-[290px] flex justify-center rounded-4xl shadow-[inset_0_0_0_4px_#3B3B3B]">
				<button
					type="button"
					onClick={() => handleTabChange("login")}
					className={`text-lg border-none rounded-4xl py-3 px-10 cursor-pointer transition-all duration-300 ${activeTab === "login" ? "bg-primary" : "bg-transparent"} min-w-36`}
				>
					Login
				</button>
				<button
					type="button"
					onClick={() => handleTabChange("signup")}
					className={`text-lg border-none rounded-4xl py-3 px-10 cursor-pointer transition-all duration-300 ${activeTab === "signup" ? "bg-primary" : "bg-transparent"} min-w-36`}
				>
					Sign Up
				</button>
			</div>

			{/* Error Message */}
			{currentError && (
				<div className="bg-red-500/20 border border-red-500 p-3 rounded-lg mb-5 text-center text-red-500 absolute-hor-center top-1/12 w-[400px]">
					{getErrorMessage(currentError)}
				</div>
			)}

			{/* ==================== LOGIN FORM ==================== */}
			{activeTab === "login" && (
				<form
					onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
					className="flex flex-col gap-12"
				>
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
						className={`w-full p-3 border-none rounded-4xl bg-primary text-lg ${
							loginMutation.isPending
								? "cursor-not-allowed opacity-70"
								: "cursor-pointer opacity-100"
						} focus:opacity-10`}
					>
						{loginMutation.isPending ? "Logging in..." : "Login"}
					</button>
				</form>
			)}

			{/* ==================== SIGNUP FORM ==================== */}
			{activeTab === "signup" && (
				<form
					onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
					className="flex flex-col gap-12"
				>
					<div className="flex flex-col gap-5">
						{/* First Name */}
						<div>
							<Input
								value={signupForm.watch("firstName")}
								onChangeFunc={(e) =>
									signupForm.setValue("firstName", e.target.value)
								}
								Icon={User}
								type="text"
								inputName="firstName"
								placeholder="First name"
							/>
							{signupForm.formState.errors.firstName && (
								<p className="text-red-500 text-sm mt-1">
									{signupForm.formState.errors.firstName.message}
								</p>
							)}
						</div>

						{/* Last Name */}
						<div>
							<Input
								value={signupForm.watch("lastName")}
								onChangeFunc={(e) =>
									signupForm.setValue("lastName", e.target.value)
								}
								Icon={User}
								type="text"
								inputName="lastName"
								placeholder="Last name"
							/>
							{signupForm.formState.errors.lastName && (
								<p className="text-red-500 text-sm mt-1">
									{signupForm.formState.errors.lastName.message}
								</p>
							)}
						</div>

						{/* Email */}
						<div>
							<Input
								value={signupForm.watch("email")}
								onChangeFunc={(e) => signupForm.setValue("email", e.target.value)}
								Icon={Mail}
								type="email"
								inputName="email"
								placeholder="Email"
							/>
							{signupForm.formState.errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{signupForm.formState.errors.email.message}
								</p>
							)}
						</div>

						{/* Birthdate */}
						<div>
							<Input
								value={signupForm.watch("birthdate")}
								onChangeFunc={(e) =>
									signupForm.setValue("birthdate", e.target.value)
								}
								Icon={Calendar}
								type="date"
								inputName="birthdate"
							/>
							{signupForm.formState.errors.birthdate && (
								<p className="text-red-500 text-sm mt-1">
									{signupForm.formState.errors.birthdate.message}
								</p>
							)}
						</div>

						{/* Gender */}
						<div>
							<Select
								value={signupForm.watch("gender")}
								onChangeFunc={(e) =>
									signupForm.setValue("gender", e.target.value as Gender)
								}
								Icon={Users}
								inputName="gender"
								options={[
									{ Title: "Gender", Value: "" as Gender, Disabled: true },
									{ Title: "Female", Value: "female" },
									{ Title: "Male", Value: "male" },
									{ Title: "Other", Value: "other" },
								]}
							/>
							{signupForm.formState.errors.gender && (
								<p className="text-red-500 text-sm mt-1">
									{signupForm.formState.errors.gender.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div>
							<Input
								value={signupForm.watch("password")}
								onChangeFunc={(e) =>
									signupForm.setValue("password", e.target.value)
								}
								Icon={Lock}
								type="password"
								inputName="password"
								placeholder="Password"
							/>
							{signupForm.formState.errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{signupForm.formState.errors.password.message}
								</p>
							)}
						</div>

						{/* Confirm Password */}
						<div>
							<Input
								value={signupForm.watch("confirmPassword")}
								onChangeFunc={(e) =>
									signupForm.setValue("confirmPassword", e.target.value)
								}
								Icon={Lock}
								type="password"
								inputName="confirmPassword"
								placeholder="Confirm password"
							/>
							{signupForm.formState.errors.confirmPassword && (
								<p className="text-red-500 text-sm mt-1">
									{signupForm.formState.errors.confirmPassword.message}
								</p>
							)}
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={registerMutation.isPending || !signupForm.formState.isValid}
						className={`w-full p-3 border-none rounded-4xl bg-primary text-lg ${
							registerMutation.isPending
								? "cursor-not-allowed opacity-70"
								: "cursor-pointer opacity-100"
						}`}
					>
						{registerMutation.isPending ? "Signing up..." : "Sign Up"}
					</button>
				</form>
			)}
		</div>
	);
};

export default Auth;
