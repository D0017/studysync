import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LeadershipRequests = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8090/api/admin/leadership-requests');
            setRequests(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch leadership requests:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to load leadership requests.'
            });
            setRequests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleApprove = async (groupId) => {
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post(
                `http://localhost:8090/api/admin/leadership-requests/${groupId}/approve`
            );

            setMessage({ type: 'success', text: response.data });
            await fetchRequests();
        } catch (error) {
            console.error('Approval failed:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to approve leadership request.'
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Leadership Requests</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome, <span className="font-semibold">{storedUser?.fullName || 'Admin'}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Review and approve pending student leadership requests.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/admin-dashboard')}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Back to Dashboard
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

                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Pending Requests</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Approve students who requested to become group leaders.
                            </p>
                        </div>

                        <button
                            onClick={fetchRequests}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-gray-500">Loading leadership requests...</p>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No pending leadership requests found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {requests.map((request) => (
                                <div
                                    key={request.groupId}
                                    className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                                >
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {request.groupName}
                                    </h3>

                                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                                        <p>
                                            <span className="font-semibold">Module:</span>{' '}
                                            {request.moduleCode} - {request.moduleName}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Requested Student:</span>{' '}
                                            {request.requesterName}
                                        </p>
                                        <p>
                                            <span className="font-semibold">University ID:</span>{' '}
                                            {request.requesterUniversityId}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Members:</span>{' '}
                                            {request.currentMemberCount} / {request.maxCapacity}
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            onClick={() => handleApprove(request.groupId)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                                        >
                                            Approve as Leader
                                        </button>
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

export default LeadershipRequests;