import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const ModuleGroups = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const response = await axios.get(`http://localhost:8090/api/groups/modules/${moduleId}/all`);
            setGroups(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch module groups:', error);
            setGroups([]);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load module groups.')
            });
        } finally {
            setLoading(false);
        }
    }, [moduleId]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const myGroup = groups.find(
        (group) =>
            Array.isArray(group.currentMembers) &&
            group.currentMembers.some((member) => member.id === storedUser?.id)
    );

    const hasJoinedAnyGroup = Boolean(myGroup);

    const handleJoinGroup = async (groupId) => {
        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'User session is missing. Please login again.' });
            return;
        }

        if (hasJoinedAnyGroup) {
            setMessage({ type: 'error', text: 'You already joined a group in this module.' });
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8090/api/groups/${groupId}/join`,
                null,
                {
                    params: { studentId: storedUser.id }
                }
            );

            setMessage({ type: 'success', text: response.data });
            await fetchGroups();
        } catch (error) {
            console.error('Failed to join group:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to join the group.')
            });
        }
    };

    const handleRequestLeadership = async (groupId) => {
        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'User session is missing. Please login again.' });
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8090/api/groups/${groupId}/request-leadership`,
                null,
                {
                    params: { studentId: storedUser.id }
                }
            );

            setMessage({ type: 'success', text: response.data });
            await fetchGroups();
        } catch (error) {
            console.error('Failed to request leadership:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to request leadership.')
            });
        }
    };

    const getMemberCount = (group) =>
        Array.isArray(group.currentMembers) ? group.currentMembers.length : 0;

    const isMyGroup = (group) =>
        Array.isArray(group.currentMembers) &&
        group.currentMembers.some((member) => member.id === storedUser?.id);

    const isMyApprovedLeaderGroup = (group) =>
        group.leader && group.leader.id === storedUser?.id;

    const isMyPendingLeaderGroup = (group) =>
        group.requestedLeader && group.requestedLeader.id === storedUser?.id;

    const isGroupFull = (group) => getMemberCount(group) >= group.maxCapacity;

    const moduleInfo = groups.length > 0 ? groups[0].module : null;

    const glassPanel =
        'rounded-[30px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl';

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0A0A0C] px-6 py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.20),transparent_25%),radial-gradient(circle_at_left,rgba(255,255,255,0.05),transparent_22%)]" />
            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#FF6A00]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className={`${glassPanel} mb-6 p-6 md:p-8`}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-4 py-2 text-sm font-medium text-[#FF6A00]">
                                Module Collaboration
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                                Module Groups
                            </h1>
                            <p className="mt-2 text-base text-gray-300">
                                {moduleInfo
                                    ? `${moduleInfo.moduleCode} - ${moduleInfo.moduleName}`
                                    : `Module ID: ${moduleId}`}
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                View available groups and manage your membership clearly.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/student-dashboard')}
                                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Back to Dashboard
                            </button>

                            <button
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                className="rounded-2xl bg-[#FF6A00] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(255,106,0,0.28)] transition hover:scale-[1.01] hover:bg-[#ff7b22]"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {myGroup && (
                    <div className="mb-6 rounded-[28px] border border-[#FF6A00]/20 bg-[#FF6A00]/10 p-6 backdrop-blur-xl">
                        <h2 className="text-xl font-black text-white">Your Current Group</h2>
                        <p className="mt-2 text-sm text-gray-200">
                            You are currently in <span className="font-semibold text-white">{myGroup.groupName}</span>.
                        </p>

                        {isMyApprovedLeaderGroup(myGroup) && (
                            <p className="mt-3 text-sm font-semibold text-green-300">
                                You are the approved leader of this group.
                            </p>
                        )}

                        {isMyPendingLeaderGroup(myGroup) && !isMyApprovedLeaderGroup(myGroup) && (
                            <p className="mt-3 text-sm font-semibold text-yellow-300">
                                Your leadership request is pending admin approval.
                            </p>
                        )}
                    </div>
                )}

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

                <div className={`${glassPanel} p-6`}>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                                Groups
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-white">Available Groups</h2>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Join one group only within this module.
                            </p>
                        </div>

                        <button
                            onClick={fetchGroups}
                            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-gray-400">Loading groups...</p>
                    ) : groups.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-black/10 py-12 text-center text-gray-400">
                            No groups found for this module yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {groups.map((group) => {
                                const myGroupFlag = isMyGroup(group);
                                const approvedLeaderFlag = isMyApprovedLeaderGroup(group);
                                const pendingLeaderFlag = isMyPendingLeaderGroup(group);
                                const fullFlag = isGroupFull(group);

                                return (
                                    <div
                                        key={group.id}
                                        className="rounded-[28px] border border-white/10 bg-black/10 p-5 transition hover:border-[#FF6A00]/30 hover:bg-white/5"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-xl font-black text-white">
                                                    {group.groupName}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-400">
                                                    Members: {getMemberCount(group)} / {group.maxCapacity}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {myGroupFlag && (
                                                    <span className="rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-3 py-1 text-xs font-bold text-[#FF6A00]">
                                                        My Group
                                                    </span>
                                                )}

                                                {approvedLeaderFlag && (
                                                    <span className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
                                                        My Leadership Approved
                                                    </span>
                                                )}

                                                {pendingLeaderFlag && !approvedLeaderFlag && (
                                                    <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                                                        My Request Pending
                                                    </span>
                                                )}

                                                {fullFlag && (
                                                    <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
                                                        Full
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                                                Members
                                            </h4>

                                            {Array.isArray(group.currentMembers) && group.currentMembers.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {group.currentMembers.map((member) => (
                                                        <li
                                                            key={member.id}
                                                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200"
                                                        >
                                                            {member.fullName} ({member.universityId})
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-400">No members yet.</p>
                                            )}
                                        </div>

                                        <div className="mt-5 space-y-2 text-sm text-gray-400">
                                            {group.leader && (
                                                <p>
                                                    <span className="font-semibold text-gray-200">Leader:</span>{' '}
                                                    {group.leader.fullName} ({group.leader.universityId})
                                                </p>
                                            )}

                                            {group.requestedLeader && !group.leader && (
                                                <p>
                                                    <span className="font-semibold text-gray-200">Pending Leadership Request:</span>{' '}
                                                    {group.requestedLeader.fullName} ({group.requestedLeader.universityId})
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-6 flex flex-wrap gap-3">
                                            {!hasJoinedAnyGroup && !fullFlag && (
                                                <button
                                                    onClick={() => handleJoinGroup(group.id)}
                                                    className="rounded-2xl bg-[#FF6A00] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(255,106,0,0.22)] transition hover:bg-[#ff7b22]"
                                                >
                                                    Join Group
                                                </button>
                                            )}

                                            {!hasJoinedAnyGroup && fullFlag && (
                                                <button
                                                    disabled
                                                    className="cursor-not-allowed rounded-2xl bg-gray-500 px-4 py-2.5 text-sm font-semibold text-white"
                                                >
                                                    Group Full
                                                </button>
                                            )}

                                            {hasJoinedAnyGroup && !myGroupFlag && (
                                                <button
                                                    disabled
                                                    className="cursor-not-allowed rounded-2xl bg-gray-500 px-4 py-2.5 text-sm font-semibold text-white"
                                                >
                                                    Already Joined Another Group
                                                </button>
                                            )}

                                            {myGroupFlag && !approvedLeaderFlag && !pendingLeaderFlag && !group.leader && (
                                                <button
                                                    onClick={() => handleRequestLeadership(group.id)}
                                                    className="rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-500/15"
                                                >
                                                    Request Leadership
                                                </button>
                                            )}

                                            {myGroupFlag && pendingLeaderFlag && !approvedLeaderFlag && (
                                                <button
                                                    disabled
                                                    className="cursor-not-allowed rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-2.5 text-sm font-semibold text-yellow-300"
                                                >
                                                    Leadership Requested
                                                </button>
                                            )}

                                            {myGroupFlag && approvedLeaderFlag && (
                                                <button
                                                    disabled
                                                    className="cursor-not-allowed rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-300"
                                                >
                                                    You Are Leader
                                                </button>
                                            )}

                                            {myGroupFlag && group.leader && !approvedLeaderFlag && (
                                                <button
                                                    disabled
                                                    className="cursor-not-allowed rounded-2xl bg-gray-500 px-4 py-2.5 text-sm font-semibold text-white"
                                                >
                                                    Leader Already Assigned
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModuleGroups;