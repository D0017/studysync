import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../services/userService';
import backgroundImage from '../assets/landing2.jpg';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await resetPassword({
                token,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });

            toast.success(response);
            navigate('/login');
        } catch (err) {
            const msg = typeof err === 'string' ? err : 'Unable to reset password.';
            toast.error(msg);
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

            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-4xl border border-white/10 bg-[#0E1014]/72 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03)_38%,rgba(255,255,255,0.02))]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/10 to-transparent" />

                <div className="relative p-6 sm:p-8">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <Link
                            to="/login"
                            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                        >
                            Sign in
                        </Link>

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
                            Set new password
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Choose a new password to secure your account
                        </p>
                    </div>

                    {!token ? (
                        <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 backdrop-blur-xl">
                            Invalid or expired reset link.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                                    New Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
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
                                    Confirm New Password
                                </label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
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

                            <button
                                type="submit"
                                className="w-full rounded-[20px] border border-[#FF6A00]/40 bg-[#E26A1C] py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(255,106,0,0.28),inset_0_1px_0_rgba(255,255,255,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(255,106,0,0.34)] active:translate-y-0"
                            >
                                Reset Password
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Back to{' '}
                        <Link to="/login" className="font-semibold text-white transition hover:text-[#FFB37D]">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;