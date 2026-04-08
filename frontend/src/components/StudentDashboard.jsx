// Color Palette: Primary Dark #0A0A0C, Dark Secondary #1F1F23, Primary Orange #FF6A00, Light Gray #F4F4F6
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [enrollmentKey, setEnrollmentKey] = useState('');
    const [modules, setModules] = useState([]);
    const [loadingModules, setLoadingModules] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchStudentModules = useCallback(async () => {
        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'Student ID not found. Please login again.' });
            setLoadingModules(false);
            return;
        }

        try {
            setLoadingModules(true);
            const response = await axios.get(
                `http://localhost:8090/api/groups/modules/student/${storedUser.id}`
            );
            setModules(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch student modules:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to load enrolled modules.'
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
            const response = await axios.post(
                `http://localhost:8090/api/groups/modules/enroll?studentId=${storedUser.id}&enrollmentKey=${encodeURIComponent(enrollmentKey)}`
            );

            setMessage({ type: 'success', text: response.data });
            setEnrollmentKey('');
            await fetchStudentModules();
        } catch (error) {
            console.error('Enrollment failed:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to enroll in module.'
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome, <span className="font-semibold">{storedUser?.fullName}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            University ID: {storedUser?.universityId}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-2" style={{color: '#0A0A0C'}}>Join a Module</h2>
                    <p className="mb-4" style={{color: '#1F1F23'}}>
                        Enter the enrollment key shared for your module.
                    </p>

                    <form onSubmit={handleEnroll} className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            value={enrollmentKey}
                            onChange={(e) => setEnrollmentKey(e.target.value)}
                            placeholder="Enter enrollment key"
                            className="flex-1 rounded-lg p-3 outline-none"
                            style={{borderColor: '#FF6A00', borderWidth: '1px'}}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(255, 106, 0, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />

                        <button
                            type="submit"
                            className="text-white font-bold px-6 py-3 rounded-lg transition"
                            style={{backgroundColor: '#FF6A00'}}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#E55A00'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6A00'}
                        >
                            Enroll
                        </button>
                    </form>

                    {message.text && (
                        <div
                            className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                                message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow p-6" style={{borderColor: '#FF6A00', borderWidth: '1px'}}>
                    <h2 className="text-2xl font-bold mb-2" style={{color: '#0A0A0C'}}>My Modules</h2>
                    <p className="mb-6" style={{color: '#1F1F23'}}>
                        These are the modules you have enrolled in.
                    </p>

                    {loadingModules ? (
                        <p style={{color: '#1F1F23'}}>Loading modules...</p>
                    ) : modules.length === 0 ? (
                        <div className="text-center py-10" style={{color: '#1F1F23'}}>
                            You have not enrolled in any modules yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modules.map((module) => (
                                <div
                                    key={module.id}
                                    className="rounded-xl p-5 hover:shadow-md transition bg-gray-50"
                                    style={{borderColor: '#FF6A00', borderWidth: '1px'}}
                                >
                                    <h3 className="text-xl font-bold" style={{color: '#0A0A0C'}}>
                                        {module.moduleCode}
                                    </h3>
                                    <p className="mt-1" style={{color: '#1F1F23'}}>{module.moduleName}</p>
                                    <p className="text-sm mt-2" style={{color: '#1F1F23', opacity: '0.8'}}>
                                        Year {module.year} • Semester {module.semester}
                                    </p>

                                    <button
                                        onClick={() => {
                                            window.location.href = `/student/modules/${module.id}`;
                                        }}
                                        className="mt-4 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                        style={{backgroundColor: '#FF6A00'}}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#E55A00'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6A00'}
                                    >
                                        Open Module
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;