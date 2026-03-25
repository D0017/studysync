import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const LeadershipRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const response = await axios.get('/api/admin/leadership-requests');
            setRequests(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch leadership requests:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load leadership requests.')
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
                `/api/admin/leadership-requests/${groupId}/approve`
            );

            setMessage({ type: 'success', text: response.data });
            await fetchRequests();
        } catch (error) {
            console.error('Approval failed:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to approve leadership request.')
            });
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 md:p-7 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                            Admin Management
                        </p>
                        <h2 className="mt-2 text-2xl md:text-3xl font-black text-white">
                            Leadership Requests
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-slate-300">
                            Review and approve students who requested to become group leaders.
                        </p>
                    </div>

                    <button
                        onClick={fetchRequests}
                        className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:from-blue-500 hover:to-cyan-400"
                    >
                        Refresh Requests
                    </button>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div
                    className={`mb-6 rounded-2xl border p-4 text-sm font-medium ${
                        message.type === 'success'
                            ? 'border-green-400/20 bg-green-500/10 text-green-300'
                            : 'border-red-400/20 bg-red-500/10 text-red-300'
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                    <p className="text-sm text-slate-300">Pending Requests</p>
                    <h3 className="mt-2 text-3xl font-black text-amber-400">
                        {loading ? '...' : requests.length}
                    </h3>
                </div>

             {/*}   <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                    <p className="text-sm text-slate-300">Action Needed</p>
                    <h3 className="mt-2 text-3xl font-black text-blue-400">
                        {loading ? '...' : requests.length > 0 ? 'Yes' : 'No'}
                    </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                    <p className="text-sm text-slate-300">Status</p>
                    <h3 className="mt-2 text-3xl font-black text-emerald-400">
                        {loading ? '...' : 'Ready'}
                    </h3>
                </div>*/}
            </div>  

            {/* Content */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">Pending Approvals</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Approve the student who should officially become the leader of the group.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center text-slate-300">
                        Loading leadership requests...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center text-slate-400">
                        No pending leadership requests found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {requests.map((request) => (
                            <div
                                key={request.groupId}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl"
                            >
                                <div className="h-2 bg-linear-to-r from-amber-500 to-orange-500" />

                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-white">
                                                {request.groupName}
                                            </h4>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Group leadership request
                                            </p>
                                        </div>

                                        <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                                            Pending
                                        </span>
                                    </div>

                                    <div className="mt-5 space-y-3 text-sm text-slate-300">
                                        <p>
                                            <span className="font-semibold text-white">Module:</span>{' '}
                                            {request.moduleCode} - {request.moduleName}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white">Requested Student:</span>{' '}
                                            {request.requesterName}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white">University ID:</span>{' '}
                                            {request.requesterUniversityId}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white">Members:</span>{' '}
                                            {request.currentMemberCount} / {request.maxCapacity}
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            onClick={() => handleApprove(request.groupId)}
                                            className="w-full rounded-2xl bg-linear-to-r from-green-600 to-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-green-500 hover:to-emerald-400"
                                        >
                                            Approve as Leader
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadershipRequests;