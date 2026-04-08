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
        /* Background using #F4F4F6 */
        <div className="max-w-7xl mx-auto p-4 min-h-screen bg-[#F4F4F6]">
            {/* Header section using #0A0A0C and #1F1F23 */}
            <div className="rounded-3xl bg-[#0A0A0C] p-7 md:p-8 shadow-2xl mb-8 border-b-4 border-[#FF6A00]">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#FF6A00] font-semibold">
                            Lecturer Modules
                        </p>
                        <h1 className="mt-3 text-3xl md:text-4xl font-black text-white">
                            My Assigned Modules
                        </h1>
                        <p className="mt-3 text-sm md:text-base text-gray-400">
                            Real-time overview of the modules assigned to your lecturer profile.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="rounded-2xl bg-[#1F1F23] border border-white/10 px-5 py-3 text-sm font-semibold text-white">
                            Total Modules: {loading ? '...' : modules.length}
                        </div>

                        {/* Button using #FF6A00 */}
                        <button
                            onClick={fetchLecturerModules}
                            className="rounded-2xl bg-[#FF6A00] text-white px-5 py-3 text-sm font-bold shadow-lg transition hover:bg-[#e55f00]"
                        >
                            Refresh Data
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
                <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-lg text-[#1F1F23]">
                    Loading assigned modules...
                </div>
            ) : modules.length === 0 ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-lg text-[#1F1F23]">
                    No modules are assigned to you yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition-hover hover:shadow-xl"
                        >
                            {/* Decorative Top Accent */}
                            <div className="h-2 bg-[#FF6A00]" />

                            <div className="p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="inline-flex rounded-full bg-[#1F1F23] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                            {module.moduleCode}
                                        </span>
                                        <h2 className="mt-3 text-xl font-bold text-[#0A0A0C]">
                                            {module.moduleName}
                                        </h2>
                                    </div>

                                    <div className="text-right">
                                        <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#FF6A00] border border-orange-100">
                                            Year {module.year}
                                        </span>
                                        <p className="mt-2 text-xs text-gray-500 font-medium">
                                            Semester {module.semester}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="rounded-2xl bg-[#F4F4F6] border border-gray-100 p-4">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Groups</p>
                                        <h3 className="mt-2 text-2xl font-black text-[#0A0A0C]">
                                            {module.groupCount}
                                        </h3>
                                    </div>

                                    <div className="rounded-2xl bg-[#F4F4F6] border border-gray-100 p-4">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Students</p>
                                        <h3 className="mt-2 text-2xl font-black text-[#FF6A00]">
                                            {module.studentCount}
                                        </h3>
                                    </div>

                                    <div className="rounded-2xl bg-[#F4F4F6] border border-gray-100 p-4">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Leaders</p>
                                        <h3 className="mt-2 text-2xl font-black text-[#1F1F23]">
                                            {module.approvedLeaderCount}
                                        </h3>
                                    </div>

                                    <div className="rounded-2xl bg-[#F4F4F6] border border-gray-100 p-4">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Pending</p>
                                        <h3 className="mt-2 text-2xl font-black text-amber-600">
                                            {module.pendingLeaderCount}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                        <h3 className="text-sm font-bold text-[#0A0A0C]">Groups Overview</h3>
                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            Key: {module.enrollmentKey}
                                        </span>
                                    </div>

                                    {module.groups.length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-gray-300 bg-[#F4F4F6] p-4 text-sm text-gray-500">
                                            No groups have been created for this module yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {module.groups.map((group) => (
                                                <div
                                                    key={group.id}
                                                    className="rounded-2xl border border-gray-100 bg-[#F4F4F6] p-4"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-[#0A0A0C]">
                                                                {group.groupName}
                                                            </h4>
                                                            <p className="mt-1 text-xs text-gray-500 font-medium">
                                                                Capacity: {Array.isArray(group.currentMembers) ? group.currentMembers.length : 0} / {group.maxCapacity}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {group.leader ? (
                                                                <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700 uppercase">
                                                                    Leader Assigned
                                                                </span>
                                                            ) : group.requestedLeader ? (
                                                                <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-700 uppercase">
                                                                    Leadership Pending
                                                                </span>
                                                            ) : (
                                                                <span className="rounded-full bg-gray-200 px-3 py-1 text-[10px] font-bold text-gray-600 uppercase">
                                                                    No Leader
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {(group.leader || group.requestedLeader) && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200/50">
                                                            <p className="text-xs text-gray-600">
                                                                <span className="font-bold text-[#1F1F23]">
                                                                    {group.leader ? 'Leader:' : 'Requested:'}
                                                                </span>{' '}
                                                                {(group.leader || group.requestedLeader).fullName} ({(group.leader || group.requestedLeader).universityId})
                                                            </p>
                                                        </div>
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