import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminModules = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchModules = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8090/api/admin/modules');
            setModules(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to load modules.'
            });
            setModules([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Module Management</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome, <span className="font-semibold">{storedUser?.fullName || 'Admin'}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            View all created modules and manage the academic structure.
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
                            onClick={() => navigate('/admin/create-module')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Create Module
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
                            <h2 className="text-2xl font-bold text-gray-800">Created Modules</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                All modules currently available in the system.
                            </p>
                        </div>

                        <button
                            onClick={fetchModules}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-gray-500">Loading modules...</p>
                    ) : modules.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No modules found yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modules.map((module) => (
                                <div
                                    key={module.id}
                                    className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {module.moduleCode}
                                            </h3>
                                            <p className="text-gray-700 mt-1">{module.moduleName}</p>
                                        </div>

                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                                            Year {module.year}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <p>
                                            <span className="font-semibold text-gray-700">Semester:</span> {module.semester}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-700">Enrollment Key:</span> {module.enrollmentKey}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-700">Module ID:</span> {module.id}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => navigate(`/admin/modules/${module.id}`)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                        >
                                            Manage Groups
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

export default AdminModules;