import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo11.png';

const AdminLayout = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: '/admin-dashboard',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            )
        },
        {
            label: 'User Management',
            path: '/admin/users',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        },
        {
            label: 'Create Module',
            path: '/admin/create-module',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            )
        },
        {
            label: 'Module Management',
            path: '/admin/modules',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16" />
                    <path d="M4 10h16" />
                    <path d="M4 14h16" />
                    <path d="M4 18h16" />
                </svg>
            )
        },
        {
            label: 'Leadership Requests',
            path: '/admin/leadership-requests',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            )
        }
    ];

    const adminName = storedUser?.fullName || 'Admin';
    const adminEmail = storedUser?.email || 'admin@studysync.com';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#12141A', color: '#f4f4f6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 7px; height: 7px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.22); border-radius: 999px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.36); }

                .al-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(circle at top right, rgba(255,106,0,0.08), transparent 28%),
                        #12141A;
                }

                .al-shell {
                    display: flex;
                    min-height: 100vh;
                }

                .al-sidebar {
                    display: none;
                    width: 272px;
                    flex-shrink: 0;
                    background: linear-gradient(180deg, #171A20 0%, #13161C 100%);
                    border-right: 1px solid rgba(255,255,255,0.08);
                    padding: 20px 14px;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                }

                @media (min-width: 1024px) {
                    .al-sidebar {
                        display: flex;
                        flex-direction: column;
                    }
                }

                .al-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 10px 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    margin-bottom: 16px;
                }

                .al-logo {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    object-fit: contain;
                    background: rgba(255,255,255,0.04);
                    padding: 4px;
                }

                .al-brand-name {
                    font-size: 18px;
                    font-weight: 800;
                    color: #f4f4f6;
                    letter-spacing: -0.02em;
                }

                .al-brand-sub {
                    font-size: 11px;
                    color: rgba(244,244,246,0.42);
                    margin-top: 2px;
                }

                .al-user-card {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    background: rgba(255,255,255,0.03);
                    margin-bottom: 18px;
                }

                .al-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #FF6A00, #FF8A33);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 800;
                    flex-shrink: 0;
                }

                .al-user-name {
                    font-size: 13.5px;
                    font-weight: 700;
                    color: #f4f4f6;
                }

                .al-user-mail {
                    font-size: 11.5px;
                    color: rgba(244,244,246,0.40);
                    margin-top: 2px;
                    word-break: break-word;
                }

                .al-nav-title {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(244,244,246,0.22);
                    padding: 0 10px;
                    margin-bottom: 8px;
                }

                .al-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    flex: 1;
                }

                .al-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 11px 12px;
                    border-radius: 12px;
                    text-decoration: none;
                    color: rgba(244,244,246,0.55);
                    font-size: 13px;
                    font-weight: 600;
                    border: 1px solid transparent;
                    transition: all 0.18s ease;
                }

                .al-link:hover {
                    color: #f4f4f6;
                    background: rgba(255,255,255,0.05);
                }

                .al-link.active {
                    background: linear-gradient(135deg, rgba(255,106,0,0.14), rgba(255,106,0,0.07));
                    border-color: rgba(255,106,0,0.24);
                    color: #FF8A33;
                }

                .al-footer {
                    border-top: 1px solid rgba(255,255,255,0.06);
                    padding-top: 14px;
                    margin-top: 14px;
                }

                .al-logout {
                    width: 100%;
                    padding: 11px 14px;
                    border: 1px solid rgba(239,68,68,0.22);
                    background: rgba(239,68,68,0.10);
                    color: #f87171;
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.18s ease;
                }

                .al-logout:hover {
                    background: rgba(239,68,68,0.16);
                }

                .al-main {
                    flex: 1;
                    min-width: 0;
                    padding: 28px;
                }

                @media (max-width: 1023px) {
                    .al-main {
                        padding: 16px;
                    }
                }

                .al-mobile-top {
                    display: block;
                    margin-bottom: 18px;
                }

                @media (min-width: 1024px) {
                    .al-mobile-top {
                        display: none;
                    }
                }

                .al-mobile-card {
                    padding: 16px 18px;
                    border-radius: 18px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: linear-gradient(135deg, #1f1f23 0%, #18181b 100%);
                    box-shadow: 0 10px 24px rgba(0,0,0,0.12);
                }

                .al-mobile-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 14px;
                    margin-bottom: 14px;
                }

                .al-mobile-title {
                    font-size: 16px;
                    font-weight: 800;
                    color: #f4f4f6;
                    letter-spacing: -0.02em;
                }

                .al-mobile-sub {
                    font-size: 12px;
                    color: rgba(244,244,246,0.42);
                    margin-top: 3px;
                }

                .al-mobile-logout {
                    padding: 9px 14px;
                    border: 1px solid rgba(239,68,68,0.22);
                    background: rgba(239,68,68,0.10);
                    color: #f87171;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .al-mobile-nav {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 8px;
                }

                .al-mobile-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 11px 12px;
                    border-radius: 12px;
                    text-decoration: none;
                    color: rgba(244,244,246,0.55);
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    font-size: 12px;
                    font-weight: 600;
                }

                .al-mobile-link.active {
                    color: #FF8A33;
                    background: linear-gradient(135deg, rgba(255,106,0,0.14), rgba(255,106,0,0.07));
                    border-color: rgba(255,106,0,0.24);
                }
            `}</style>

            <div className="al-page">
                <div className="al-shell">
                    <aside className="al-sidebar">
                        <div className="al-brand">
                            <img src={logo} alt="StudySync logo" className="al-logo" />
                            <div>
                                <div className="al-brand-name">StudySync</div>
                                <div className="al-brand-sub">Admin Control Center</div>
                            </div>
                        </div>

                        <div className="al-user-card">
                            <div className="al-avatar">
                                {adminName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="al-user-name">{adminName}</div>
                                <div className="al-user-mail">{adminEmail}</div>
                            </div>
                        </div>

                        <div className="al-nav-title">Main Menu</div>

                        <nav className="al-nav">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `al-link${isActive ? ' active' : ''}`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        <div className="al-footer">
                            <button onClick={handleLogout} className="al-logout">
                                Sign Out
                            </button>
                        </div>
                    </aside>

                    <main className="al-main">
                        <div className="al-mobile-top">
                            <div className="al-mobile-card">
                                <div className="al-mobile-row">
                                    <div>
                                        <div className="al-mobile-title">StudySync Admin</div>
                                        <div className="al-mobile-sub">{adminName}</div>
                                    </div>
                                    <button onClick={handleLogout} className="al-mobile-logout">
                                        Sign Out
                                    </button>
                                </div>

                                <div className="al-mobile-nav">
                                    {navItems.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) => `al-mobile-link${isActive ? ' active' : ''}`}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;