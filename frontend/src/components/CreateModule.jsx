import React, { useState } from 'react';
import axios from 'axios';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const CreateModule = () => {
    const [moduleData, setModuleData] = useState({
        moduleCode: '',
        moduleName: '',
        year: 1,
        semester: 1,
        enrollmentKey: ''
    });

    const [groupData, setGroupData] = useState({
        numberOfGroups: 1,
        maxCapacity: 5
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleModuleChange = (e) => {
        const { name, value } = e.target;
        setModuleData((prev) => ({
            ...prev,
            [name]: name === 'year' || name === 'semester' ? Number(value) : value
        }));
    };

    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prev) => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const validateForm = () => {
        if (!moduleData.moduleCode.trim()) {
            return 'Module code is required.';
        }

        if (!moduleData.moduleName.trim()) {
            return 'Module name is required.';
        }

        if (!moduleData.enrollmentKey.trim()) {
            return 'Enrollment key is required.';
        }

        if (moduleData.year <= 0) {
            return 'Year must be greater than 0.';
        }

        if (moduleData.semester <= 0) {
            return 'Semester must be greater than 0.';
        }

        if (groupData.numberOfGroups <= 0) {
            return 'Number of groups must be greater than 0.';
        }

        if (groupData.maxCapacity <= 0) {
            return 'Max capacity must be greater than 0.';
        }

        return null;
    };

    const resetForm = () => {
        setModuleData({
            moduleCode: '',
            moduleName: '',
            year: 1,
            semester: 1,
            enrollmentKey: ''
        });

        setGroupData({
            numberOfGroups: 1,
            maxCapacity: 5
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const validationError = validateForm();
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            return;
        }

        try {
            setLoading(true);

            const moduleResponse = await axios.post('/api/admin/modules', moduleData);
            const createdModule = moduleResponse.data;

            const groupsResponse = await axios.post(
                `/api/admin/modules/${createdModule.id}/groups`,
                groupData
            );

            setMessage({
                type: 'success',
                text: `${createdModule.moduleCode} created successfully. ${groupsResponse.data}`
            });

            resetForm();
        } catch (error) {
            console.error('Create module/groups failed:', error);

            setMessage({
                type: 'error',
                text: getErrorMessage(
                    error,
                    'Something went wrong while creating module and groups.'
                )
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 md:p-7 mb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                    Admin Management
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-black text-white">
                    Create Module
                </h2>
                <p className="mt-2 text-sm md:text-base text-slate-300">
                    Create a module first, then generate empty groups for students to join.
                </p>
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

            {/* Form */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Module Details */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Module Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                    Module Code
                                </label>
                                <input
                                    type="text"
                                    name="moduleCode"
                                    value={moduleData.moduleCode}
                                    onChange={handleModuleChange}
                                    placeholder="e.g. IT3040"
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                    Module Name
                                </label>
                                <input
                                    type="text"
                                    name="moduleName"
                                    value={moduleData.moduleName}
                                    onChange={handleModuleChange}
                                    placeholder="e.g. Software Engineering"
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                    Year
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    min="1"
                                    value={moduleData.year}
                                    onChange={handleModuleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                    Semester
                                </label>
                                <input
                                    type="number"
                                    name="semester"
                                    min="1"
                                    value={moduleData.semester}
                                    onChange={handleModuleChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                    Enrollment Key
                                </label>
                                <input
                                    type="text"
                                    name="enrollmentKey"
                                    value={moduleData.enrollmentKey}
                                    onChange={handleModuleChange}
                                    placeholder="e.g. MATH2026"
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Group Settings */}
                    <div className="border-t border-white/10 pt-8">
                        <h3 className="text-lg font-bold text-white mb-4">Group Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                    Number of Groups
                                </label>
                                <input
                                    type="number"
                                    name="numberOfGroups"
                                    min="1"
                                    value={groupData.numberOfGroups}
                                    onChange={handleGroupChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                    Max Capacity Per Group
                                </label>
                                <input
                                    type="number"
                                    name="maxCapacity"
                                    min="1"
                                    value={groupData.maxCapacity}
                                    onChange={handleGroupChange}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400'
                            }`}
                        >
                            {loading ? 'Creating...' : 'Create Module & Groups'}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={loading}
                            className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateModule;