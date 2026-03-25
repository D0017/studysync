import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const LecturerModules = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchLecturerModules = useCallback(async () => {
        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Lecturer session not found. Please login again.' });
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const modulesResponse = await axios.get(`/api/lecturer/modules/${storedUser.id}`);
            const assignedModules = Array.isArray(modulesResponse.data) ? modulesResponse.data : [];

            const detailedModules = await Promise.all(
                assignedModules.map(async (module) => {
                    try {
                        const groupsResponse = await axios.get(`/api/groups/modules/${module.id}/all`);
                        const groups = Array.isArray(groupsResponse.data) ? groupsResponse.data : [];

                        const studentCount = groups.reduce(
                            (sum, group) =>
                                sum + (Array.isArray(group.currentMembers) ? group.currentMembers.length : 0),
                            0
                        );

                        const approvedLeaderCount = groups.filter((group) => group.leader).length;
                        const pendingLeaderCount = groups.filter(
                            (group) => group.requestedLeader && !group.leader
                        ).length;

                        return {
                            ...module,
                            groups,
                            groupCount: groups.length,
                            studentCount,
                            approvedLeaderCount,
                            pendingLeaderCount
                        };
                    } catch {
                        return {
                            ...module,
                            groups: [],
                            groupCount: 0,
                            studentCount: 0,
                            approvedLeaderCount: 0,
                            pendingLeaderCount: 0
                        };
                    }
                })
            );

            setModules(detailedModules);
        } catch (error) {
            console.error('Failed to fetch lecturer modules:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load assigned modules.')
            });
            setModules([]);
        } finally {
            setLoading(false);
        }
    }, [storedUser?.id]);

    useEffect(() => {
        fetchLecturerModules();
    }, [fetchLecturerModules]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 p-7 md:p-8 shadow-2xl mb-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200 font-semibold">
                            Lecturer Modules
                        </p>
                        <h1 className="mt-3 text-3xl md:text-4xl font-black text-white">
                            My Assigned Modules
                        </h1>
                        <p className="mt-3 text-sm md:text-base text-slate-200">
                            Real-time overview of the modules assigned to your lecturer profile.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="rounded-2xl bg-white/10 border border-white/20 px-5 py-3 text-sm font-semibold text-white">
                            Total Modules: {loading ? '...' : modules.length}
                        </div>

                        <button
                            onClick={fetchLecturerModules}
                            className="rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-bold shadow-lg transition hover:bg-slate-100"
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

            {loading ? (
                <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-10 text-center shadow-lg text-slate-500">
                    Loading assigned modules...
                </div>
            ) : modules.length === 0 ? (
                <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-10 text-center shadow-lg text-slate-500">
                    No modules are assigned to you yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg"
                        >
                            <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />

                            <div className="p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                                            {module.moduleCode}
                                        </span>
                                        <h2 className="mt-3 text-xl font-bold text-slate-900">
                                            {module.moduleName}
                                        </h2>
                                    </div>

                                    <div className="text-right">
                                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                            Year {module.year}
                                        </span>
                                        <p className="mt-2 text-xs text-slate-500">
                                            Semester {module.semester}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                        <p className="text-xs text-slate-500">Groups</p>
                                        <h3 className="mt-2 text-2xl font-black text-blue-600">
                                            {module.groupCount}
                                        </h3>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                        <p className="text-xs text-slate-500">Students</p>
                                        <h3 className="mt-2 text-2xl font-black text-emerald-600">
                                            {module.studentCount}
                                        </h3>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                        <p className="text-xs text-slate-500">Leaders</p>
                                        <h3 className="mt-2 text-2xl font-black text-cyan-600">
                                            {module.approvedLeaderCount}
                                        </h3>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                        <p className="text-xs text-slate-500">Pending</p>
                                        <h3 className="mt-2 text-2xl font-black text-amber-500">
                                            {module.pendingLeaderCount}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-slate-800">Groups in this Module</h3>
                                        <span className="text-xs text-slate-500">
                                            Enrollment Key: {module.enrollmentKey}
                                        </span>
                                    </div>

                                    {module.groups.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                                            No groups have been created for this module yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {module.groups.map((group) => (
                                                <div
                                                    key={group.id}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900">
                                                                {group.groupName}
                                                            </h4>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Members:{' '}
                                                                {Array.isArray(group.currentMembers)
                                                                    ? group.currentMembers.length
                                                                    : 0}{' '}
                                                                / {group.maxCapacity}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {group.leader ? (
                                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                                    Leader Assigned
                                                                </span>
                                                            ) : group.requestedLeader ? (
                                                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                                                                    Leadership Pending
                                                                </span>
                                                            ) : (
                                                                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                                                                    No Leader
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {group.leader && (
                                                        <p className="mt-3 text-xs text-slate-600">
                                                            <span className="font-semibold text-slate-800">Leader:</span>{' '}
                                                            {group.leader.fullName} ({group.leader.universityId})
                                                        </p>
                                                    )}

                                                    {group.requestedLeader && !group.leader && (
                                                        <p className="mt-3 text-xs text-slate-600">
                                                            <span className="font-semibold text-slate-800">
                                                                Requested Leader:
                                                            </span>{' '}
                                                            {group.requestedLeader.fullName} ({group.requestedLeader.universityId})
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LecturerModules;