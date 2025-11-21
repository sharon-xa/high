import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Mail, Lock, User, Calendar, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import type { Gender } from '../types/user.types';
import Input from '../components/FormStuff/Input';
import Select from '../components/FormStuff/Select';

type TabType = 'login' | 'signup';

interface LocationState {
    from?: {
        pathname: string;
    };
}

interface LoginFormData {
    email: string;
    password: string;
}

interface SignupFormData {
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    gender: Gender;
    password: string;
    confirmPassword: string;
}

export const AuthPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("login");
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [loginData, setLoginData] = useState<LoginFormData>({ email: '', password: '' });
    const [signupData, setSignupData] = useState<SignupFormData>({
        firstName: "",
        lastName: "",
        email: '',
        birthdate: '',
        gender: 'female',
        password: '',
        confirmPassword: '',
    });

    const { login, register, verifyOtp, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as LocationState)?.from?.pathname || '/';

    const handleLoginChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSignupChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        clearError();

        const result = await login(loginData);
        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        clearError();

        if (signupData.password !== signupData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const result = await register({
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: signupData.email,
            birthdate: signupData.birthdate,
            gender: signupData.gender,
            password: signupData.password,
        });

        if (result.success) {
            setUserEmail(signupData.email);
            setShowOtpVerification(true);
        }
    };

    const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        clearError();

        const result = await verifyOtp(otp, userEmail);
        if (result.success) {
            setShowOtpVerification(false);
            setSignupData({
                firstName: '',
                lastName: '',
                email: '',
                birthdate: '',
                gender: 'female',
                password: '',
                confirmPassword: '',
            });
            setLoginData({ email: '', password: '' });
            setActiveTab("login");
            setOtp("");
            navigate('/auth', { replace: true });
        }
    };

    const handleResendOtp = async (): Promise<void> => {
        clearError();
        // Call your resend OTP API endpoint here
        // await resendOtp(userEmail);
        alert('OTP has been resent to your email');
    };

    const handleTabChange = (tab: TabType): void => {
        setActiveTab(tab);
        clearError();
        setShowOtpVerification(false);
    };

    // OTP Verification View
    if (showOtpVerification) {
        return (
            <div className="min-h-dvh relative flex items-center justify-center">
                <div className="w-full max-w-md px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                        <p className="text-gray-400 text-sm">
                            We've sent a verification code to<br />
                            <span className="font-semibold">{userEmail}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 p-3 rounded-lg mb-5 text-center text-red-500">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">Enter OTP Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full p-4 text-center text-2xl tracking-widest border-2 border-gray-600 rounded-xl bg-transparent focus:border-primary focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.length < 6}
                            className={`w-full p-3 border-none rounded-4xl bg-primary text-lg ${isLoading || otp.length < 6
                                ? 'cursor-not-allowed opacity-70'
                                : 'cursor-pointer opacity-100'
                                }`}
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">
                                Didn't receive the code?
                            </p>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="text-primary underline text-sm hover:text-primary/80 transition-colors"
                            >
                                Resend OTP
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
        <div className="min-h-dvh relative">
            {/* Tab Buttons */}
            <div className="w-[290px] flex justify-center absolute-hor-center top-2/12 rounded-4xl shadow-[inset_0_0_0_4px_#3B3B3B]">
                <button
                    onClick={() => handleTabChange('login')}
                    className={`text-lg border-none rounded-4xl py-3 px-10 cursor-pointer transition-all duration-300 ${activeTab === "login" ? "bg-primary" : "bg-transparent"} min-w-36`}
                >
                    Login
                </button>
                <button
                    onClick={() => handleTabChange('signup')}
                    className={`text-lg border-none rounded-4xl py-3 px-10 cursor-pointer transition-all duration-300 ${activeTab === "signup" ? "bg-primary" : "bg-transparent"} min-w-36`}
                >
                    Sign Up
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red p-3 rounded-lg mb-5 text-center">
                    {error}
                </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-12 absolute-hor-center top-3/12">
                    <div className="flex flex-col gap-5">
                        <Input
                            value={loginData.email}
                            onChangeFunc={handleLoginChange}
                            Icon={Mail}
                            type="email"
                        />

                        <Input
                            value={loginData.password}
                            onChangeFunc={handleLoginChange}
                            Icon={Lock}
                            type="password"
                        />

                        <div className="text-left">
                            <a href="/forgot-password" style={{ color: '#888', fontSize: '14px', textDecoration: 'underline' }}>
                                Forgot Password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full p-3 border-none rounded-4xl bg-primary text-lg ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'}`}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-12 absolute-hor-center top-3/12">
                    <div className='flex flex-col gap-5'>
                        <Input
                            value={signupData.firstName}
                            onChangeFunc={handleSignupChange}
                            Icon={User}
                            type="text"
                            inputName="firstName"
                            placeholder="first name"
                        />

                        <Input
                            value={signupData.lastName}
                            onChangeFunc={handleSignupChange}
                            Icon={User}
                            type="text"
                            inputName="lastName"
                            placeholder="last name"
                        />

                        <Input
                            value={signupData.email}
                            onChangeFunc={handleSignupChange}
                            Icon={Mail}
                            type="email"
                        />

                        <Input
                            value={signupData.birthdate}
                            onChangeFunc={handleSignupChange}
                            Icon={Calendar}
                            type="date"
                            inputName="birthdate"
                        />

                        <Select
                            value={signupData.gender}
                            onChangeFunc={handleSignupChange}
                            Icon={Users}
                            inputName="gender"
                            options={[
                                { Title: "Gender", Value: "", Disabled: true },
                                { Title: "Female", Value: "female" },
                                { Title: "Male", Value: "male" },
                                { Title: "Other", Value: "other" },
                            ]}
                        />

                        <Input
                            value={signupData.password}
                            onChangeFunc={handleSignupChange}
                            Icon={Lock}
                            type="password"
                        />

                        <Input
                            value={signupData.confirmPassword}
                            onChangeFunc={handleSignupChange}
                            Icon={Lock}
                            type="password"
                            inputName="confirmPassword"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full p-3 border-none rounded-4xl bg-primary text-lg ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'}`}
                    >
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            )}
        </div >
    );
};
