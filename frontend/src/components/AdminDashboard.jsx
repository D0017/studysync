import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const cards = [
        {
            title: 'User Management',
            description: 'View users and update their roles.',
            path: '/admin/users',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'Create Module',
            description: 'Create a new module and generate its empty groups.',
            path: '/admin/create-module',
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Module Management',
            description: 'View created modules and manage their groups.',
            path: '/admin/modules',
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            title: 'Leadership Requests',
            description: 'Review and approve student leadership requests.',
            path: '/admin/leadership-requests',
            color: 'bg-orange-600 hover:bg-orange-700'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome, <span className="font-semibold">{storedUser?.fullName || 'Admin'}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Manage users, modules, groups, and leadership requests.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.path}
                            className="bg-white rounded-2xl shadow border border-gray-100 p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h2>
                            <p className="text-gray-600 mb-6">{card.description}</p>

                            <button
                                onClick={() => navigate(card.path)}
                                className={`text-white font-semibold px-5 py-3 rounded-lg transition ${card.color}`}
                            >
                                Open
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;