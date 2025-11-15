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
    name: string;
    email: string;
    birthdate: string;
    gender: Gender;
    password: string;
    confirmPassword: string;
}

export const AuthPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('login');
    const [loginData, setLoginData] = useState<LoginFormData>({ email: '', password: '' });
    const [signupData, setSignupData] = useState<SignupFormData>({
        name: '',
        email: '',
        birthdate: '',
        gender: 'female',
        password: '',
        confirmPassword: '',
    });

    const { login, register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

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
            name: signupData.name,
            email: signupData.email,
            birthdate: signupData.birthdate,
            gender: signupData.gender,
            password: signupData.password,
        });

        if (result.success) {
            navigate('/', { replace: true });
        }
    };

    const handleTabChange = (tab: TabType): void => {
        setActiveTab(tab);
        clearError();
    };

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
                            value={signupData.name}
                            onChangeFunc={handleSignupChange}
                            Icon={User}
                            type="text"
                            inputName="name"
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
