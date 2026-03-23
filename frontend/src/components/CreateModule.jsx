import React, { useState } from 'react';
import axios from 'axios';

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

            // Create module
            const moduleResponse = await axios.post('http://localhost:8090/api/admin/modules', moduleData);
            const createdModule = moduleResponse.data;

            // Create groups for modules
            const groupsResponse = await axios.post(
                `http://localhost:8090/api/admin/modules/${createdModule.id}/groups`,
                groupData
            );

            setMessage({
                type: 'success',
                text: `${createdModule.moduleCode} created successfully. ${groupsResponse.data}`
            });

            resetForm();
        } catch (error) {
            console.error('Create module/groups failed:', error);

            const errorMessage =
                error.response?.data ||
                'Something went wrong while creating module and groups.';

            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Module</h1>
                <p className="text-gray-500 mb-8">
                    Create a module first, then generate empty groups for students to join.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Module Code
                            </label>
                            <input
                                type="text"
                                name="moduleCode"
                                value={moduleData.moduleCode}
                                onChange={handleModuleChange}
                                placeholder="e.g. IT3040"
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Module Name
                            </label>
                            <input
                                type="text"
                                name="moduleName"
                                value={moduleData.moduleName}
                                onChange={handleModuleChange}
                                placeholder="e.g. Software Engineering"
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Year
                            </label>
                            <input
                                type="number"
                                name="year"
                                min="1"
                                value={moduleData.year}
                                onChange={handleModuleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Semester
                            </label>
                            <input
                                type="number"
                                name="semester"
                                min="1"
                                value={moduleData.semester}
                                onChange={handleModuleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Enrollment Key
                            </label>
                            <input
                                type="text"
                                name="enrollmentKey"
                                value={moduleData.enrollmentKey}
                                onChange={handleModuleChange}
                                placeholder="e.g. MATH2026"
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Group Settings</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Number of Groups
                                </label>
                                <input
                                    type="number"
                                    name="numberOfGroups"
                                    min="1"
                                    value={groupData.numberOfGroups}
                                    onChange={handleGroupChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Max Capacity Per Group
                                </label>
                                <input
                                    type="number"
                                    name="maxCapacity"
                                    min="1"
                                    value={groupData.maxCapacity}
                                    onChange={handleGroupChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition ${
                            loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Creating...' : 'Create Module & Groups'}
                    </button>
                </form>

                {message.text && (
                    <div
                        className={`mt-6 p-4 rounded-lg text-sm font-medium ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateModule;