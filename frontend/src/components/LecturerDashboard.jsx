import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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

            const totalGroups = modulesWithGroups.reduce((sum, module) => sum + module.groups.length, 0);
            const totalStudents = modulesWithGroups.reduce(
                (sum, module) =>
                    sum + module.groups.reduce(
                        (groupSum, group) => groupSum + (Array.isArray(group.currentMembers) ? group.currentMembers.length : 0),
                        0
                    ),
                0
            );

            const totalLeadershipPending = modulesWithGroups.reduce(
                (sum, module) => sum + module.groups.filter((group) => group.requestedLeader && !group.leader).length,
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
            subtitle: 'Supervised modules',
            color: 'text-[#FF6A00]'
        },
        {
            title: 'Project Groups',
            value: stats.groups,
            subtitle: 'Active student teams',
            color: 'text-[#1F1F23]'
        },
        {
            title: 'Grouped Students',
            value: stats.students,
            subtitle: 'Enrolled in teams',
            color: 'text-[#1F1F23]'
        },
        {
            title: 'Pending Leaders',
            value: stats.leadershipPending,
            subtitle: 'Awaiting your approval',
            color: 'text-amber-600'
        }
    ];

    const quickActions = [
        {
            title: 'My Modules',
            description: 'Manage assigned modules and group enrollments.',
            path: '/lecturer/modules',
            icon: (
                <svg className="w-7 h-7 text-[#FF6A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            title: 'Assignment Management',
            description: 'Create assignments and define rubric-based criteria.',
            path: '/lecturer/assignments',
            icon: (
                <svg className="w-7 h-7 text-[#FF6A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )
        },
        {
            title: 'Group Notices',
            description: 'Broadcast updates to specific project groups.',
            path: '/lecturer/notices',
            icon: (
                <svg className="w-7 h-7 text-[#FF6A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            )
        },
        {
            title: 'Viva Schedule',
            description: 'Organize and view upcoming group presentations.',
            path: '/lecturer/viva-schedule',
            icon: (
                <svg className="w-7 h-7 text-[#FF6A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: 'Evaluations',
            description: 'Assess group performance via project rubrics.',
            path: '/lecturer/evaluations',
            icon: (
                <svg className="w-7 h-7 text-[#FF6A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#F4F4F6] p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0C] p-7 md:p-8 shadow-2xl mb-8 border-b-4 border-[#FF6A00]">
                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        <div className="max-w-3xl">
                            <p className="text-xs uppercase tracking-[0.22em] text-[#FF6A00] font-bold">
                                Lecturer Workspace
                            </p>
                            <h1 className="mt-3 text-3xl md:text-4xl font-black leading-tight text-white">
                                Welcome back, <br />
                                <span className="text-[#FF6A00]">
                                    {storedUser?.fullName || 'Lecturer'}
                                </span>
                            </h1>
                            <p className="mt-4 text-sm md:text-base text-gray-400 leading-7">
                                Oversee your assigned modules, approve leadership requests, and track group progress from one central hub.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/lecturer/modules')}
                                className="rounded-2xl bg-[#FF6A00] text-white px-6 py-3 text-sm font-bold shadow-lg transition hover:bg-[#e55f00]"
                            >
                                View All Modules
                            </button>
                            <button
                                onClick={fetchDashboardData}
                                className="rounded-2xl border border-white/10 bg-[#1F1F23] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2e]"
                            >
                                Refresh
                            </button>
                            <Link
                                to="/resources"
                                className="rounded-2xl border border-white/10 bg-[#1F1F23] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2e]"
                            >
                                View Resources
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                            >
                                Logout
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
                        <div key={card.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{card.title}</p>
                            <h3 className={`mt-3 text-3xl font-black ${card.color}`}>
                                {loading ? '...' : card.value}
                            </h3>
                            <p className="mt-2 text-xs text-gray-500 font-medium">{card.subtitle}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-8">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-[#0A0A0C]">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        {quickActions.map((action) => (
                            <button
                                key={action.path}
                                onClick={() => navigate(action.path)}
                                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="mb-4 transition-transform group-hover:scale-110 duration-300">
                                    {action.icon}
                                </div>
                                <h3 className="text-base font-bold text-[#0A0A0C] group-hover:text-[#FF6A00] transition-colors">
                                    {action.title}
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                                    {action.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-[#0A0A0C]">Recent Modules</h3>
                            <span className="text-[10px] font-bold uppercase text-gray-400">Current Semester</span>
                        </div>

                        {loading ? (
                            <p className="text-sm text-gray-400 italic">Loading...</p>
                        ) : recentModules.length === 0 ? (
                            <p className="text-sm text-gray-500">No modules assigned yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentModules.map((module) => (
                                    <div key={module.id} className="flex items-center justify-between rounded-2xl bg-[#F4F4F6] p-4 border border-gray-100">
                                        <div>
                                            <h4 className="text-sm font-bold text-[#0A0A0C]">{module.moduleCode}</h4>
                                            <p className="text-xs text-gray-500">{module.moduleName}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block rounded-lg bg-white px-3 py-1 text-[10px] font-black text-[#FF6A00] border border-gray-200">
                                                {module.groups?.length || 0} GROUPS
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl bg-[#1F1F23] p-6 text-white shadow-lg flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Action Required</h3>
                            <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                                There are <span className="text-[#FF6A00] font-bold">{stats.leadershipPending}</span> leadership requests waiting for your review.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/lecturer/modules')}
                            className="mt-6 w-full rounded-xl bg-white/10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF6A00] transition-all"
                        >
                            Review Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;