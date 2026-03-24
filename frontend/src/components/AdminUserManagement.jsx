import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8090/api/users/all');
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Could not load users. Please check if the backend is running.');
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
            await axios.put(`http://localhost:8090/api/users/${userId}/role`, newRole, {
                headers: { 'Content-Type': 'application/json' }
            });

            await fetchUsers();
            alert('Role updated successfully!');
        } catch (err) {
            console.error('Update role error:', err);
            alert(err.response?.data || 'Failed to update role.');
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await axios.put(`http://localhost:8090/api/users/${userId}/status`, {
                active: !currentStatus
            });

            await fetchUsers();
            alert(`User ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
        } catch (err) {
            console.error('Update status error:', err);
            alert(err.response?.data || 'Failed to update user status.');
        }
    };

    if (loading && users.length === 0) {
        return <div className="p-8 text-center">Loading users...</div>;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button
                    onClick={fetchUsers}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    Refresh List
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">University ID</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Current Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Change Role</th>
                            <th className="px-6 py-4">Account Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => {
                            const active = getUserActiveStatus(user);

                            return (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{user.fullName}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono">{user.universityId}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${
                                                user.role === 'ADMIN'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : user.role === 'LECTURER'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${
                                                active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <select
                                            className="text-sm border rounded p-1 outline-none bg-white focus:ring-2 focus:ring-blue-500"
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
                                            className={`px-3 py-2 rounded text-sm font-semibold text-white transition ${
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

                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No users found in the system.</div>
                )}
            </div>
        </div>
    );
};

export default AdminUserManagement;