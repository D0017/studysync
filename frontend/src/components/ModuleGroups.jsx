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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Module Groups</h1>
                        <p className="text-gray-600 mt-1">
                            {moduleInfo
                                ? `${moduleInfo.moduleCode} - ${moduleInfo.moduleName}`
                                : `Module ID: ${moduleId}`}
                        </p>
                        <p className="text-sm text-gray-500">
                            View available groups and manage your membership clearly.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/student-dashboard')}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Back to Dashboard
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {myGroup && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
                        <h2 className="text-xl font-bold text-blue-900">Your Current Group</h2>
                        <p className="text-blue-800 mt-1">
                            You are currently in <span className="font-semibold">{myGroup.groupName}</span>.
                        </p>

                        {isMyApprovedLeaderGroup(myGroup) && (
                            <p className="text-sm text-green-700 mt-2 font-semibold">
                                You are the approved leader of this group.
                            </p>
                        )}

                        {isMyPendingLeaderGroup(myGroup) && !isMyApprovedLeaderGroup(myGroup) && (
                            <p className="text-sm text-yellow-700 mt-2 font-semibold">
                                Your leadership request is pending admin approval.
                            </p>
                        )}
                    </div>
                )}

                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Available Groups</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Join one group only within this module.
                            </p>
                        </div>

                        <button
                            onClick={fetchGroups}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-gray-500">Loading groups...</p>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No groups found for this module yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groups.map((group) => {
                                const myGroupFlag = isMyGroup(group);
                                const approvedLeaderFlag = isMyApprovedLeaderGroup(group);
                                const pendingLeaderFlag = isMyPendingLeaderGroup(group);
                                const fullFlag = isGroupFull(group);

                                return (
                                    <div
                                        key={group.id}
                                        className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {group.groupName}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Members: {getMemberCount(group)} / {group.maxCapacity}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 justify-end">
                                                {myGroupFlag && (
                                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                                                        My Group
                                                    </span>
                                                )}

                                                {approvedLeaderFlag && (
                                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                                        My Leadership Approved
                                                    </span>
                                                )}

                                                {pendingLeaderFlag && !approvedLeaderFlag && (
                                                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                                                        My Request Pending
                                                    </span>
                                                )}

                                                {fullFlag && (
                                                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                                        Full
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Members</h4>

                                            {Array.isArray(group.currentMembers) && group.currentMembers.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {group.currentMembers.map((member) => (
                                                        <li
                                                            key={member.id}
                                                            className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2"
                                                        >
                                                            {member.fullName} ({member.universityId})
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500">No members yet.</p>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-1 text-sm text-gray-600">
                                            {group.leader && (
                                                <p>
                                                    <span className="font-semibold text-gray-700">Leader:</span>{' '}
                                                    {group.leader.fullName} ({group.leader.universityId})
                                                </p>
                                            )}

                                            {group.requestedLeader && !group.leader && (
                                                <p>
                                                    <span className="font-semibold text-gray-700">Pending Leadership Request:</span>{' '}
                                                    {group.requestedLeader.fullName} ({group.requestedLeader.universityId})
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-3">
                                            {!hasJoinedAnyGroup && !fullFlag && (
                                                <button
                                                    onClick={() => handleJoinGroup(group.id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                                >
                                                    Join Group
                                                </button>
                                            )}

                                            {!hasJoinedAnyGroup && fullFlag && (
                                                <button
                                                    disabled
                                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                                                >
                                                    Group Full
                                                </button>
                                            )}

                                            {hasJoinedAnyGroup && !myGroupFlag && (
                                                <button
                                                    disabled
                                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                                                >
                                                    Already Joined Another Group
                                                </button>
                                            )}

                                            {myGroupFlag && !approvedLeaderFlag && !pendingLeaderFlag && !group.leader && (
                                                <button
                                                    onClick={() => handleRequestLeadership(group.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                                >
                                                    Request Leadership
                                                </button>
                                            )}

                                            {myGroupFlag && pendingLeaderFlag && !approvedLeaderFlag && (
                                                <button
                                                    disabled
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                                                >
                                                    Leadership Requested
                                                </button>
                                            )}

                                            {myGroupFlag && approvedLeaderFlag && (
                                                <button
                                                    disabled
                                                    className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                                                >
                                                    You Are Leader
                                                </button>
                                            )}

                                            {myGroupFlag && group.leader && !approvedLeaderFlag && (
                                                <button
                                                    disabled
                                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
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