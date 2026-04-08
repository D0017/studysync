import React, { useState } from 'react';
import { registerUser } from '../services/userService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import backgroundImage from '../assets/landing2.jpg';

const Register = () => {
    const [formData, setFormData] = useState({
        universityId: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const validate = () => {
        let tempErrors = {};

        if (!formData.universityId) {
            tempErrors.universityId = 'University ID is required';
        } else if (formData.universityId.length !== 8) {
            tempErrors.universityId = 'University ID must be exactly 8 characters';
        }

        if (!formData.fullName) tempErrors.fullName = 'Full Name is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Invalid email format';

        if (formData.password.length < 8) {
            tempErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage({ type: '', text: '' });

        if (validate()) {
            const { confirmPassword: _, ...dataToSend } = formData;
            try {
                await registerUser(dataToSend);
                setServerMessage({ type: 'success', text: 'Registration successful!' });
                toast.success('Account created successfully!');

                setFormData({
                    universityId: '',
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'STUDENT'
                });
                setErrors({});
            } catch (err) {
                const message = typeof err === 'string' ? err : 'Server connection failed';

                setServerMessage({
                    type: 'error',
                    text: message
                });
                toast.error(message);
            }
        } else {
            toast.error('Please fix the form errors before submitting.');
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06070A] px-4 py-8 sm:px-6 sm:py-12">
            <div className="absolute inset-0">
                <img
                    src={backgroundImage}
                    alt="Background"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#050608]/70" />
            </div>

            <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-4xl border border-white/10 bg-[#0E1014]/72 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03)_38%,rgba(255,255,255,0.02))]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/10 to-transparent" />

                <div className="relative p-6 sm:p-8">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="inline-flex rounded-full border border-white/10 bg-black/25 p-1 backdrop-blur-xl">
                            <Link
                                to="/register"
                                className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                            >
                                Sign up
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-full px-5 py-2 text-sm font-medium text-gray-400 transition hover:text-white"
                            >
                                Sign in
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-gray-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                            aria-label="Close and go to landing page"
                        >
                            X
                        </button>
                    </div>

                    <div className="mb-7 text-center">
                        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[2.1rem]">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Use your university details to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className={`w-full rounded-[20px] border px-4 py-4 text-base text-white outline-none backdrop-blur-xl transition-all placeholder:text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
                                        errors.fullName
                                            ? 'border-red-500/30 bg-red-500/10 focus:border-red-400'
                                            : 'border-white/10 bg-white/6 focus:border-[#FF6A00]/60 focus:bg-white/8 focus:ring-2 focus:ring-[#FF6A00]/15'
                                    }`}
                                    placeholder="kusal perera"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                                {errors.fullName && <p className="mt-2 text-xs font-medium text-red-200">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                                    University ID
                                </label>
                                <input
                                    type="text"
                                    className={`w-full rounded-[20px] border px-4 py-4 text-base text-white outline-none backdrop-blur-xl transition-all placeholder:text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
                                        errors.universityId
                                            ? 'border-red-500/30 bg-red-500/10 focus:border-red-400'
                                            : 'border-white/10 bg-white/6 focus:border-[#FF6A00]/60 focus:bg-white/8 focus:ring-2 focus:ring-[#FF6A00]/15'
                                    }`}
                                    placeholder="ITXXXXXX"
                                    value={formData.universityId}
                                    onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                                />
                                {errors.universityId && <p className="mt-2 text-xs font-medium text-red-200">{errors.universityId}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                                    University Email
                                </label>
                                <input
                                    type="email"
                                    className={`w-full rounded-[20px] border px-4 py-4 text-base text-white outline-none backdrop-blur-xl transition-all placeholder:text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
                                        errors.email
                                            ? 'border-red-500/30 bg-red-500/10 focus:border-red-400'
                                            : 'border-white/10 bg-white/6 focus:border-[#FF6A00]/60 focus:bg-white/8 focus:ring-2 focus:ring-[#FF6A00]/15'
                                    }`}
                                    placeholder="id@uni.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="mt-2 text-xs font-medium text-red-200">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                                    className={`rounded-[20px] border px-4 py-4 text-sm font-semibold transition-all ${
                                        formData.role === 'STUDENT'
                                            ? 'border-[#FF6A00]/35 bg-[#FF6A00]/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_30px_rgba(255,106,0,0.08)]'
                                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/8 hover:text-white'
                                    }`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'LECTURER' })}
                                    className={`rounded-[20px] border px-4 py-4 text-sm font-semibold transition-all ${
                                        formData.role === 'LECTURER'
                                            ? 'border-[#FF6A00]/35 bg-[#FF6A00]/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_30px_rgba(255,106,0,0.08)]'
                                            : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/8 hover:text-white'
                                    }`}
                                >
                                    Lecturer
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="relative">
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full rounded-[20px] border border-white/10 bg-white/6 px-4 py-4 pr-16 text-base text-white outline-none backdrop-blur-xl transition-all placeholder:text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] focus:border-[#FF6A00]/60 focus:bg-white/8 focus:ring-2 focus:ring-[#FF6A00]/15"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-10.75 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 transition hover:text-white"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                                    Confirm Password
                                </label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full rounded-[20px] border border-white/10 bg-white/6 px-4 py-4 pr-16 text-base text-white outline-none backdrop-blur-xl transition-all placeholder:text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] focus:border-[#FF6A00]/60 focus:bg-white/8 focus:ring-2 focus:ring-[#FF6A00]/15"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-10.75 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 transition hover:text-white"
                                >
                                    {showConfirmPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        {(errors.password || errors.confirmPassword) && (
                            <p className="text-xs font-medium text-red-200">
                                {errors.password || errors.confirmPassword}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-[20px] border border-[#FF6A00]/40 bg-[#E26A1C] py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(255,106,0,0.28),inset_0_1px_0_rgba(255,255,255,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(255,106,0,0.34)] active:translate-y-0"                        >
                            Create My Account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-white transition hover:text-[#FFB37D]">
                            Sign in
                        </Link>
                    </p>

                    {serverMessage.text && (
                        <div
                            className={`mt-5 rounded-[20px] border px-4 py-3 text-center text-sm font-medium backdrop-blur-xl ${
                                serverMessage.type === 'success'
                                    ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                                    : 'border-red-500/20 bg-red-500/10 text-red-200'
                            }`}
                        >
                            {serverMessage.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;