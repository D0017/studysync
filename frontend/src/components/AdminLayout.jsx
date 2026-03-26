import React from 'react';
import { NavLink, Outlet, } from 'react-router-dom';

const AdminLayout = () => {

    const storedUser = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const navItems = [
        {
            label: 'Dashboard', path: '/admin-dashboard',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        },
        {
            label: 'User Management', path: '/admin/users',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        },
        {
            label: 'Create Module', path: '/admin/create-module',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        },
        {
            label: 'Module Management', path: '/admin/modules',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        },
        {
            label: 'Leadership Requests', path: '/admin/leadership-requests',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0c', color: '#f4f4f6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,106,0,0.25); border-radius: 4px; }

                .al-wrap { display: flex; min-height: 100vh; }

                /* ── SIDEBAR ── */
                .al-sidebar {
                    display: none;
                    width: 260px; flex-shrink: 0; flex-direction: column;
                    background: linear-gradient(160deg, #1c1c20 0%, #141416 100%);
                    border-right: 1px solid rgba(255,255,255,0.055);
                    position: sticky; top: 0; height: 100vh; overflow-y: auto;
                }
                @media(min-width:1024px){ .al-sidebar { display: flex; } }

                .al-brand-area {
                    padding: 26px 18px 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .al-brand-row { display: flex; align-items: center; gap: 11px; margin-bottom: 16px; }
                .al-brand-icon {
                    width: 38px; height: 38px;
                    background: linear-gradient(135deg, #ff6a00, #ff8533);
                    border-radius: 11px;
                    box-shadow: 0 0 0 1px rgba(255,106,0,0.3), 0 6px 20px rgba(255,106,0,0.3);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 17px; font-weight: 800; color: #fff; flex-shrink: 0;
                    letter-spacing: -0.5px;
                }
                .al-brand-name { font-size: 16px; font-weight: 800; color: #f4f4f6; letter-spacing: -0.02em; }
                .al-brand-sub  { font-size: 11px; color: rgba(244,244,246,0.35); margin-top: 1px; font-weight: 500; }

                .al-user-box {
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 12px;
                    padding: 10px 12px;
                    display: flex; align-items: center; gap: 10px;
                }
                .al-avatar {
                    width: 30px; height: 30px;
                    background: linear-gradient(135deg, #ff6a00, #ff8533);
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
                }
                .al-uname  { font-size: 12.5px; font-weight: 600; color: #f4f4f6; }
                .al-uemail { font-size: 11px; color: rgba(244,244,246,0.35); margin-top: 1px; }

                .al-nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; }
                .al-nav-section {
                    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
                    text-transform: uppercase; color: rgba(244,244,246,0.18);
                    padding: 0 8px; margin: 4px 0 8px;
                }
                .al-link {
                    display: flex; align-items: center; gap: 9px;
                    padding: 9px 10px; border-radius: 10px;
                    text-decoration: none; font-size: 13px; font-weight: 500;
                    color: rgba(244,244,246,0.45);
                    transition: all 0.17s ease;
                    border: 1px solid transparent;
                }
                .al-link:hover {
                    background: rgba(255,255,255,0.05);
                    color: rgba(244,244,246,0.8);
                }
                .al-link.active {
                    background: linear-gradient(135deg, rgba(255,106,0,0.15) 0%, rgba(255,106,0,0.07) 100%);
                    border-color: rgba(255,106,0,0.22);
                    color: #ff7a1a;
                    font-weight: 600;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
                }
                .al-link-icon { opacity: 0.65; flex-shrink: 0; transition: opacity 0.17s; }
                .al-link:hover .al-link-icon { opacity: 0.9; }
                .al-link.active .al-link-icon { opacity: 1; }

                .al-footer {
                    padding: 12px 10px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    display: flex; flex-direction: column; gap: 7px;
                }
                .al-btn-back {
                    width: 100%; padding: 9px 12px;
                    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 9px; color: rgba(244,244,246,0.55);
                    font-family: inherit; font-size: 12.5px; font-weight: 500;
                    cursor: pointer; transition: all 0.17s;
                }
                .al-btn-back:hover { background: rgba(255,255,255,0.07); color: #f4f4f6; }
                .al-btn-out {
                    width: 100%; padding: 9px 12px;
                    background: rgba(239,68,68,0.09); border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 9px; color: #f87171;
                    font-family: inherit; font-size: 12.5px; font-weight: 600;
                    cursor: pointer; transition: all 0.17s;
                }
                .al-btn-out:hover { background: rgba(239,68,68,0.16); border-color: rgba(239,68,68,0.35); }

                /* ── MAIN ── */
                .al-main { flex: 1; padding: 28px 30px; min-width: 0; }
                @media(max-width:768px){ .al-main { padding: 14px; } }

                /* ── MOBILE ── */
                .al-mob { display: block; margin-bottom: 20px; }
                @media(min-width:1024px){ .al-mob { display: none; } }
                .al-mob-bar {
                    background: linear-gradient(135deg, #1c1c20, #141416);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px; padding: 16px;
                }
                .al-mob-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
                .al-mob-title { font-size: 15px; font-weight: 800; color: #f4f4f6; }
                .al-mob-name  { font-size: 11px; color: rgba(244,244,246,0.38); margin-top: 2px; }
                .al-mob-logout {
                    padding: 7px 14px;
                    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 8px; color: #f87171;
                    font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
                }
                .al-mob-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                .al-mob-item {
                    display: flex; align-items: center; gap: 8px;
                    padding: 11px 13px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 11px; text-decoration: none;
                    color: rgba(244,244,246,0.45); font-size: 12px; font-weight: 500;
                    transition: all 0.17s;
                }
                .al-mob-item:hover { background: rgba(255,255,255,0.06); color: #f4f4f6; }
                .al-mob-item.active {
                    background: linear-gradient(135deg, rgba(255,106,0,0.13), rgba(255,106,0,0.06));
                    border-color: rgba(255,106,0,0.22); color: #ff7a1a; font-weight: 600;
                }
            `}</style>

            <div className="al-wrap">
                <aside className="al-sidebar">
                    <div className="al-brand-area">
                      {/*  <div className="al-brand-row">
                            <div className="al-brand-icon">S</div>
                            <div>
                                <div className="al-brand-name">StudySync</div>
                                <div className="al-brand-sub">Admin Control Center</div>
                            </div>
                        </div>  */}
                        <div className="al-user-box">
                            <div className="al-avatar">{(storedUser?.fullName || 'A').charAt(0).toUpperCase()}</div>
                            <div>
                                <div className="al-uname">{storedUser?.fullName || 'Admin'}</div>
                                <div className="al-uemail">{storedUser?.email || 'admin@studysync.com'}</div>
                            </div>
                        </div>
                    </div>

                    <nav className="al-nav">
                        <div className="al-nav-section">Main Menu</div>
                        {navItems.map((item) => (
                            <NavLink key={item.path} to={item.path}
                                className={({ isActive }) => `al-link${isActive ? ' active' : ''}`}>
                                <span className="al-link-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="al-footer">

                        <button onClick={handleLogout} className="al-btn-out">Sign Out</button>
                    </div>
                </aside>

                <main className="al-main">
                    <div className="al-mob">
                        <div className="al-mob-bar">
                            <div className="al-mob-top">
                                <div>
                                    <div className="al-mob-title">StudySync Admin</div>
                                    <div className="al-mob-name">{storedUser?.fullName || 'Admin'}</div>
                                </div>
                                <button onClick={handleLogout} className="al-mob-logout">Sign Out</button>
                            </div>
                            <div className="al-mob-grid">
                                {navItems.map((item) => (
                                    <NavLink key={item.path} to={item.path}
                                        className={({ isActive }) => `al-mob-item${isActive ? ' active' : ''}`}>
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
    );
};

export default AdminLayout;