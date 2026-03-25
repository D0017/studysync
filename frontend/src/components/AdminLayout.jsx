import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin-dashboard', icon: '🏠' },
        { label: 'User Management', path: '/admin/users', icon: '👥' },
        { label: 'Create Module', path: '/admin/create-module', icon: '➕' },
        { label: 'Module Management', path: '/admin/modules', icon: '📚' },
        { label: 'Leadership Requests', path: '/admin/leadership-requests', icon: '⭐' }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="hidden lg:flex lg:w-72 lg:flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-500 via-cyan-400 to-violet-500 flex items-center justify-center text-xl shadow-lg">
                                ⚙️
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight">StudySync</h1>
                                <p className="text-sm text-slate-300">Admin Control Center</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                Logged in as
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                                {storedUser?.fullName || 'Admin'}
                            </p>
                            <p className="text-sm text-slate-300">
                                {storedUser?.email || 'admin@studysync.com'}
                            </p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                                        isActive
                                            ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                            : 'bg-white/5 text-slate-200 hover:bg-white/10'
                                    }`
                                }
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            Back to Home
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full rounded-2xl bg-red-500/90 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 p-6 md:p-8">
                    {/* Mobile top bar */}
                    <div className="lg:hidden mb-6">
                        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-lg font-bold text-white">StudySync Admin</h1>
                                    <p className="text-sm text-slate-300">
                                        {storedUser?.fullName || 'Admin'}
                                    </p>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                                >
                                    Logout
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `rounded-2xl p-4 transition ${
                                                isActive
                                                    ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white'
                                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                            }`
                                        }
                                    >
                                        <div className="text-lg">{item.icon}</div>
                                        <div className="mt-2 text-sm font-semibold">{item.label}</div>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;