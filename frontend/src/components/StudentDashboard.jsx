import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logo11.png'; 

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const StudentDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    const [enrollmentKey, setEnrollmentKey] = useState('');
    const [modules, setModules] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [loadingModules, setLoadingModules] = useState(true);
    const [joiningModule, setJoiningModule] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('MODULE_CODE_ASC');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const displayName = storedUser?.fullName || 'Student';
    const firstName = displayName.split(' ')[0] || 'Student';
    const universityId = storedUser?.universityId || 'No University ID';

    const fetchStudentModules = useCallback(async () => {
        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Student ID not found. Please login again.' });
            setLoadingModules(false);
            return;
        }

        try {
            setLoadingModules(true);
            setMessage({ type: '', text: '' });

            const response = await axios.get(`/api/groups/modules/student/${storedUser.id}`);
            const enrolledModules = Array.isArray(response.data) ? response.data : [];
            setModules(enrolledModules);

            const groupResults = await Promise.all(
                enrolledModules.map(async (module) => {
                    try {
                        const groupsResponse = await axios.get(`/api/groups/modules/${module.id}/all`);
                        const groups = Array.isArray(groupsResponse.data) ? groupsResponse.data : [];

                        const myGroup = groups.find(
                            (group) =>
                                Array.isArray(group.currentMembers) &&
                                group.currentMembers.some((member) => member.id === storedUser.id)
                        );

                        if (!myGroup) return null;

                        return {
                            moduleId: module.id,
                            moduleCode: module.moduleCode,
                            moduleName: module.moduleName,
                            groupId: myGroup.id,
                            groupName: myGroup.groupName,
                            memberCount: Array.isArray(myGroup.currentMembers)
                                ? myGroup.currentMembers.length
                                : 0,
                            maxCapacity: myGroup.maxCapacity,
                            isLeader: myGroup.leader?.id === storedUser.id,
                            isLeadershipPending:
                                myGroup.requestedLeader?.id === storedUser.id &&
                                myGroup.leader?.id !== storedUser.id
                        };
                    } catch (error) {
                        console.error(`Failed to fetch groups for module ${module.id}:`, error);
                        return null;
                    }
                })
            );

            setJoinedGroups(groupResults.filter(Boolean));
        } catch (error) {
            console.error('Failed to fetch student modules:', error);
            setModules([]);
            setJoinedGroups([]);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load enrolled modules.')
            });
        } finally {
            setLoadingModules(false);
        }
    }, [storedUser?.id]);

    useEffect(() => {
        fetchStudentModules();
    }, [fetchStudentModules]);

    const handleEnroll = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!enrollmentKey.trim()) {
            setMessage({ type: 'error', text: 'Please enter an enrollment key.' });
            return;
        }

        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Student ID not found. Please login again.' });
            return;
        }

        try {
            setJoiningModule(true);

            const response = await axios.post('/api/groups/modules/enroll', null, {
                params: {
                    studentId: storedUser.id,
                    enrollmentKey: enrollmentKey.trim()
                }
            });

            setMessage({ type: 'success', text: response.data });
            toast.success(typeof response.data === 'string' ? response.data : 'Enrolled successfully!');
            setEnrollmentKey('');
            await fetchStudentModules();
        } catch (error) {
            console.error('Enrollment failed:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to enroll in module.')
            });
        } finally {
            setJoiningModule(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const openModule = (moduleId) => {
        navigate(`/student/modules/${moduleId}`);
    };

    const enrichedModules = useMemo(() => {
        return modules.map((module) => {
            const relatedGroup = joinedGroups.find((group) => group.moduleId === module.id);

            let status = 'NO_GROUP';
            if (relatedGroup?.isLeader) status = 'LEADER';
            else if (relatedGroup?.isLeadershipPending) status = 'PENDING';
            else if (relatedGroup) status = 'IN_GROUP';

            return {
                ...module,
                relatedGroup,
                status,
                lecturerName: module.lecturer?.fullName || 'Not assigned yet'
            };
        });
    }, [modules, joinedGroups]);

    const visibleModules = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();

        const filtered = enrichedModules.filter((module) => {
            const matchesSearch =
                !q ||
                module.moduleCode?.toLowerCase().includes(q) ||
                module.moduleName?.toLowerCase().includes(q) ||
                module.lecturerName?.toLowerCase().includes(q) ||
                module.relatedGroup?.groupName?.toLowerCase().includes(q);

            const matchesFilter =
                statusFilter === 'ALL' ||
                (statusFilter === 'IN_GROUP' && !!module.relatedGroup) ||
                (statusFilter === 'NO_GROUP' && !module.relatedGroup) ||
                (statusFilter === 'LEADER' && module.relatedGroup?.isLeader) ||
                (statusFilter === 'PENDING' && module.relatedGroup?.isLeadershipPending);

            return matchesSearch && matchesFilter;
        });

        const statusRank = {
            LEADER: 0,
            PENDING: 1,
            IN_GROUP: 2,
            NO_GROUP: 3
        };

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'MODULE_CODE_DESC':
                    return (b.moduleCode || '').localeCompare(a.moduleCode || '');
                case 'YEAR_ASC':
                    if (a.year !== b.year) return a.year - b.year;
                    if (a.semester !== b.semester) return a.semester - b.semester;
                    return (a.moduleCode || '').localeCompare(b.moduleCode || '');
                case 'YEAR_DESC':
                    if (a.year !== b.year) return b.year - a.year;
                    if (a.semester !== b.semester) return b.semester - a.semester;
                    return (a.moduleCode || '').localeCompare(b.moduleCode || '');
                case 'STATUS':
                    if (statusRank[a.status] !== statusRank[b.status]) {
                        return statusRank[a.status] - statusRank[b.status];
                    }
                    return (a.moduleCode || '').localeCompare(b.moduleCode || '');
                case 'MODULE_CODE_ASC':
                default:
                    return (a.moduleCode || '').localeCompare(b.moduleCode || '');
            }
        });
    }, [enrichedModules, searchTerm, statusFilter, sortBy]);

    const summary = useMemo(() => {
        return {
            totalModules: enrichedModules.length,
            joinedCount: enrichedModules.filter((m) => !!m.relatedGroup).length,
            noGroupCount: enrichedModules.filter((m) => !m.relatedGroup).length,
            pendingCount: enrichedModules.filter((m) => m.relatedGroup?.isLeadershipPending).length
        };
    }, [enrichedModules]);

    const quickAccessModules = useMemo(() => visibleModules.slice(0, 5), [visibleModules]);

    const getStatusConfig = (module) => {
        if (module.relatedGroup?.isLeader) {
            return {
                label: 'Leader',
                badge: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
                helper: module.relatedGroup.groupName
            };
        }

        if (module.relatedGroup?.isLeadershipPending) {
            return {
                label: 'Pending',
                badge: 'border border-amber-500/30 bg-amber-500/10 text-amber-300',
                helper: module.relatedGroup.groupName
            };
        }

        if (module.relatedGroup) {
            return {
                label: 'In Group',
                badge: 'border border-orange-500/30 bg-orange-500/10 text-orange-300',
                helper: module.relatedGroup.groupName
            };
        }

        return {
            label: 'No Group',
            badge: 'border border-white/10 bg-white/5 text-slate-300',
            helper: 'Join a group from the module page'
        };
    };

    const panelClass =
        'rounded-2xl border border-white/10 bg-[#111827] shadow-[0_10px_30px_rgba(0,0,0,0.22)]';

    const statCardClass =
        'rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]';

    const filterButtonClass = (active = false) =>
        `rounded-full px-4 py-2 text-sm font-medium transition ${
            active
                ? 'bg-orange-500 text-white'
                : 'border border-white/10 bg-[#0F172A] text-slate-300 hover:bg-[#162033]'
        }`;

    const navItemClass = (active = false) =>
        `flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
            active
                ? 'bg-orange-500/15 text-orange-300'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`;

    const SidebarContent = () => (
        <div className="flex min-h-full flex-col bg-[#0B1220]">
            <div className="border-b border-white/10 px-6 py-6">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="StudySync logo"
                        className="h-12 w-12 rounded-xl object-contain"
                    />

                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold text-white">StudySync</h2>
                        <p className="text-sm text-slate-400">Student Portal</p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-5">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Navigation
                </p>

                <div className="space-y-2">
                    <button
                        onClick={() => {
                            navigate('/student-dashboard');
                            setSidebarOpen(false);
                        }}
                        className={navItemClass(true)}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => {
                            navigate('/student/resources');
                            setSidebarOpen(false);
                        }}
                        className={navItemClass(false)}
                    >
                        Resources
                    </button>

                    <button
                        onClick={() => {
                            navigate('/');
                            setSidebarOpen(false);
                        }}
                        className={navItemClass(false)}
                    >
                        Home
                    </button>
                </div>
            </div>

            <div className="px-4 py-3">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Quick Access
                </p>

                <div className="space-y-2">
                    {quickAccessModules.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-[#111827] px-4 py-4 text-sm text-slate-400">
                            No modules available yet.
                        </div>
                    ) : (
                        quickAccessModules.map((module) => (
                            <button
                                key={module.id}
                                onClick={() => {
                                    openModule(module.id);
                                    setSidebarOpen(false);
                                }}
                                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-left transition hover:border-orange-500/30 hover:bg-[#172033]"
                            >
                                <p className="text-sm font-semibold text-white">{module.moduleCode}</p>
                                <p className="mt-1 truncate text-xs text-slate-400">{module.moduleName}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-auto border-t border-white/10 px-4 py-4">
                <div className="mb-4 rounded-2xl border border-white/10 bg-[#111827] p-4">
                    <p className="text-sm font-semibold text-white">{displayName}</p>
                    <p className="mt-1 text-sm text-slate-400">{universityId}</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#020817] text-white">
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 lg:hidden">
                    <div className="h-full w-72.5 border-r border-white/10 bg-[#0B1220] shadow-2xl">
                        <div className="sidebar-scroll h-full overflow-y-auto">
                            <SidebarContent />
                        </div>
                    </div>

                    <button
                        className="absolute inset-0 -z-10 h-full w-full"
                        onClick={() => setSidebarOpen(false)}
                    />
                </div>
            )}

            <div className="min-h-screen bg-[#020817] lg:pl-72.5">
                <aside className="fixed inset-y-0 left-0 z-30 hidden w-72.5 border-r border-white/10 bg-[#0B1220] lg:block">
                    <div className="sidebar-scroll h-full overflow-y-auto">
                        <SidebarContent />
                    </div>
                </aside>

                <main className="min-w-0">
                    <div className="border-b border-white/10 bg-[#0A1020]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 lg:hidden"
                                >
                                    Menu
                                </button>

                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        {getGreeting()}, {firstName}
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {displayName} • {universityId}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300">
                                    {summary.totalModules} modules enrolled
                                </div>

                                <button
                                    onClick={fetchStudentModules}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        {message.text && (
                            <div
                                className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-medium ${
                                    message.type === 'success'
                                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                        : 'border-red-500/30 bg-red-500/10 text-red-300'
                                }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div className={statCardClass}>
                                <p className="text-sm text-slate-400">Modules</p>
                                <h2 className="mt-3 text-3xl font-bold text-white">{summary.totalModules}</h2>
                            </div>

                            <div className={statCardClass}>
                                <p className="text-sm text-slate-400">Joined groups</p>
                                <h2 className="mt-3 text-3xl font-bold text-white">{summary.joinedCount}</h2>
                            </div>

                            <div className={statCardClass}>
                                <p className="text-sm text-slate-400">Need a group</p>
                                <h2 className="mt-3 text-3xl font-bold text-white">{summary.noGroupCount}</h2>
                            </div>

                            <div className={statCardClass}>
                                <p className="text-sm text-slate-400">Pending leadership</p>
                                <h2 className="mt-3 text-3xl font-bold text-white">{summary.pendingCount}</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                            <section className="min-w-0">
                                <div className={panelClass}>
                                    <div className="border-b border-white/10 p-5 sm:p-6">
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <h2 className="text-2xl font-semibold text-white">My Modules</h2>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    Search and manage your enrolled modules.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Search by module code, name, lecturer, or group"
                                                    className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500/40"
                                                />

                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/40"
                                                >
                                                    <option value="MODULE_CODE_ASC">Module code A-Z</option>
                                                    <option value="MODULE_CODE_DESC">Module code Z-A</option>
                                                    <option value="YEAR_ASC">Year / semester ascending</option>
                                                    <option value="YEAR_DESC">Year / semester descending</option>
                                                    <option value="STATUS">Status</option>
                                                </select>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setStatusFilter('ALL')}
                                                    className={filterButtonClass(statusFilter === 'ALL')}
                                                >
                                                    All
                                                </button>
                                                <button
                                                    onClick={() => setStatusFilter('IN_GROUP')}
                                                    className={filterButtonClass(statusFilter === 'IN_GROUP')}
                                                >
                                                    In Group
                                                </button>
                                                <button
                                                    onClick={() => setStatusFilter('NO_GROUP')}
                                                    className={filterButtonClass(statusFilter === 'NO_GROUP')}
                                                >
                                                    No Group
                                                </button>
                                                <button
                                                    onClick={() => setStatusFilter('LEADER')}
                                                    className={filterButtonClass(statusFilter === 'LEADER')}
                                                >
                                                    Leader
                                                </button>
                                                <button
                                                    onClick={() => setStatusFilter('PENDING')}
                                                    className={filterButtonClass(statusFilter === 'PENDING')}
                                                >
                                                    Pending
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6">
                                        {loadingModules ? (
                                            <div className="space-y-4">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="animate-pulse rounded-2xl border border-white/10 bg-[#0B1220] p-5"
                                                    >
                                                        <div className="h-4 w-24 rounded bg-white/10" />
                                                        <div className="mt-3 h-6 w-56 rounded bg-white/10" />
                                                        <div className="mt-4 h-4 w-44 rounded bg-white/10" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : visibleModules.length === 0 ? (
                                            <div className="rounded-2xl border border-dashed border-white/10 bg-[#0B1220] px-6 py-12 text-center">
                                                <h3 className="text-lg font-semibold text-white">No modules found</h3>
                                                <p className="mt-2 text-sm text-slate-400">
                                                    Try another search or filter, or enroll in a new module.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {visibleModules.map((module) => {
                                                    const status = getStatusConfig(module);

                                                    return (
                                                        <div
                                                            key={module.id}
                                                            className="rounded-2xl border border-white/10 bg-[#0B1220] p-5 transition hover:border-orange-500/30"
                                                        >
                                                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex flex-wrap items-center gap-3">
                                                                        <span className="text-sm font-semibold text-orange-300">
                                                                            {module.moduleCode}
                                                                        </span>
                                                                        <span
                                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}
                                                                        >
                                                                            {status.label}
                                                                        </span>
                                                                    </div>

                                                                    <h3 className="mt-3 text-2xl font-semibold text-white">
                                                                        {module.moduleName}
                                                                    </h3>

                                                                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-400 sm:grid-cols-2 xl:grid-cols-4">
                                                                        <div>
                                                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                                                Year
                                                                            </p>
                                                                            <p className="mt-1 text-slate-300">
                                                                                {module.year}
                                                                            </p>
                                                                        </div>

                                                                        <div>
                                                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                                                Semester
                                                                            </p>
                                                                            <p className="mt-1 text-slate-300">
                                                                                {module.semester}
                                                                            </p>
                                                                        </div>

                                                                        <div className="min-w-0">
                                                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                                                Lecturer
                                                                            </p>
                                                                            <p className="mt-1 truncate text-slate-300">
                                                                                {module.lecturerName}
                                                                            </p>
                                                                        </div>

                                                                        <div className="min-w-0">
                                                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                                                Group
                                                                            </p>
                                                                            <p className="mt-1 truncate text-slate-300">
                                                                                {status.helper}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {module.relatedGroup && (
                                                                        <p className="mt-4 text-sm text-slate-400">
                                                                            Members: {module.relatedGroup.memberCount} /{' '}
                                                                            {module.relatedGroup.maxCapacity}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className="flex shrink-0 items-center gap-3">
                                                                    <button
                                                                        onClick={() => openModule(module.id)}
                                                                        className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                                                                    >
                                                                        Open Module
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <aside className="space-y-6">
                                <div className={panelClass}>
                                    <div className="p-5 sm:p-6">
                                        <h2 className="text-xl font-semibold text-white">Join a Module</h2>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Enter the enrollment key shared by your lecturer.
                                        </p>

                                        <form onSubmit={handleEnroll} className="mt-5 space-y-4">
                                            <input
                                                type="text"
                                                value={enrollmentKey}
                                                onChange={(e) => setEnrollmentKey(e.target.value)}
                                                placeholder="Enter enrollment key"
                                                className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500/40"
                                            />

                                            <button
                                                type="submit"
                                                disabled={joiningModule}
                                                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                                                    joiningModule
                                                        ? 'cursor-not-allowed bg-slate-600'
                                                        : 'bg-orange-500 hover:bg-orange-600'
                                                }`}
                                            >
                                                {joiningModule ? 'Enrolling...' : 'Join Module'}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className={panelClass}>
                                    <div className="p-5 sm:p-6">
                                        <h2 className="text-xl font-semibold text-white">Resources</h2>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Access your student resources dashboard.
                                        </p>

                                        <button
                                            onClick={() => navigate('/student/resources')}
                                            className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                                        >
                                            Open Resources
                                        </button>
                                    </div>
                                </div>

                                <div className={panelClass}>
                                    <div className="p-5 sm:p-6">
                                        <h2 className="text-xl font-semibold text-white">Overview</h2>

                                        <div className="mt-4 space-y-3">
                                            <div className="rounded-xl border border-white/10 bg-[#0B1220] p-4">
                                                <p className="text-sm font-semibold text-white">
                                                    {summary.joinedCount} module{summary.joinedCount === 1 ? '' : 's'} already in a group
                                                </p>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    Continue your group work from the module page.
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-white/10 bg-[#0B1220] p-4">
                                                <p className="text-sm font-semibold text-white">
                                                    {summary.noGroupCount} module{summary.noGroupCount === 1 ? '' : 's'} still need a group
                                                </p>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    Open those modules and join a team.
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-white/10 bg-[#0B1220] p-4">
                                                <p className="text-sm font-semibold text-white">
                                                    {summary.pendingCount} pending leadership request{summary.pendingCount === 1 ? '' : 's'}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    Use the pending filter to find them quickly.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;