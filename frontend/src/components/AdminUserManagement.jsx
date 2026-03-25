import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const response = await axios.get('/api/users/all');
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Could not load users.')
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const getUserActiveStatus = (user) => {
        if (typeof user.active === 'boolean') return user.active;
        if (typeof user.isActive === 'boolean') return user.isActive;
        return false;
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`/api/users/${userId}/role`, newRole, {
                headers: { 'Content-Type': 'application/json' }
            });

            setMessage({ type: 'success', text: 'Role updated successfully.' });
            await fetchUsers();
        } catch (error) {
            console.error('Update role error:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to update role.')
            });
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await axios.put(`/api/users/${userId}/status`, {
                active: !currentStatus
            });

            setMessage({
                type: 'success',
                text: `User ${currentStatus ? 'deactivated' : 'activated'} successfully.`
            });

            await fetchUsers();
        } catch (error) {
            console.error('Update status error:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to update user status.')
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
                            User Management
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-slate-300">
                            View all registered users, update roles, and control account access.
                        </p>
                    </div>

                    <button
                        onClick={fetchUsers}
                        className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:from-blue-500 hover:to-cyan-400"
                    >
                        Refresh List
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

            {/* Loading */}
            {loading && users.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-8 text-center text-slate-300">
                    Loading users...
                </div>
            ) : (
                <>
                    {/* Stats strip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                            <p className="text-sm text-slate-300">Total Users</p>
                            <h3 className="mt-2 text-3xl font-black text-blue-400">
                                {users.length}
                            </h3>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                            <p className="text-sm text-slate-300">Active Accounts</p>
                            <h3 className="mt-2 text-3xl font-black text-green-400">
                                {users.filter((user) => getUserActiveStatus(user)).length}
                            </h3>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                            <p className="text-sm text-slate-300">Inactive Accounts</p>
                            <h3 className="mt-2 text-3xl font-black text-red-400">
                                {users.filter((user) => !getUserActiveStatus(user)).length}
                            </h3>
                        </div>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden xl:block rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-slate-300 uppercase text-xs tracking-wide">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">University ID</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Change Role</th>
                                        <th className="px-6 py-4">Account Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/10">
                                    {users.map((user) => {
                                        const active = getUserActiveStatus(user);

                                        return (
                                            <tr key={user.id} className="hover:bg-white/5 transition">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    {user.fullName}
                                                </td>

                                                <td className="px-6 py-4 text-slate-300 font-mono">
                                                    {user.universityId}
                                                </td>

                                                <td className="px-6 py-4 text-slate-300">
                                                    {user.email}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            user.role === 'ADMIN'
                                                                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/20'
                                                                : user.role === 'LECTURER'
                                                                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/20'
                                                                : 'bg-green-500/20 text-green-300 border border-green-400/20'
                                                        }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            active
                                                                ? 'bg-green-500/20 text-green-300 border border-green-400/20'
                                                                : 'bg-red-500/20 text-red-300 border border-red-400/20'
                                                        }`}
                                                    >
                                                        {active ? 'ACTIVE' : 'INACTIVE'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <select
                                                        className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-400"
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        value={user.role}
                                                    >
                                                        <option value="STUDENT">Student</option>
                                                        <option value="LECTURER">Lecturer</option>
                                                        <option value="ADMIN">Admin</option>
                                                    </select>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleStatusToggle(user.id, active)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition ${
                                                            active
                                                                ? 'bg-red-500 hover:bg-red-600'
                                                                : 'bg-green-600 hover:bg-green-700'
                                                        }`}
                                                    >
                                                        {active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {users.length === 0 && (
                            <div className="p-8 text-center text-slate-400">
                                No users found in the system.
                            </div>
                        )}
                    </div>

                    {/* Mobile / tablet cards */}
                    <div className="xl:hidden space-y-4">
                        {users.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-8 text-center text-slate-400">
                                No users found in the system.
                            </div>
                        ) : (
                            users.map((user) => {
                                const active = getUserActiveStatus(user);

                                return (
                                    <div
                                        key={user.id}
                                        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    {user.fullName}
                                                </h3>
                                                <p className="text-sm text-slate-300 mt-1">
                                                    {user.email}
                                                </p>
                                                <p className="text-sm text-slate-400 mt-1 font-mono">
                                                    {user.universityId}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 items-end">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        user.role === 'ADMIN'
                                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-400/20'
                                                            : user.role === 'LECTURER'
                                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-400/20'
                                                            : 'bg-green-500/20 text-green-300 border border-green-400/20'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        active
                                                            ? 'bg-green-500/20 text-green-300 border border-green-400/20'
                                                            : 'bg-red-500/20 text-red-300 border border-red-400/20'
                                                    }`}
                                                >
                                                    {active ? 'ACTIVE' : 'INACTIVE'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                                            <select
                                                className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-400"
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                value={user.role}
                                            >
                                                <option value="STUDENT">Student</option>
                                                <option value="LECTURER">Lecturer</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>

                                            <button
                                                onClick={() => handleStatusToggle(user.id, active)}
                                                className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                                                    active
                                                        ? 'bg-red-500 hover:bg-red-600'
                                                        : 'bg-green-600 hover:bg-green-700'
                                                }`}
                                            >
                                                {active ? 'Deactivate Account' : 'Activate Account'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUserManagement;