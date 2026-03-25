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

const LecturerDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [stats, setStats] = useState({
        modules: 0,
        groups: 0,
        students: 0,
        leadershipPending: 0
    });
    const [recentModules, setRecentModules] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Lecturer session not found. Please login again.' });
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const modulesResponse = await axios.get(`/api/lecturer/modules/${storedUser.id}`);
            const modules = Array.isArray(modulesResponse.data) ? modulesResponse.data : [];

            const modulesWithGroups = await Promise.all(
                modules.map(async (module) => {
                    try {
                        const groupsResponse = await axios.get(`/api/groups/modules/${module.id}/all`);
                        const groups = Array.isArray(groupsResponse.data) ? groupsResponse.data : [];
                        return { ...module, groups };
                    } catch {
                        return { ...module, groups: [] };
                    }
                })
            );

            const totalGroups = modulesWithGroups.reduce(
                (sum, module) => sum + module.groups.length,
                0
            );

            const totalStudents = modulesWithGroups.reduce(
                (sum, module) =>
                    sum +
                    module.groups.reduce(
                        (groupSum, group) =>
                            groupSum +
                            (Array.isArray(group.currentMembers) ? group.currentMembers.length : 0),
                        0
                    ),
                0
            );

            const totalLeadershipPending = modulesWithGroups.reduce(
                (sum, module) =>
                    sum +
                    module.groups.filter((group) => group.requestedLeader && !group.leader).length,
                0
            );

            setStats({
                modules: modulesWithGroups.length,
                groups: totalGroups,
                students: totalStudents,
                leadershipPending: totalLeadershipPending
            });

            setRecentModules(modulesWithGroups.slice(0, 3));
        } catch (error) {
            console.error('Failed to load lecturer dashboard:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load lecturer dashboard data.')
            });
        } finally {
            setLoading(false);
        }
    }, [storedUser?.id]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const statCards = [
        {
            title: 'Assigned Modules',
            value: stats.modules,
            subtitle: 'Modules under your supervision',
            color: 'text-blue-400'
        },
        {
            title: 'Project Groups',
            value: stats.groups,
            subtitle: 'Groups across your modules',
            color: 'text-emerald-400'
        },
        {
            title: 'Grouped Students',
            value: stats.students,
            subtitle: 'Students already inside groups',
            color: 'text-cyan-300'
        },
        {
            title: 'Pending Leaders',
            value: stats.leadershipPending,
            subtitle: 'Groups waiting for approval',
            color: 'text-amber-400'
        }
    ];

    const quickActions = [
        {
            title: 'My Modules',
            description: 'See assigned modules and current group counts.',
            path: '/lecturer/modules',
            accent: 'from-blue-600 to-cyan-500',
            icon: '📚'
        },
        {
            title: 'Group Notices',
            description: 'Prepare targeted notices for groups later.',
            path: '/lecturer/notices',
            accent: 'from-violet-600 to-purple-500',
            icon: '📢'
        },
        {
            title: 'Viva Schedule',
            description: 'Plan viva sessions for project groups.',
            path: '/lecturer/viva-schedule',
            accent: 'from-emerald-600 to-teal-500',
            icon: '📅'
        },
        {
            title: 'Evaluations',
            description: 'Manage rubric-based group assessments.',
            path: '/lecturer/evaluations',
            accent: 'from-amber-500 to-orange-500',
            icon: '📝'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 p-7 md:p-8 shadow-2xl mb-8">
                    <div className="absolute inset-0 bg-white/5" />
                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        <div className="max-w-3xl">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200 font-semibold">
                                Lecturer Workspace
                            </p>

                            <h1 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-white">
                                Welcome back,
                                <span className="block text-cyan-300">
                                    {storedUser?.fullName || 'Lecturer'}
                                </span>
                            </h1>

                            <p className="mt-4 text-sm md:text-base text-slate-200 leading-7">
                                This dashboard gives you a clear overview of your assigned modules,
                                project groups, grouped students, and leadership activity.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/lecturer/modules')}
                                className="rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-bold shadow-lg transition hover:bg-slate-100"
                            >
                                Open My Modules
                            </button>

                            <button
                                onClick={fetchDashboardData}
                                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                Refresh
                            </button>

                        </div>
                    </div>
                </div>

                {message.text && (
                    <div
                        className={`mb-6 rounded-2xl border p-4 text-sm font-medium ${
                            message.type === 'success'
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : 'border-red-200 bg-red-50 text-red-700'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 shadow-lg"
                        >
                            <p className="text-sm text-slate-500">{card.title}</p>
                            <h3 className={`mt-3 text-3xl font-black ${card.color}`}>
                                {loading ? '...' : card.value}
                            </h3>
                            <p className="mt-3 text-sm text-slate-400">{card.subtitle}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-8">
                    <div className="mb-5">
                        <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Go directly to your main lecturer tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {quickActions.map((action) => (
                            <button
                                key={action.path}
                                onClick={() => navigate(action.path)}
                                className="group overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl text-left shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <div className={`h-2 bg-gradient-to-r ${action.accent}`} />
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-2xl">{action.icon}</div>
                                            <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-700">
                                                {action.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                {action.description}
                                            </p>
                                        </div>

                                        <div className="text-lg text-slate-400 group-hover:text-slate-800">
                                            →
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">Recently Assigned Modules</h3>

                        {loading ? (
                            <p className="text-sm text-slate-500">Loading modules...</p>
                        ) : recentModules.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No modules have been assigned to you yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentModules.map((module) => (
                                    <div
                                        key={module.id}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-900">
                                                    {module.moduleCode}
                                                </h4>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {module.moduleName}
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                                Semester {module.semester}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                                            <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
                                                {module.groups?.length || 0} Groups
                                            </span>
                                            <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
                                                Year {module.year}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;