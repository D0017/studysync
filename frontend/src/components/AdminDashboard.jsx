import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        users: 0,
        modules: 0,
        leadershipRequests: 0
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const [usersRes, modulesRes, leadershipRes] = await Promise.all([
                axios.get('/api/users/all'),
                axios.get('/api/admin/modules'),
                axios.get('/api/admin/leadership-requests')
            ]);

            setStats({
                users: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
                modules: Array.isArray(modulesRes.data) ? modulesRes.data.length : 0,
                leadershipRequests: Array.isArray(leadershipRes.data)
                    ? leadershipRes.data.length
                    : 0
            });
        } catch (error) {
            console.error('Failed to load admin dashboard stats:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load dashboard data.')
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    const quickActions = [
        {
            title: 'Manage Users',
            description: 'Activate, deactivate, and update user roles.',
            path: '/admin/users',
            accent: 'from-blue-500 to-cyan-500',
            icon: '👥'
        },
        {
            title: 'Create Module',
            description: 'Create a module and prepare groups for students.',
            path: '/admin/create-module',
            accent: 'from-violet-500 to-purple-500',
            icon: '📘'
        },
        {
            title: 'Module Management',
            description: 'View modules and inspect created group structures.',
            path: '/admin/modules',
            accent: 'from-emerald-500 to-teal-500',
            icon: '🧩'
        },
        {
            title: 'Leadership Requests',
            description: 'Review and approve pending leadership requests.',
            path: '/admin/leadership-requests',
            accent: 'from-amber-500 to-orange-500',
            icon: '👑'
        }
    ];

    const statCards = [
        {
            title: 'Total Users',
            value: stats.users,
            subtitle: 'Registered accounts',
            color: 'text-blue-400'
        },
        {
            title: 'Total Modules',
            value: stats.modules,
            subtitle: 'Modules in the system',
            color: 'text-emerald-400'
        },
        {
            title: 'Leadership Requests',
            value: stats.leadershipRequests,
            subtitle: 'Pending approvals',
            color: 'text-amber-400'
        }
    ];

    return (
        <div>
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 md:p-8 backdrop-blur-xl shadow-2xl mb-8">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-cyan-400/5 to-violet-500/10 pointer-events-none" />

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    <div className="max-w-3xl">
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                            Admin Workspace
                        </p>

                        <h2 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-white">
                            Manage users, modules,
                            <span className="block bg-linear-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                                and group operations
                            </span>
                        </h2>

                        <p className="mt-4 text-sm md:text-base text-slate-300 leading-7">
                            This is your main control panel for StudySync. Create modules,
                            organize group flow, manage users, and review leadership requests
                            from one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/admin/create-module')}
                            className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:from-blue-500 hover:to-cyan-400"
                        >
                            Create New Module
                        </button>

                        <button
                            onClick={fetchDashboardStats}
                            className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            Refresh Stats
                        </button>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div
                    className={`mb-6 rounded-2xl border p-4 text-sm font-medium ${
                        message.type === 'success'
                            ? 'border-green-400/20 bg-green-500/10 text-green-300'
                            : 'border-red-400/20 bg-red-500/10 text-red-300'
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl"
                    >
                        <p className="text-sm text-slate-300">{card.title}</p>
                        <h3 className={`mt-3 text-3xl font-black ${card.color}`}>
                            {loading ? '...' : card.value}
                        </h3>
                        <p className="mt-3 text-sm text-slate-400">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <div className="mb-5">
                    <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Go directly to the most important admin functions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {quickActions.map((action) => (
                        <button
                            key={action.path}
                            onClick={() => navigate(action.path)}
                            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-xl backdrop-blur-xl transition hover:bg-white/10"
                        >
                            <div className={`h-2 bg-linear-to-r ${action.accent}`} />
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-2xl">{action.icon}</div>
                                        <h4 className="mt-4 text-lg font-bold text-white transition group-hover:text-cyan-300">
                                            {action.title}
                                        </h4>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {action.description}
                                        </p>
                                    </div>

                                    <div className="text-lg text-slate-400 transition group-hover:text-white">
                                        →
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Panels */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-3">System Overview</h3>
                    <p className="text-sm leading-7 text-slate-300">
                        Use this dashboard as the central hub for your group management flow.
                        Create modules first, then generate groups under them, and finally
                        review student leadership requests once group activity begins.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-linear-to-br from-blue-500/10 via-cyan-400/5 to-violet-500/10 p-6 backdrop-blur-xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-3">Recommended Flow</h3>
                    <ol className="space-y-3 text-sm text-slate-300">
                        <li>1. Create a module with valid details and enrollment key.</li>
                        <li>2. Open module management and generate empty groups.</li>
                        <li>3. Let students enroll into modules using the key.</li>
                        <li>4. Review leadership requests and finalize group structure.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;