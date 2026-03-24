import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
            const response = await axios.get(`http://localhost:8090/api/groups/modules/${moduleId}/all`);

            console.log('Groups response:', response.data);

            setGroups(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to load groups.'
            });
            setGroups([]);
        } finally {
            setLoading(false);
        }
    }, [moduleId]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleJoinGroup = async (groupId) => {
        setMessage({ type: '', text: '' });

        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Student ID not found. Please login again.' });
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8090/api/groups/${groupId}/join?studentId=${storedUser.id}`
            );

            setMessage({ type: 'success', text: response.data });
            await fetchGroups();
        } catch (error) {
            console.error('Join group failed:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to join group.'
            });
        }
    };

    const handleRequestLeadership = async (groupId) => {
        setMessage({ type: '', text: '' });

        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Student ID not found. Please login again.' });
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8090/api/groups/${groupId}/request-leader?studentId=${storedUser.id}`
            );

            setMessage({ type: 'success', text: response.data });
            await fetchGroups();
        } catch (error) {
            console.error('Leadership request failed:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to request leadership.'
            });
        }
    };

    const isStudentInGroup = (group) => {
        return Array.isArray(group.currentMembers) &&
            group.currentMembers.some((member) => member.id === storedUser?.id);
    };

    const memberCount = (group) => {
        return Array.isArray(group.currentMembers) ? group.currentMembers.length : 0;
    };

    const isGroupFull = (group) => {
        return memberCount(group) >= group.maxCapacity;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Module Groups</h1>
                        <p className="text-gray-500 mt-1">
                            View available groups and join one for this module.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

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
                    {loading ? (
                        <p className="text-gray-500">Loading groups...</p>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No groups found for this module yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groups.map((group) => {
                                const joined = isStudentInGroup(group);
                                const full = isGroupFull(group);

                                return (
                                    <div
                                        key={group.id}
                                        className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {group.groupName}
                                                </h2>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Members: {memberCount(group)} / {group.maxCapacity}
                                                </p>
                                            </div>

                                            {group.leader ? (
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                                    Leader Assigned
                                                </span>
                                            ) : group.requestedLeader ? (
                                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                                                    Leader Pending
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                                                    No Leader Yet
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                                Current Members
                                            </h3>

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

                                        <div className="mt-5 flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => handleJoinGroup(group.id)}
                                                disabled={joined || full}
                                                className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                                                    joined || full
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                            >
                                                {joined ? 'Already Joined' : full ? 'Group Full' : 'Join Group'}
                                            </button>

                                            <button
                                                onClick={() => handleRequestLeadership(group.id)}
                                                disabled={!joined || !!group.leader}
                                                className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                                                    !joined || !!group.leader
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-purple-600 hover:bg-purple-700'
                                                }`}
                                            >
                                                Request Leadership
                                            </button>

                                            {joined && (
                                                <button
                                                    onClick={() => navigate(`/groups/${group.id}/project`)}
                                                    className="px-4 py-2 rounded-lg font-semibold text-white transition bg-emerald-600 hover:bg-emerald-700"
                                                >
                                                    Open Project Board
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