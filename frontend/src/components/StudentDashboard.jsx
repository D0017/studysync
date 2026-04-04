import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const StudentDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [enrollmentKey, setEnrollmentKey] = useState('');
    const [modules, setModules] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [loadingModules, setLoadingModules] = useState(true);
    const [joiningModule, setJoiningModule] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

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

    const statCardClass =
        'rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.20)] backdrop-blur-xl';

    const glassPanelClass =
        'rounded-[30px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl';

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0A0A0C] px-6 py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.20),transparent_25%),radial-gradient(circle_at_left,rgba(255,255,255,0.05),transparent_22%)]" />
            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#FF6A00]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header */}
                <div className={`${glassPanelClass} mb-6 p-6 md:p-8`}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-4 py-2 text-sm font-medium text-[#FF6A00]">
                                Student Workspace
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                                Welcome back, <span className="font-semibold text-white">{storedUser?.fullName}</span>
                            </h1>

                            <p className="mt-1 text-sm text-gray-400">
                                University ID: {storedUser?.universityId}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Home
                            </button>

                            <button
                                onClick={handleLogout}
                                className="rounded-2xl bg-[#FF6A00] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(255,106,0,0.28)] transition hover:scale-[1.01] hover:bg-[#ff7b22]"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className={statCardClass}>
                        <p className="text-sm font-medium text-gray-400">Enrolled Modules</p>
                        <h2 className="mt-3 text-4xl font-black text-[#FF6A00]">{modules.length}</h2>
                        <p className="mt-2 text-sm text-gray-400">Modules you can access right now</p>
                    </div>

                    <div className={statCardClass}>
                        <p className="text-sm font-medium text-gray-400">Joined Groups</p>
                        <h2 className="mt-3 text-4xl font-black text-white">{joinedGroups.length}</h2>
                        <p className="mt-2 text-sm text-gray-400">Groups you currently belong to</p>
                    </div>

                    <div className={statCardClass}>
                        <p className="text-sm font-medium text-gray-400">Leadership Requests</p>
                        <h2 className="mt-3 text-4xl font-black text-[#FF6A00]">
                            {joinedGroups.filter((group) => group.isLeadershipPending).length}
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">Pending leadership approvals</p>
                    </div>
                </div>

                {/* Message */}
                {message.text && (
                    <div
                        className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-medium backdrop-blur-xl ${
                            message.type === 'success'
                                ? 'border-green-400/20 bg-green-500/10 text-green-300'
                                : 'border-red-400/20 bg-red-500/10 text-red-300'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Join Module */}
                    <div className="xl:col-span-1">
                        <div className={`${glassPanelClass} p-6`}>
                            <div className="mb-5">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                                    Enrollment
                                </p>
                                <h2 className="mt-2 text-2xl font-black text-white">Join Module</h2>
                                <p className="mt-2 text-sm leading-6 text-gray-400">
                                    Enter the enrollment key shared for your module.
                                </p>
                            </div>

                            <form onSubmit={handleEnroll} className="space-y-4">
                                <input
                                    type="text"
                                    value={enrollmentKey}
                                    onChange={(e) => setEnrollmentKey(e.target.value)}
                                    placeholder="Enter enrollment key"
                                    className="w-full rounded-2xl border border-white/10 bg-[#F4F4F6] px-4 py-3 text-sm text-[#1F1F23] outline-none transition focus:border-[#FF6A00] focus:ring-2 focus:ring-[#FF6A00]/20"
                                />

                                <button
                                    type="submit"
                                    disabled={joiningModule}
                                    className={`w-full rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition ${
                                        joiningModule
                                            ? 'cursor-not-allowed bg-gray-500'
                                            : 'bg-[#FF6A00] shadow-[0_16px_35px_rgba(255,106,0,0.28)] hover:scale-[1.01] hover:bg-[#ff7b22]'
                                    }`}
                                >
                                    {joiningModule ? 'Enrolling...' : 'Enroll'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* My Resources */}
                        <div className={`${glassPanelClass} p-6`}>
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                                        Resources
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black text-white">My Resources</h2>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        Access your study materials, uploaded files, and shared resources.
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate('/student/resources')}
                                    className="rounded-2xl bg-[#FF6A00] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(255,106,0,0.28)] transition hover:scale-[1.01] hover:bg-[#ff7b22]"
                                >
                                    Open Resources
                                </button>
                            </div>
                        </div>

                        {/* Group status */}
                        <div className={`${glassPanelClass} p-6`}>
                            <div className="mb-6">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                                    Collaboration
                                </p>
                                <h2 className="mt-2 text-2xl font-black text-white">My Group Status</h2>
                                <p className="mt-2 text-sm leading-6 text-gray-400">
                                    These are the groups you have already joined in your enrolled modules.
                                </p>
                            </div>

                            {loadingModules ? (
                                <p className="text-gray-400">Loading group status...</p>
                            ) : joinedGroups.length === 0 ? (
                                <div className="rounded-3xl border border-white/10 bg-black/10 py-12 text-center text-gray-400">
                                    You have not joined any groups yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {joinedGroups.map((group) => (
                                        <div
                                            key={`${group.moduleId}-${group.groupId}`}
                                            className="rounded-3xl border border-white/10 bg-black/10 p-5 transition hover:border-[#FF6A00]/30 hover:bg-white/5"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        {group.moduleCode}
                                                    </h3>
                                                    <p className="mt-1 text-gray-300">{group.moduleName}</p>
                                                </div>

                                                {group.isLeader ? (
                                                    <span className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
                                                        Leader
                                                    </span>
                                                ) : group.isLeadershipPending ? (
                                                    <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                                                        Pending
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-3 py-1 text-xs font-bold text-[#FF6A00]">
                                                        Member
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-4 text-sm text-gray-400">
                                                <span className="font-semibold text-gray-200">Group:</span> {group.groupName}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-400">
                                                <span className="font-semibold text-gray-200">Members:</span> {group.memberCount} / {group.maxCapacity}
                                            </p>

                                            <button
                                                onClick={() => openModule(group.moduleId)}
                                                className="mt-5 rounded-2xl bg-[#FF6A00] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(255,106,0,0.22)] transition hover:bg-[#ff7b22]"
                                            >
                                                Open Module
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* My modules */}
                        <div className={`${glassPanelClass} p-6`}>
                            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                                        Modules
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black text-white">My Modules</h2>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        These are the modules you have enrolled in.
                                    </p>
                                </div>

                                <button
                                    onClick={fetchStudentModules}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Refresh
                                </button>
                            </div>

                            {loadingModules ? (
                                <p className="text-gray-400">Loading modules...</p>
                            ) : modules.length === 0 ? (
                                <div className="rounded-3xl border border-white/10 bg-black/10 py-12 text-center text-gray-400">
                                    You have not enrolled in any modules yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {modules.map((module) => {
                                        const relatedGroup = joinedGroups.find(
                                            (group) => group.moduleId === module.id
                                        );

                                        return (
                                            <div
                                                key={module.id}
                                                className="rounded-3xl border border-white/10 bg-black/10 p-5 transition hover:border-[#FF6A00]/30 hover:bg-white/5"
                                            >
                                                <h3 className="text-xl font-bold text-white">
                                                    {module.moduleCode}
                                                </h3>
                                                <p className="mt-1 text-gray-300">{module.moduleName}</p>
                                                <p className="mt-3 text-sm text-gray-400">
                                                    Year {module.year} • Semester {module.semester}
                                                </p>
                                                <p className="mt-2 text-sm text-gray-400">
                                                    <span className="font-semibold text-gray-200">Group Status:</span>{' '}
                                                    {relatedGroup ? relatedGroup.groupName : 'Not joined yet'}
                                                </p>

                                                <button
                                                    onClick={() => openModule(module.id)}
                                                    className="mt-5 rounded-2xl bg-[#FF6A00] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(255,106,0,0.22)] transition hover:bg-[#ff7b22]"
                                                >
                                                    Open Module
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;