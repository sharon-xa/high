import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    email: z.email('Invalid email address'),
    birthdate: z.string().min(1, 'Birthdate is required'),
    gender: z.enum(['female', 'male', 'other'], {
        error: "Invalid gender"
    }),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const otpSchema = z.object({
    otp: z.string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;