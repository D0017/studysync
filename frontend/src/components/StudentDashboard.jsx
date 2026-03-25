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

const StudentDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [enrollmentKey, setEnrollmentKey] = useState('');
    const [modules, setModules] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [loadingModules, setLoadingModules] = useState(true);
    const [joiningModule, setJoiningModule] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchStudentModules = useCallback(async () => {
        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Student ID not found. Please login again.' });
            setLoadingModules(false);
            return;
        }

        try {
            setLoadingModules(true);
            setMessage({ type: '', text: '' });

            const response = await axios.get(`/api/groups/modules/student/${storedUser.id}`);
            const enrolledModules = Array.isArray(response.data) ? response.data : [];
            setModules(enrolledModules);

            const groupResults = await Promise.all(
                enrolledModules.map(async (module) => {
                    try {
                        const groupsResponse = await axios.get(`/api/groups/modules/${module.id}/all`);
                        const groups = Array.isArray(groupsResponse.data) ? groupsResponse.data : [];

                        const myGroup = groups.find(
                            (group) =>
                                Array.isArray(group.currentMembers) &&
                                group.currentMembers.some((member) => member.id === storedUser.id)
                        );

                        if (!myGroup) return null;

                        return {
                            moduleId: module.id,
                            moduleCode: module.moduleCode,
                            moduleName: module.moduleName,
                            groupId: myGroup.id,
                            groupName: myGroup.groupName,
                            memberCount: Array.isArray(myGroup.currentMembers)
                                ? myGroup.currentMembers.length
                                : 0,
                            maxCapacity: myGroup.maxCapacity,
                            isLeader: myGroup.leader?.id === storedUser.id,
                            isLeadershipPending:
                                myGroup.requestedLeader?.id === storedUser.id &&
                                myGroup.leader?.id !== storedUser.id
                        };
                    } catch (error) {
                        console.error(`Failed to fetch groups for module ${module.id}:`, error);
                        return null;
                    }
                })
            );

            setJoinedGroups(groupResults.filter(Boolean));
        } catch (error) {
            console.error('Failed to fetch student modules:', error);
            setModules([]);
            setJoinedGroups([]);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to load enrolled modules.')
            });
        } finally {
            setLoadingModules(false);
        }
    }, [storedUser?.id]);

    useEffect(() => {
        fetchStudentModules();
    }, [fetchStudentModules]);

    const handleEnroll = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!enrollmentKey.trim()) {
            setMessage({ type: 'error', text: 'Please enter an enrollment key.' });
            return;
        }

        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Student ID not found. Please login again.' });
            return;
        }

        try {
            setJoiningModule(true);

            const response = await axios.post('/api/groups/modules/enroll', null, {
                params: {
                    studentId: storedUser.id,
                    enrollmentKey: enrollmentKey.trim()
                }
            });

            setMessage({ type: 'success', text: response.data });
            setEnrollmentKey('');
            await fetchStudentModules();
        } catch (error) {
            console.error('Enrollment failed:', error);
            setMessage({
                type: 'error',
                text: getErrorMessage(error, 'Failed to enroll in module.')
            });
        } finally {
            setJoiningModule(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const openModule = (moduleId) => {
        navigate(`/student/modules/${moduleId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome back, <span className="font-semibold">{storedUser?.fullName}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            University ID: {storedUser?.universityId}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Home
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
                        <p className="text-sm font-medium text-gray-500">Enrolled Modules</p>
                        <h2 className="text-3xl font-bold text-blue-600 mt-2">{modules.length}</h2>
                        <p className="text-sm text-gray-500 mt-2">Modules you can access right now</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
                        <p className="text-sm font-medium text-gray-500">Joined Groups</p>
                        <h2 className="text-3xl font-bold text-green-600 mt-2">{joinedGroups.length}</h2>
                        <p className="text-sm text-gray-500 mt-2">Groups you currently belong to</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
                        <p className="text-sm font-medium text-gray-500">Leadership Requests</p>
                        <h2 className="text-3xl font-bold text-yellow-500 mt-2">
                            {joinedGroups.filter((group) => group.isLeadershipPending).length}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">Pending leadership approvals</p>
                    </div>
                </div>

                {/* Message */}
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

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Join Module */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Module</h2>
                            <p className="text-gray-500 mb-4">
                                Enter the enrollment key shared for your module.
                            </p>

                            <form onSubmit={handleEnroll} className="space-y-4">
                                <input
                                    type="text"
                                    value={enrollmentKey}
                                    onChange={(e) => setEnrollmentKey(e.target.value)}
                                    placeholder="Enter enrollment key"
                                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <button
                                    type="submit"
                                    disabled={joiningModule}
                                    className={`w-full font-bold px-6 py-3 rounded-lg transition ${
                                        joiningModule
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    {joiningModule ? 'Enrolling...' : 'Enroll'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Group status */}
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Group Status</h2>
                            <p className="text-gray-500 mb-6">
                                These are the groups you have already joined in your enrolled modules.
                            </p>

                            {loadingModules ? (
                                <p className="text-gray-500">Loading group status...</p>
                            ) : joinedGroups.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    You have not joined any groups yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {joinedGroups.map((group) => (
                                        <div
                                            key={`${group.moduleId}-${group.groupId}`}
                                            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {group.moduleCode}
                                                    </h3>
                                                    <p className="text-gray-700 mt-1">{group.moduleName}</p>
                                                </div>

                                                {group.isLeader ? (
                                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                                        Leader
                                                    </span>
                                                ) : group.isLeadershipPending ? (
                                                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                                                        Pending
                                                    </span>
                                                ) : (
                                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                                                        Member
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-500 mt-3">
                                                <span className="font-semibold text-gray-700">Group:</span> {group.groupName}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                <span className="font-semibold text-gray-700">Members:</span> {group.memberCount} / {group.maxCapacity}
                                            </p>

                                            <button
                                                onClick={() => openModule(group.moduleId)}
                                                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                            >
                                                Open Module
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* My modules */}
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">My Modules</h2>
                                    <p className="text-gray-500">
                                        These are the modules you have enrolled in.
                                    </p>
                                </div>

                                <button
                                    onClick={fetchStudentModules}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                                >
                                    Refresh
                                </button>
                            </div>

                            {loadingModules ? (
                                <p className="text-gray-500">Loading modules...</p>
                            ) : modules.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    You have not enrolled in any modules yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {modules.map((module) => {
                                        const relatedGroup = joinedGroups.find(
                                            (group) => group.moduleId === module.id
                                        );

                                        return (
                                            <div
                                                key={module.id}
                                                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-gray-50"
                                            >
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {module.moduleCode}
                                                </h3>
                                                <p className="text-gray-700 mt-1">{module.moduleName}</p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Year {module.year} • Semester {module.semester}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    <span className="font-semibold text-gray-700">Group Status:</span>{' '}
                                                    {relatedGroup ? relatedGroup.groupName : 'Not joined yet'}
                                                </p>

                                                <button
                                                    onClick={() => openModule(module.id)}
                                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                                >
                                                    Open Module
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;