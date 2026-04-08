// Color Palette: Primary Dark #0A0A0C, Dark Secondary #1F1F23, Primary Orange #FF6A00, Light Gray #F4F4F6
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8090/api/users/all');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Could not load users. Please check if the backend is running.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:8090/api/users/${userId}/role`, newRole, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            await fetchUsers(); 
            alert("Role updated successfully!");
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update role. Ensure you are sending a valid Role enum string.");
        }
    };

    if (loading && users.length === 0) {
        return <div className="p-8 text-center" style={{color: '#1F1F23'}}>Loading users...</div>;
    }

    return (
        <div className="p-8 min-h-screen" style={{backgroundColor: '#F4F4F6'}}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold" style={{color: '#0A0A0C'}}>User Management</h1>
                <button 
                    onClick={fetchUsers}
                    className="text-white px-4 py-2 rounded shadow transition"
                    style={{backgroundColor: '#FF6A00'}}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E55A00'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6A00'}
                >
                    Refresh List
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="uppercase text-xs font-bold" style={{backgroundColor: '#F4F4F6', color: '#1F1F23'}}>
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">University ID</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Current Role</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{borderColor: '#FF6A00', borderOpacity: '0.2'}}>
                        {users.map(user => (
                            <tr key={user.id} style={{backgroundColor: 'white'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F5FF'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                <td className="px-6 py-4 font-medium" style={{color: '#0A0A0C'}}>{user.fullName}</td>
                                <td className="px-6 py-4 font-mono" style={{color: '#1F1F23'}}>{user.universityId}</td>
                                <td className="px-6 py-4" style={{color: '#1F1F23'}}>{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'LECTURER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        className="text-sm p-1 outline-none bg-white"
                                        style={{borderColor: '#FF6A00', borderWidth: '1px', color: '#0A0A0C'}}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        value={user.role}
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)'}
                                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="LECTURER">Lecturer</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-8 text-center" style={{color: '#1F1F23'}}>No users found in the system.</div>
                )}
            </div>
        </div>
    );
};

export default AdminUserManagement;