import OtpVerification from "../components/auth/OtpVerification";
import LoginTab from "../components/auth/LoginTab";
import SignupTab from "../components/auth/SignupTab";
import type { TabType } from "../types/auth/authPage.types";
import { useAuthPageStore } from "../stores/authStores/authPageStore";
import { useAuthForms } from "../contexts/AuthFormsContext";

export const getErrorMessage = (error: any) => {
	return error?.response?.data?.message || error?.message || "An error occurred";
};

const Auth = () => {
	const {
		loginMutation,
		registerMutation,
		activeTab,
		showOtpVerification,
		setActiveTab,
		setShowOtpVerification,
	} = useAuthPageStore();

	const { loginForm, registerForm } = useAuthForms();

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab);
		setShowOtpVerification(false);
		loginForm.clearErrors();
		registerForm.clearErrors();
		loginMutation?.reset();
		registerMutation?.reset();
	};

	const currentError = activeTab === "login" ? loginMutation?.error : registerMutation?.error;

	if (showOtpVerification) return <OtpVerification />;

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

			{activeTab === "login" && <LoginTab />}
			{activeTab === "signup" && <SignupTab />}
		</div>
	);
};

export default Auth;
