import { useEffect } from "react";
import { Calendar, Lock, Mail, User, Users } from "lucide-react";
import { useAuthPageStore } from "../../stores/authStores/authPageStore";
import { useRegister } from "../../hooks/useAuth";
import { useAuthForms } from "../../contexts/AuthFormsContext";

import type { RegisterFormData } from "../../schemas/authSchemas";
import type { Gender } from "../../types/auth/user.types";

import Input from "../ui/Input";
import Select from "../ui/Select";
import LoadingSpinner from "../ui/LoadingSpinner";

const SignupTab = () => {
	const { setRegisterMutation, setUserEmail, setShowOtpVerification } = useAuthPageStore();
	const { registerForm } = useAuthForms();
	const registerMutation = useRegister();

	const handleSignupSubmit = (data: RegisterFormData) => {
		registerMutation.mutate(data, {
			onSuccess: (res) => {
				console.log(res);
				setUserEmail(data.email);
				setShowOtpVerification(true);
			},
			onError: (res) => {
				console.log(res);
			},
		});
	};

	useEffect(() => {
		setRegisterMutation(registerMutation);
	}, []);

	return (
		<form
			onSubmit={registerForm.handleSubmit(handleSignupSubmit)}
			className="flex flex-col gap-12"
		>
			<div className="flex flex-col gap-5">
				{/* First Name */}
				<div>
					<Input
						value={registerForm.watch("firstName")}
						onChangeFunc={(e) => registerForm.setValue("firstName", e.target.value)}
						Icon={User}
						type="text"
						inputName="firstName"
						placeholder="First name"
					/>
					{registerForm.formState.errors.firstName && (
						<p className="text-red-500 text-sm mt-1">
							{registerForm.formState.errors.firstName.message}
						</p>
					)}
				</div>

				{/* Last Name */}
				<div>
					<Input
						value={registerForm.watch("lastName")}
						onChangeFunc={(e) => registerForm.setValue("lastName", e.target.value)}
						Icon={User}
						type="text"
						inputName="lastName"
						placeholder="Last name"
					/>
					{registerForm.formState.errors.lastName && (
						<p className="text-red-500 text-sm mt-1">
							{registerForm.formState.errors.lastName.message}
						</p>
					)}
				</div>

				{/* Email */}
				<div>
					<Input
						value={registerForm.watch("email")}
						onChangeFunc={(e) => registerForm.setValue("email", e.target.value)}
						Icon={Mail}
						type="email"
						inputName="email"
						placeholder="Email"
					/>
					{registerForm.formState.errors.email && (
						<p className="text-red-500 text-sm mt-1">
							{registerForm.formState.errors.email.message}
						</p>
					)}
				</div>

				{/* Birthdate */}
				<div>
					<Input
						value={registerForm.watch("birthdate")}
						onChangeFunc={(e) => registerForm.setValue("birthdate", e.target.value)}
						Icon={Calendar}
						type="date"
						inputName="birthdate"
					/>
					{registerForm.formState.errors.birthdate && (
						<p className="text-red-500 text-sm mt-1">
							{registerForm.formState.errors.birthdate.message}
						</p>
					)}
				</div>

				{/* Gender */}
				<div>
					<Select
						value={registerForm.watch("gender")}
						onChangeFunc={(e) =>
							registerForm.setValue("gender", e.target.value as Gender)
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
					{registerForm.formState.errors.gender && (
						<p className="text-red-500 text-sm mt-1">
							{registerForm.formState.errors.gender.message}
						</p>
					)}
				</div>

				{/* Password */}
				<div>
					<Input
						value={registerForm.watch("password")}
						onChangeFunc={(e) => registerForm.setValue("password", e.target.value)}
						Icon={Lock}
						type="password"
						inputName="password"
						placeholder="Password"
					/>
					{registerForm.formState.errors.password && (
						<p className="text-red-500 text-sm mt-1">
							{registerForm.formState.errors.password.message}
						</p>
					)}
				</div>

				{/* Confirm Password */}
				<div>
					<Input
						value={registerForm.watch("confirmPassword")}
						onChangeFunc={(e) =>
							registerForm.setValue("confirmPassword", e.target.value)
						}
						Icon={Lock}
						type="password"
						inputName="confirmPassword"
						placeholder="Confirm password"
					/>
					{registerForm.formState.errors.confirmPassword && (
						<p className="text-red-500 text-sm mt-1">
							{registerForm.formState.errors.confirmPassword.message}
						</p>
					)}
				</div>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={registerMutation.isPending}
				className={`w-full p-3 border-none rounded-4xl bg-primary text-lg ${
					registerMutation.isPending
						? "cursor-not-allowed opacity-70"
						: "cursor-pointer opacity-100"
				}`}
			>
				{registerMutation.isPending ? (
					<LoadingSpinner customSize="h-6 border-2" />
				) : (
					"Sign Up"
				)}
			</button>
		</form>
	);
};

export default SignupTab;
