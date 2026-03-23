import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AdminModuleDetails = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [groupForm, setGroupForm] = useState({
        numberOfGroups: 1,
        maxCapacity: 5
    });

    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8090/api/groups/modules/${moduleId}/all`);
            setGroups(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch module groups:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to load groups for this module.'
            });
            setGroups([]);
        } finally {
            setLoading(false);
        }
    }, [moduleId]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleGroupFormChange = (e) => {
        const { name, value } = e.target;
        setGroupForm((prev) => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleCreateMoreGroups = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (groupForm.numberOfGroups <= 0) {
            setMessage({ type: 'error', text: 'Number of groups must be greater than 0.' });
            return;
        }

        if (groupForm.maxCapacity <= 0) {
            setMessage({ type: 'error', text: 'Max capacity must be greater than 0.' });
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8090/api/admin/modules/${moduleId}/groups`,
                groupForm
            );

            setMessage({ type: 'success', text: response.data });
            setGroupForm({ numberOfGroups: 1, maxCapacity: 5 });
            await fetchGroups();
        } catch (error) {
            console.error('Failed to create more groups:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to create additional groups.'
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const memberCount = (group) => {
        return Array.isArray(group.currentMembers) ? group.currentMembers.length : 0;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Module Details</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome, <span className="font-semibold">{storedUser?.fullName || 'Admin'}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Manage groups for this module and monitor current group status.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/admin/modules')}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Back to Modules
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
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

                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Create More Groups</h2>
                    <p className="text-gray-500 mb-6">
                        Add additional empty groups to this module whenever needed.
                    </p>

                    <form onSubmit={handleCreateMoreGroups} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Number of Groups
                            </label>
                            <input
                                type="number"
                                name="numberOfGroups"
                                min="1"
                                value={groupForm.numberOfGroups}
                                onChange={handleGroupFormChange}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Max Capacity
                            </label>
                            <input
                                type="number"
                                name="maxCapacity"
                                min="1"
                                value={groupForm.maxCapacity}
                                onChange={handleGroupFormChange}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                            >
                                Add Groups
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Existing Groups</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Current groups created under this module.
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
                            {groups.map((group) => (
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
                                                No Leader
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                            Current Members
                                        </h4>

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
                                                <span className="font-semibold text-gray-700">Pending Request:</span>{' '}
                                                {group.requestedLeader.fullName} ({group.requestedLeader.universityId})
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminModuleDetails;