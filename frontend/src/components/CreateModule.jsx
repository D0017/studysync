// Updated UI with a "lighter" aesthetic using your palette
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

    // Constants for your specific palette
    const colors = {
        primaryDark: '#0A0A0C',
        darkSecondary: '#1F1F23',
        primaryOrange: '#FF6A00',
        lightGray: '#F4F4F6',
        white: '#FFFFFF'
    };

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
        if (!moduleData.moduleCode.trim()) return 'Module code is required.';
        if (!moduleData.moduleName.trim()) return 'Module name is required.';
        if (!moduleData.enrollmentKey.trim()) return 'Enrollment key is required.';
        if (groupData.numberOfGroups <= 0) return 'Number of groups must be greater than 0.';
        if (groupData.maxCapacity <= 0) return 'Max capacity must be greater than 0.';
        return null;
    };

    const resetForm = () => {
        setModuleData({ moduleCode: '', moduleName: '', year: 1, semester: 1, enrollmentKey: '' });
        setGroupData({ numberOfGroups: 1, maxCapacity: 5 });
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
            const moduleResponse = await axios.post('http://localhost:8090/api/admin/modules', moduleData);
            const createdModule = moduleResponse.data;

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
            const errorMessage = error.response?.data || 'Something went wrong while creating module and groups.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        backgroundColor: colors.white,
        border: `1.5px solid #E2E8F0`, // Light border for a softer look
        borderRadius: '0.75rem',
        padding: '0.75rem',
        width: '100%',
        outline: 'none',
        transition: 'all 0.2s ease'
    };

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: colors.lightGray }}>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                    <header className="mb-10">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: colors.primaryDark }}>
                            Create <span style={{ color: colors.primaryOrange }}>Module</span>
                        </h1>
                        <p className="text-lg" style={{ color: colors.darkSecondary, opacity: 0.7 }}>
                            Configure your new academic module and automatically generate student groups.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Module Information Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider ml-1" style={{ color: colors.darkSecondary }}>Module Code</label>
                                <input
                                    type="text"
                                    name="moduleCode"
                                    value={moduleData.moduleCode}
                                    onChange={handleModuleChange}
                                    placeholder="e.g. IT3040"
                                    style={inputStyle}
                                    className="focus:border-orange-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider ml-1" style={{ color: colors.darkSecondary }}>Module Name</label>
                                <input
                                    type="text"
                                    name="moduleName"
                                    value={moduleData.moduleName}
                                    onChange={handleModuleChange}
                                    placeholder="e.g. Software Engineering"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider ml-1" style={{ color: colors.darkSecondary }}>Academic Year</label>
                                <input type="number" name="year" min="1" value={moduleData.year} onChange={handleModuleChange} style={inputStyle} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider ml-1" style={{ color: colors.darkSecondary }}>Semester</label>
                                <input type="number" name="semester" min="1" value={moduleData.semester} onChange={handleModuleChange} style={inputStyle} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider ml-1" style={{ color: colors.darkSecondary }}>Enrollment Key</label>
                                <input type="text" name="enrollmentKey" value={moduleData.enrollmentKey} onChange={handleModuleChange} placeholder="Key123" style={inputStyle} required />
                            </div>
                        </div>

                        {/* Group Settings Divider */}
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                            <div className="relative flex justify-start"><span className="bg-white pr-4 font-bold text-lg" style={{ color: colors.primaryDark }}>Group Allocation</span></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider ml-1" style={{ color: colors.darkSecondary }}>Number of Groups</label>
                                <input type="number" name="numberOfGroups" min="1" value={groupData.numberOfGroups} onChange={handleGroupChange} style={inputStyle} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider ml-1" style={{ color: colors.darkSecondary }}>Capacity per Group</label>
                                <input type="number" name="maxCapacity" min="1" value={groupData.maxCapacity} onChange={handleGroupChange} style={inputStyle} required />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl font-black text-white shadow-lg transition-all transform hover:-translate-y-1 active:scale-95"
                            style={{
                                backgroundColor: colors.primaryOrange,
                                opacity: loading ? 0.6 : 1,
                                boxShadow: `0 10px 15px -3px rgba(255, 106, 0, 0.3)`
                            }}
                        >
                            {loading ? 'Processing System Update...' : 'FINALIZE MODULE CREATION'}
                        </button>
                    </form>

                    {message.text && (
                        <div className={`mt-8 p-4 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateModule;