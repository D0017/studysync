import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const AdminModules = () => {
    const navigate = useNavigate();

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchModules = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const response = await axios.get('/api/admin/modules');
            setModules(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load modules.')
            });
            setModules([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    return (
        <div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 md:p-7 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                            Admin Management
                        </p>
                        <h2 className="mt-2 text-2xl md:text-3xl font-black text-white">
                            Module Management
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-slate-300">
                            View created modules, inspect groups, and assign lecturers.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/admin/create-module')}
                            className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:from-blue-500 hover:to-cyan-400"
                        >
                            Create Module
                        </button>

                        <button
                            onClick={fetchModules}
                            className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                    <p className="text-sm text-slate-300">Total Modules</p>
                    <h3 className="mt-2 text-3xl font-black text-emerald-400">
                        {loading ? '...' : modules.length}
                    </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                    <p className="text-sm text-slate-300">Lecturer Assigned</p>
                    <h3 className="mt-2 text-3xl font-black text-cyan-300">
                        {loading ? '...' : modules.filter((m) => m.lecturer).length}
                    </h3>
                </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">Created Modules</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        All modules currently available in the system.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center text-slate-300">
                        Loading modules...
                    </div>
                ) : modules.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center text-slate-400">
                        No modules found yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl"
                            >
                                <div className="h-2 bg-linear-to-r from-emerald-500 to-cyan-500" />

                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-xl font-bold text-white">
                                                {module.moduleCode}
                                            </h4>
                                            <p className="mt-1 text-slate-300">
                                                {module.moduleName}
                                            </p>
                                        </div>

                                        <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                                            Year {module.year}
                                        </span>
                                    </div>

                                    <div className="mt-5 space-y-3 text-sm text-slate-300">
                                        <p>
                                            <span className="font-semibold text-white">Semester:</span>{' '}
                                            {module.semester}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white">Enrollment Key:</span>{' '}
                                            {module.enrollmentKey}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white">Assigned Lecturer:</span>{' '}
                                            {module.lecturer
                                                ? `${module.lecturer.fullName} (${module.lecturer.universityId})`
                                                : 'Not assigned'}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => navigate(`/admin/modules/${module.id}`)}
                                            className="rounded-2xl bg-linear-to-r from-green-600 to-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-green-500 hover:to-emerald-400"
                                        >
                                            Manage Module
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

export default AdminModules;