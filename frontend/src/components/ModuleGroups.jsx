import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    ArrowLeft,
    Crown,
    FolderKanban,
    LogOut,
    RefreshCw,
    Users,
    Workflow
} from 'lucide-react';

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
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const response = await axios.get(`/api/groups/modules/${moduleId}/all`);
            setGroups(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch module groups:', error);
            const errorText = getErrorMessage(error, 'Failed to load module groups.');
            setGroups([]);
            setMessage({
                type: 'error',
                text: errorText
            });
            toast.error(errorText);
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
            const errorText = 'User session is missing. Please login again.';
            setMessage({ type: 'error', text: errorText });
            toast.error(errorText);
            return;
        }

        if (hasJoinedAnyGroup) {
            const errorText = 'You already joined a group in this module.';
            setMessage({ type: 'error', text: errorText });
            toast.error(errorText);
            return;
        }

        try {
            const response = await axios.post(`/api/groups/${groupId}/join`, null, {
                params: { studentId: storedUser.id }
            });

            setMessage({ type: 'success', text: response.data });
            toast.success(typeof response.data === 'string' ? response.data : 'Joined group successfully.');
            await fetchGroups();
        } catch (error) {
            console.error('Failed to join group:', error);
            const errorText = getErrorMessage(error, 'Failed to join the group.');
            setMessage({
                type: 'error',
                text: errorText
            });
            toast.error(errorText);
        }
    };

    const handleRequestLeadership = async (groupId) => {
        if (!storedUser?.id) {
            const errorText = 'User session is missing. Please login again.';
            setMessage({ type: 'error', text: errorText });
            toast.error(errorText);
            return;
        }

        try {
            const response = await axios.post(`/api/groups/${groupId}/request-leader`, null, {
                params: { studentId: storedUser.id }
            });

            setMessage({ type: 'success', text: response.data });
            toast.success(
                typeof response.data === 'string'
                    ? response.data
                    : 'Leadership request sent successfully.'
            );
            await fetchGroups();
        } catch (error) {
            console.error('Failed to request leadership:', error);
            const errorText = getErrorMessage(error, 'Failed to request leadership.');
            setMessage({
                type: 'error',
                text: errorText
            });
            toast.error(errorText);
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

    const pageClass = 'min-h-screen bg-[#12141A] text-[#F4F4F6]';
    const panelClass =
        'rounded-3xl border border-white/10 bg-[#1F1F23] shadow-[0_12px_30px_rgba(0,0,0,0.18)]';
    const mutedPanelClass =
        'rounded-2xl border border-white/10 bg-[#181B21]';
    const neutralButton =
        'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#F4F4F6] transition hover:bg-white/10';
    const primaryButton =
        'inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6A00] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#E65F00]';
    const successButton =
        'inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/15';
    const infoButton =
        'inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/15';
    const disabledButton =
        'inline-flex items-center justify-center gap-2 rounded-xl bg-[#3A3F47] px-4 py-3 text-sm font-semibold text-slate-300 cursor-not-allowed';
    const tagBase = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border';

    return (
        <div className={pageClass}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className={`${panelClass} mb-6 p-6 md:p-8`}>
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-4 py-2 text-sm font-medium text-[#FF6A00]">
                                <Workflow className="h-4 w-4" />
                                Module Collaboration
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                                Module Groups
                            </h1>

                            <p className="mt-3 text-base text-slate-300">
                                {moduleInfo
                                    ? `${moduleInfo.moduleCode} • ${moduleInfo.moduleName}`
                                    : `Module ID: ${moduleId}`}
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                View available groups, join one team, and manage leadership requests clearly.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/student-dashboard')}
                                className={neutralButton}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </button>

                            <button
                                onClick={fetchGroups}
                                className={neutralButton}
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </button>

                            <button
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                className={primaryButton}
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {myGroup && (
                    <div className="mb-6 rounded-3xl border border-[#FF6A00]/20 bg-[#FF6A00]/10 p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">Your Current Group</h2>
                                <p className="mt-2 text-sm text-slate-200">
                                    You are currently in{' '}
                                    <span className="font-semibold text-white">{myGroup.groupName}</span>.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {isMyApprovedLeaderGroup(myGroup) && (
                                    <span className={`${tagBase} border-emerald-500/20 bg-emerald-500/10 text-emerald-300`}>
                                        Approved Leader
                                    </span>
                                )}

                                {isMyPendingLeaderGroup(myGroup) && !isMyApprovedLeaderGroup(myGroup) && (
                                    <span className={`${tagBase} border-amber-500/20 bg-amber-500/10 text-amber-300`}>
                                        Leadership Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

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

                <div className={`${panelClass} p-6`}>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6A00]">
                                Groups
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-white">Available Groups</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Join one group only within this module.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#181B21] px-4 py-3 text-sm text-slate-300">
                            {groups.length} group{groups.length === 1 ? '' : 's'} available
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className={`${mutedPanelClass} animate-pulse p-5`}>
                                    <div className="h-5 w-40 rounded bg-white/10" />
                                    <div className="mt-4 h-4 w-24 rounded bg-white/10" />
                                    <div className="mt-6 h-24 rounded bg-white/10" />
                                    <div className="mt-6 h-10 w-36 rounded bg-white/10" />
                                </div>
                            ))}
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-[#181B21] py-14 text-center text-slate-400">
                            No groups found for this module yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {groups.map((group) => {
                                const myGroupFlag = isMyGroup(group);
                                const approvedLeaderFlag = isMyApprovedLeaderGroup(group);
                                const pendingLeaderFlag = isMyPendingLeaderGroup(group);
                                const fullFlag = isGroupFull(group);
                                const memberCount = getMemberCount(group);
                                const percentFull = group.maxCapacity
                                    ? Math.min((memberCount / group.maxCapacity) * 100, 100)
                                    : 0;

                                return (
                                    <div
                                        key={group.id}
                                        className={`${mutedPanelClass} p-5 transition hover:border-[#FF6A00]/25`}
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-xl font-bold text-white">
                                                        {group.groupName}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-400">
                                                        Members: {memberCount} / {group.maxCapacity}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {myGroupFlag && (
                                                        <span className={`${tagBase} border-[#FF6A00]/20 bg-[#FF6A00]/10 text-[#FF6A00]`}>
                                                            My Group
                                                        </span>
                                                    )}

                                                    {approvedLeaderFlag && (
                                                        <span className={`${tagBase} border-emerald-500/20 bg-emerald-500/10 text-emerald-300`}>
                                                            Leader
                                                        </span>
                                                    )}

                                                    {pendingLeaderFlag && !approvedLeaderFlag && (
                                                        <span className={`${tagBase} border-amber-500/20 bg-amber-500/10 text-amber-300`}>
                                                            Pending
                                                        </span>
                                                    )}

                                                    {fullFlag && (
                                                        <span className={`${tagBase} border-red-500/20 bg-red-500/10 text-red-300`}>
                                                            Full
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                                                    <span>Capacity</span>
                                                    <span>{Math.round(percentFull)}%</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-white/10">
                                                    <div
                                                        className="h-2 rounded-full bg-[#FF6A00] transition-all"
                                                        style={{ width: `${percentFull}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                                                <div>
                                                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                                        <Users className="h-4 w-4" />
                                                        Members
                                                    </h4>

                                                    {Array.isArray(group.currentMembers) && group.currentMembers.length > 0 ? (
                                                        <ul className="space-y-2">
                                                            {group.currentMembers.map((member) => (
                                                                <li
                                                                    key={member.id}
                                                                    className="rounded-2xl border border-white/10 bg-[#20242C] px-4 py-3 text-sm text-slate-200"
                                                                >
                                                                    <p className="font-medium text-white">{member.fullName}</p>
                                                                    <p className="mt-0.5 text-xs text-slate-400">{member.universityId}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <div className="rounded-2xl border border-dashed border-white/10 bg-[#20242C] px-4 py-4 text-sm text-slate-400">
                                                            No members yet.
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                                        <Crown className="h-4 w-4" />
                                                        Leadership
                                                    </h4>

                                                    <div className="space-y-2">
                                                        <div className="rounded-2xl border border-white/10 bg-[#20242C] px-4 py-3 text-sm">
                                                            <p className="text-xs uppercase tracking-wide text-slate-500">Leader</p>
                                                            <p className="mt-1 text-slate-200">
                                                                {group.leader
                                                                    ? `${group.leader.fullName} (${group.leader.universityId})`
                                                                    : 'Not assigned yet'}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-2xl border border-white/10 bg-[#20242C] px-4 py-3 text-sm">
                                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                                Pending Request
                                                            </p>
                                                            <p className="mt-1 text-slate-200">
                                                                {group.requestedLeader && !group.leader
                                                                    ? `${group.requestedLeader.fullName} (${group.requestedLeader.universityId})`
                                                                    : 'No pending request'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 pt-2">
                                                {!hasJoinedAnyGroup && !fullFlag && (
                                                    <button
                                                        onClick={() => handleJoinGroup(group.id)}
                                                        className={primaryButton}
                                                    >
                                                        Join Group
                                                    </button>
                                                )}

                                                {!hasJoinedAnyGroup && fullFlag && (
                                                    <button disabled className={disabledButton}>
                                                        Group Full
                                                    </button>
                                                )}

                                                {hasJoinedAnyGroup && !myGroupFlag && (
                                                    <button disabled className={disabledButton}>
                                                        Already Joined Another Group
                                                    </button>
                                                )}

                                                {myGroupFlag && !approvedLeaderFlag && !pendingLeaderFlag && !group.leader && (
                                                    <button
                                                        onClick={() => handleRequestLeadership(group.id)}
                                                        className={successButton}
                                                    >
                                                        Request Leadership
                                                    </button>
                                                )}

                                                {myGroupFlag && pendingLeaderFlag && !approvedLeaderFlag && (
                                                    <button disabled className={disabledButton}>
                                                        Leadership Requested
                                                    </button>
                                                )}

                                                {myGroupFlag && approvedLeaderFlag && (
                                                    <button disabled className={disabledButton}>
                                                        You Are Leader
                                                    </button>
                                                )}

                                                {myGroupFlag && group.leader && !approvedLeaderFlag && (
                                                    <button disabled className={disabledButton}>
                                                        Leader Already Assigned
                                                    </button>
                                                )}

                                                {myGroupFlag && (
                                                    <button
                                                        onClick={() => navigate(`/groups/${group.id}/project`)}
                                                        className={successButton}
                                                    >
                                                        <FolderKanban className="h-4 w-4" />
                                                        Open Project Board
                                                    </button>
                                                )}

                                                {myGroupFlag && (
                                                    <button
                                                        onClick={() => navigate(`/groups/${group.id}/jira-board`)}
                                                        className={infoButton}
                                                    >
                                                        <Workflow className="h-4 w-4" />
                                                        Open Jira Board
                                                    </button>
                                                )}
                                            </div>
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