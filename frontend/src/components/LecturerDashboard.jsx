import React from 'react';

const LecturerDashboard = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome, <span className="font-semibold">{storedUser?.fullName}</span>
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="mt-8 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-5">
                    Lecturer features will be added after user and project management are fully completed.
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboard;