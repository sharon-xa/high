import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { AuthPageStore } from "../../types/auth/authPage.types";

export const useAuthPageStore = create<AuthPageStore>()(
	immer((set) => ({
		activeTab: "login",
		userEmail: "",
		showOtpVerification: false,
		loginMutation: null,
		registerMutation: null,

		setActiveTab(activeTab) {
			set((state) => {
				state.activeTab = activeTab;
			});
		},
		setUserEmail(email) {
			set((state) => {
				state.userEmail = email;
			});
		},
		setShowOtpVerification(show) {
			set((state) => {
				state.showOtpVerification = show;
			});
		},
		setLoginMutation(mutation) {
			set((state) => {
				state.loginMutation = mutation;
			});
		},
		setRegisterMutation(mutation) {
			set((state) => {
				state.registerMutation = mutation;
			});
		},
	}))
);
