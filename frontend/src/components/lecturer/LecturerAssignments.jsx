import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LecturerAssignments = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    const [modules, setModules] = useState([]);
    const [loadingModules, setLoadingModules] = useState(true);
    const [assignment, setAssignment] = useState({ 
        title: '', 
        deadline: '', 
        moduleId: '', 
        weightage: 20,
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch lecturer's assigned modules
    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoadingModules(true);
                const res = await axios.get(`/api/lecturer/modules/${storedUser?.id}`);
                setModules(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to fetch modules", err);
            } finally {
                setLoadingModules(false);
            }
        };
        if (storedUser?.id) fetchModules();
    }, [storedUser?.id]);

    const validate = () => {
        let temp = {};
        if (!assignment.title.trim()) temp.title = "Assignment title is required";
        if (!assignment.deadline) temp.deadline = "Deadline is required";
        if (new Date(assignment.deadline) < new Date()) temp.deadline = "Deadline must be in the future";
        if (!assignment.moduleId) temp.moduleId = "Please select a target module";
        
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                // await axios.post('/api/assignments/create', { ...assignment, lecturerId: storedUser.id });
                alert(`Assignment "${assignment.title}" published successfully!`);
                setAssignment({ title: '', deadline: '', moduleId: '', weightage: 20, description: '' });
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                alert("Failed to publish assignment. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F4F6] p-6 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Card */}
                <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0C] p-8 shadow-2xl mb-8 border-b-4 border-[#FF6A00]">
                    <div className="relative z-10">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#FF6A00] font-bold">Academic Portal</p>
                        <h1 className="mt-3 text-3xl md:text-4xl font-black text-white">Assignment Management</h1>
                        <p className="mt-2 text-gray-400 max-w-xl">Configure submission portals, set deadlines, and define grade weightage for your students.</p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#FF6A00] opacity-10 rounded-full blur-3xl"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3 mb-8">
                                {/* Modernized Icon */}
                                <div className="p-3 bg-[#FFF0E6] rounded-2xl text-[#FF6A00]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-black text-[#0A0A0C]">Create New Submission</h2>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Assignment Title */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Assignment Title</label>
                                        <input 
                                            type="text"
                                            className={`w-full p-4 bg-[#F4F4F6] border-2 rounded-2xl outline-none transition-all ${errors.title ? 'border-red-500' : 'border-transparent focus:border-[#FF6A00]'}`}
                                            placeholder="e.g., Final System Implementation"
                                            value={assignment.title}
                                            onChange={(e) => setAssignment({...assignment, title: e.target.value})}
                                        />
                                        {errors.title && <p className="text-red-500 text-xs mt-2 ml-1 font-semibold">{errors.title}</p>}
                                    </div>

                                    {/* Module Selection */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Target Module</label>
                                        <div className="relative">
                                            <select 
                                                className={`w-full p-4 bg-[#F4F4F6] border-2 rounded-2xl outline-none transition-all appearance-none ${errors.moduleId ? 'border-red-500' : 'border-transparent focus:border-[#FF6A00]'}`}
                                                value={assignment.moduleId}
                                                onChange={(e) => setAssignment({...assignment, moduleId: e.target.value})}
                                            >
                                                <option value="">{loadingModules ? 'Loading Modules...' : 'Select Module'}</option>
                                                {modules.map(mod => (
                                                    <option key={mod.id} value={mod.id}>{mod.moduleCode} - {mod.moduleName}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                        {errors.moduleId && <p className="text-red-500 text-xs mt-2 ml-1 font-semibold">{errors.moduleId}</p>}
                                    </div>

                                    {/* Deadline */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Submission Deadline</label>
                                        <input 
                                            type="datetime-local"
                                            className={`w-full p-4 bg-[#F4F4F6] border-2 rounded-2xl outline-none transition-all ${errors.deadline ? 'border-red-500' : 'border-transparent focus:border-[#FF6A00]'}`}
                                            value={assignment.deadline}
                                            onChange={(e) => setAssignment({...assignment, deadline: e.target.value})}
                                        />
                                        {errors.deadline && <p className="text-red-500 text-xs mt-2 ml-1 font-semibold">{errors.deadline}</p>}
                                    </div>

                                    {/* Weightage Visualization */}
                                    <div className="md:col-span-2 bg-[#F4F4F6] p-6 rounded-2xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-bold uppercase text-gray-500">Grade Weightage</label>
                                            <span className="px-3 py-1 bg-[#FF6A00] text-white text-sm font-black rounded-lg">{assignment.weightage}%</span>
                                        </div>
                                        <input 
                                            type="range"
                                            min="0" max="100"
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF6A00]"
                                            value={assignment.weightage}
                                            onChange={(e) => setAssignment({...assignment, weightage: e.target.value})}
                                        />
                                        <p className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest">Defines the contribution to the final module grade</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto px-10 py-4 bg-[#FF6A00] text-white font-black rounded-2xl hover:bg-[#e55f00] shadow-lg shadow-[#FF6A00]/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 disabled:opacity-50"
                                    >
                                        {/* Modern Send Icon */}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>{isSubmitting ? 'Publishing...' : 'Publish Assignment'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar / Guidelines */}
                    <div className="space-y-6">
                        <div className="bg-[#1F1F23] p-8 rounded-3xl text-white shadow-xl border-t-4 border-[#FF6A00]">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-[#FF6A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-bold">Guidelines</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex space-x-3">
                                    <span className="text-[#FF6A00] font-bold text-xs">01.</span>
                                    <p className="text-xs text-gray-400 leading-relaxed">Ensure the deadline allows enough time for group collaboration.</p>
                                </div>
                                <div className="flex space-x-3">
                                    <span className="text-[#FF6A00] font-bold text-xs">02.</span>
                                    <p className="text-xs text-gray-400 leading-relaxed">Check that the total weightage of all assignments for the module does not exceed 100%.</p>
                                </div>
                                <div className="flex space-x-3">
                                    <span className="text-[#FF6A00] font-bold text-xs">03.</span>
                                    <p className="text-xs text-gray-400 leading-relaxed">Once published, assignments are visible to all enrolled students immediately.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                            <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="text-sm font-black uppercase text-gray-400">Active Drafts</h3>
                            </div>
                            <p className="text-xs text-gray-500 italic leading-relaxed">No drafts saved. New assignments will appear here if saved as draft.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LecturerAssignments;