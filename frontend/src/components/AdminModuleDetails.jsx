import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
};

const AdminModuleDetails = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();

    const [moduleData, setModuleData] = useState(null);
    const [groups, setGroups] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningLecturer, setAssigningLecturer] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [selectedLecturerId, setSelectedLecturerId] = useState('');
    const [groupForm, setGroupForm] = useState({
        numberOfGroups: 1,
        maxCapacity: 5
    });

    const fetchPageData = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const [moduleRes, groupsRes, lecturersRes] = await Promise.all([
                axios.get(`/api/admin/modules/${moduleId}`),
                axios.get(`/api/groups/modules/${moduleId}/all`),
                axios.get('/api/admin/lecturers')
            ]);

            const module = moduleRes.data;

            setModuleData(module);
            setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
            setLecturers(Array.isArray(lecturersRes.data) ? lecturersRes.data : []);
            setSelectedLecturerId(module?.lecturer?.id ? String(module.lecturer.id) : '');
        } catch (error) {
            console.error('Failed to load module details:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load module details.')
            });
            setGroups([]);
            setLecturers([]);
            setModuleData(null);
        } finally {
            setLoading(false);
        }
    }, [moduleId]);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const handleGroupFormChange = (e) => {
        const { name, value } = e.target;
        setGroupForm((prev) => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleCreateMoreGroups = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (groupForm.numberOfGroups <= 0) {
            setMessage({ type: 'error', text: 'Number of groups must be greater than 0.' });
            return;
        }

        if (groupForm.maxCapacity <= 0) {
            setMessage({ type: 'error', text: 'Max capacity must be greater than 0.' });
            return;
        }

        try {
            const response = await axios.post(
                `/api/admin/modules/${moduleId}/groups`,
                groupForm
            );

            setMessage({ type: 'success', text: response.data });
            setGroupForm({ numberOfGroups: 1, maxCapacity: 5 });
            await fetchPageData();
        } catch (error) {
            console.error('Failed to create more groups:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to create additional groups.')
            });
        }
    };

    const handleAssignLecturer = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            setAssigningLecturer(true);

            const response = await axios.put(
                `/api/admin/modules/${moduleId}/lecturer`,
                {
                    lecturerId: selectedLecturerId ? Number(selectedLecturerId) : null
                }
            );

            const updatedModule = response.data;
            setModuleData(updatedModule);
            setSelectedLecturerId(updatedModule?.lecturer?.id ? String(updatedModule.lecturer.id) : '');

            setMessage({
                type: 'success',
                text: updatedModule?.lecturer
                    ? `Lecturer assigned successfully to ${updatedModule.moduleCode}.`
                    : `Lecturer removed successfully from ${updatedModule.moduleCode}.`
            });
        } catch (error) {
            console.error('Failed to assign lecturer:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to assign lecturer.')
            });
        } finally {
            setAssigningLecturer(false);
        }
    };

    const memberCount = (group) => {
        return Array.isArray(group.currentMembers) ? group.currentMembers.length : 0;
    };

    return (
        <div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 md:p-7 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-semibold">
                            Admin Management
                        </p>
                        <h2 className="mt-2 text-2xl md:text-3xl font-black text-white">
                            {moduleData ? `${moduleData.moduleCode} - ${moduleData.moduleName}` : 'Module Details'}
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-slate-300">
                            Assign one lecturer to this module and manage its group structure.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/admin/modules')}
                            className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            Back to Modules
                        </button>

                        <button
                            onClick={fetchPageData}
                            className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:from-blue-500 hover:to-cyan-400"
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

            {moduleData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                        <p className="text-sm text-slate-300">Module Code</p>
                        <h3 className="mt-2 text-2xl font-black text-cyan-300">
                            {moduleData.moduleCode}
                        </h3>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                        <p className="text-sm text-slate-300">Semester</p>
                        <h3 className="mt-2 text-2xl font-black text-emerald-400">
                            {moduleData.semester}
                        </h3>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
                        <p className="text-sm text-slate-300">Assigned Lecturer</p>
                        <h3 className="mt-2 text-lg font-black text-white">
                            {moduleData.lecturer ? moduleData.lecturer.fullName : 'Not assigned'}
                        </h3>
                    </div>
                </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Assign Lecturer</h3>
                <p className="text-sm text-slate-400 mb-6">
                    One lecturer can be assigned to this module. You can also change or remove the assignment later.
                </p>

                <form
                    onSubmit={handleAssignLecturer}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4"
                >
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                            Select Lecturer
                        </label>
                        <select
                            value={selectedLecturerId}
                            onChange={(e) => setSelectedLecturerId(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                            <option value="">-- No Lecturer Assigned --</option>
                            {lecturers.map((lecturer) => (
                                <option key={lecturer.id} value={lecturer.id}>
                                    {lecturer.fullName} ({lecturer.universityId})
                                </option>
                            ))}
                        </select>

                        {moduleData?.lecturer && (
                            <p className="mt-3 text-sm text-slate-300">
                                Current: <span className="font-semibold text-white">{moduleData.lecturer.fullName}</span>{' '}
                                ({moduleData.lecturer.email})
                            </p>
                        )}
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={assigningLecturer}
                            className={`w-full md:w-auto rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg transition ${
                                assigningLecturer
                                    ? 'bg-slate-600 cursor-not-allowed'
                                    : 'bg-linear-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400'
                            }`}
                        >
                            {assigningLecturer ? 'Saving...' : 'Save Lecturer'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Create More Groups</h3>
                <p className="text-sm text-slate-400 mb-6">
                    Add additional empty groups to this module whenever needed.
                </p>

                <form
                    onSubmit={handleCreateMoreGroups}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                            Number of Groups
                        </label>
                        <input
                            type="number"
                            name="numberOfGroups"
                            min="1"
                            value={groupForm.numberOfGroups}
                            onChange={handleGroupFormChange}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                            Max Capacity
                        </label>
                        <input
                            type="number"
                            name="maxCapacity"
                            min="1"
                            value={groupForm.maxCapacity}
                            onChange={handleGroupFormChange}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                            required
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-blue-500 hover:to-cyan-400"
                        >
                            Add Groups
                        </button>
                    </div>
                </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">Existing Groups</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Current groups created under this module.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center text-slate-300">
                        Loading groups...
                    </div>
                ) : groups.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center text-slate-400">
                        No groups found for this module yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl"
                            >
                                <div className="h-2 bg-linear-to-r from-emerald-500 to-cyan-500" />

                                <div className="p-6">
                                    <div className="flex justify-between items-start gap-3">
                                        <div>
                                            <h4 className="text-xl font-bold text-white">
                                                {group.groupName}
                                            </h4>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Members: {memberCount(group)} / {group.maxCapacity}
                                            </p>
                                        </div>

                                        {group.leader ? (
                                            <span className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
                                                Leader Assigned
                                            </span>
                                        ) : group.requestedLeader ? (
                                            <span className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                                                Leader Pending
                                            </span>
                                        ) : (
                                            <span className="rounded-full border border-slate-400/20 bg-slate-500/10 px-3 py-1 text-xs font-bold text-slate-300">
                                                No Leader
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="text-sm font-semibold text-white mb-3">
                                            Current Members
                                        </h5>

                                        {Array.isArray(group.currentMembers) &&
                                        group.currentMembers.length > 0 ? (
                                            <ul className="space-y-2">
                                                {group.currentMembers.map((member) => (
                                                    <li
                                                        key={member.id}
                                                        className="rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-200"
                                                    >
                                                        {member.fullName} ({member.universityId})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-400">No members yet.</p>
                                        )}
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                                        {group.leader && (
                                            <p>
                                                <span className="font-semibold text-white">Leader:</span>{' '}
                                                {group.leader.fullName} ({group.leader.universityId})
                                            </p>
                                        )}

                                        {group.requestedLeader && !group.leader && (
                                            <p>
                                                <span className="font-semibold text-white">Pending Request:</span>{' '}
                                                {group.requestedLeader.fullName} ({group.requestedLeader.universityId})
                                            </p>
                                        )}
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

export default AdminModuleDetails;