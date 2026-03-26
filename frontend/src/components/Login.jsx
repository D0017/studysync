import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/userService';

const getDashboardRoute = (role) => {
    switch (role) {
        case 'ADMIN':
            return '/admin-dashboard';
        case 'STUDENT':
            return '/student-dashboard';
        case 'LECTURER':
            return '/lecturer-dashboard';
        default:
            return '/login';
    }
};

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await loginUser(credentials);
            navigate(getDashboardRoute(user.role));
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0A0A0C] flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.22),transparent_25%),radial-gradient(circle_at_left,rgba(255,255,255,0.06),transparent_22%)]" />
            <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#FF6A00]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-2">
                <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-[#1F1F23] via-[#17171b] to-[#0f0f12] p-10">
                    <div>
                        <div className="inline-flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00] text-lg font-extrabold text-white shadow-[0_12px_30px_rgba(255,106,0,0.35)]">
                                S
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-white">StudySync</h1>
                                <p className="text-sm text-gray-400">Smart LMS Collaboration Platform</p>
                            </div>
                        </div>

                        <div className="mt-16">
                            <p className="inline-flex rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-4 py-2 text-sm font-medium text-[#FF6A00]">
                                Welcome Back
                            </p>
                            <h2 className="mt-6 text-4xl font-black leading-tight text-white">
                                Sign in to access your academic workspace.
                            </h2>
                            <p className="mt-5 max-w-md text-base leading-7 text-gray-300">
                                Continue managing modules, collaborating with students, and staying
                                connected through a modern learning management experience.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/10 p-6">
                        <p className="text-sm text-gray-400">Why StudySync</p>
                        <div className="mt-4 space-y-3">
                            {[
                                'Professional role-based LMS experience',
                                'Centralized learning and collaboration',
                                'Modern, clean, and secure academic workflow',
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#FF6A00]" />
                                    <p className="text-sm text-gray-200">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#F4F4F6] p-8 sm:p-10 lg:p-12">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-8 lg:hidden">
                            <div className="inline-flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF6A00] text-lg font-extrabold text-white shadow-[0_12px_30px_rgba(255,106,0,0.35)]">
                                    S
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight text-[#1F1F23]">StudySync</h1>
                                    <p className="text-sm text-gray-500">Smart LMS Collaboration Platform</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                                Sign In
                            </p>
                            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#1F1F23]">
                                Welcome Back
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Enter your credentials to continue to your dashboard.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1F1F23] outline-none transition focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/20"
                                    placeholder="Enter your email"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1F1F23] outline-none transition focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/20"
                                    placeholder="Enter your password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>

                            {error && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-[#FF6A00] py-3.5 text-sm font-bold text-white shadow-[0_16px_35px_rgba(255,106,0,0.30)] transition hover:scale-[1.01] hover:bg-[#ff7b22] active:scale-[0.99]"
                            >
                                Sign In
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="font-bold text-[#FF6A00] hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;