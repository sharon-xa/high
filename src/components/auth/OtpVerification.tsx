import { useForm } from "react-hook-form";
import { otpSchema, type OtpFormData } from "../../schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResendOtp, useVerifyOtp } from "../../hooks/useAuth";
import { useAuthPageStore } from "../../stores/authStores/authPageStore";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../../pages/Auth";
import { useAuthForms } from "../../contexts/AuthFormsContext";
import LoadingSpinner from "../ui/LoadingSpinner";

const OtpVerification = () => {
	const { userEmail, setShowOtpVerification, setActiveTab } = useAuthPageStore();
	const { loginForm, registerForm } = useAuthForms();

	const navigate = useNavigate();

	const verifyOtpMutation = useVerifyOtp();
	const resendOtpMutation = useResendOtp();

	const otpForm = useForm<OtpFormData>({
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: "" },
	});

	const handleOtpSubmit = (data: OtpFormData) => {
		verifyOtpMutation.mutate(
			{ otp: data.otp, email: userEmail },
			{
				onSuccess: () => {
					// Reset everything
					setShowOtpVerification(false);
					registerForm.reset();
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
					<div className="bg-red-500/20 border border-red-500 p-3 rounded mb-5 text-center text-red-500">
						{getErrorMessage(verifyOtpMutation.error)}
					</div>
				)}

				{/* Success Message for Resend */}
				{resendOtpMutation.isSuccess && (
					<div className="bg-green-500/20 border border-green-500 p-3 rounded mb-5 text-center text-green-500">
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
						disabled={verifyOtpMutation.isPending}
						className={`w-full p-3 border-none rounded-lg bg-primary text-lg ${
							verifyOtpMutation.isPending
								? "cursor-not-allowed opacity-70"
								: "cursor-pointer opacity-100"
						}`}
					>
						{verifyOtpMutation.isPending ? (
							<LoadingSpinner customSize="h-6 border-2" />
						) : (
							"Verify OTP"
						)}
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
};

export default OtpVerification;
