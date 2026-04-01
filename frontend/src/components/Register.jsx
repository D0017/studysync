import React, { useState } from 'react';
import { registerUser } from '../services/userService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        universityId: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT'
    });
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });

    const validate = () => {
        let tempErrors = {};

        if (!formData.universityId) {
            tempErrors.universityId = "University ID is required";
        } else if (formData.universityId.length !== 8) {
            tempErrors.universityId = "University ID must be exactly 8 characters";
        }

        if (!formData.fullName) tempErrors.fullName = "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";

        if (formData.password.length < 8) {
            tempErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match";
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

    const inputClass = (name) => `
        w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#1F1F23] outline-none transition
        ${errors[name]
            ? 'border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/20'}
    `;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0A0A0C] flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.22),transparent_25%),radial-gradient(circle_at_left,rgba(255,255,255,0.06),transparent_22%)]" />
            <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[#FF6A00]/10 blur-3xl" />
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
                                Create Your Account
                            </p>
                            <h2 className="mt-6 text-4xl font-black leading-tight text-white">
                                Join a modern platform built for academic collaboration.
                            </h2>
                            <p className="mt-5 max-w-md text-base leading-7 text-gray-300">
                                Register to access modules, connect with academic groups, and use a
                                clean LMS experience designed for universities.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/10 p-6">
                        <p className="text-sm text-gray-400">Why create an account</p>
                        <div className="mt-4 space-y-3">
                            {[
                                'Access a structured academic workspace',
                                'Collaborate through role-based workflows',
                                'Use a secure and modern LMS experience',
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
                                Register
                            </p>
                            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#1F1F23]">
                                Join StudySync
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Create your secured account to start using the platform.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className={inputClass('fullName')}
                                    placeholder="Enter full name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                                {errors.fullName && <p className="mt-2 text-xs text-red-500">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                                    University ID (8 Digits)
                                </label>
                                <input
                                    type="text"
                                    className={inputClass('universityId')}
                                    placeholder="e.g. XXXXXXXX"
                                    value={formData.universityId}
                                    onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                                />
                                {errors.universityId && (
                                    <p className="mt-2 text-xs text-red-500">{errors.universityId}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={inputClass('email')}
                                    placeholder="id@uni.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={inputClass('password')}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                                        Confirm
                                    </label>
                                    <input
                                        type="password"
                                        className={inputClass('confirmPassword')}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData({ ...formData, confirmPassword: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {(errors.password || errors.confirmPassword) && (
                                <p className="text-xs text-red-500">
                                    {errors.password || errors.confirmPassword}
                                </p>
                            )}

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                                    Account Type
                                </label>
                                <select
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1F1F23] outline-none transition focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/20"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="STUDENT">Student</option>
                                    <option value="LECTURER">Lecturer</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-[#FF6A00] py-3.5 text-sm font-bold text-white shadow-[0_16px_35px_rgba(255,106,0,0.30)] transition hover:scale-[1.01] hover:bg-[#ff7b22] active:scale-[0.99]"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-[#FF6A00] hover:underline">
                                Sign In
                            </Link>
                        </p>

                        {serverMessage.text && (
                            <div
                                className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium text-center ${
                                    serverMessage.type === 'success'
                                        ? 'border-green-200 bg-green-50 text-green-700'
                                        : 'border-red-200 bg-red-50 text-red-700'
                                }`}
                            >
                                {serverMessage.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;