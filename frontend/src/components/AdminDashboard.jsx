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

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, modules: 0, leadershipRequests: 0 });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            const [usersRes, modulesRes, leadershipRes] = await Promise.all([
                axios.get('/api/users/all'),
                axios.get('/api/admin/modules'),
                axios.get('/api/admin/leadership-requests'),
            ]);
            setStats({
                users: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
                modules: Array.isArray(modulesRes.data) ? modulesRes.data.length : 0,
                leadershipRequests: Array.isArray(leadershipRes.data) ? leadershipRes.data.length : 0,
            });
        } catch (error) {
            console.error('Failed to load admin dashboard stats:', error);
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to load dashboard data.') });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDashboardStats(); }, [fetchDashboardStats]);

    const quickActions = [
        {
            title: 'Manage Users',
            description: 'Activate, deactivate, and update user roles.',
            path: '/admin/users',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
        },
        {
            title: 'Create Module',
            description: 'Create a module and prepare groups for students.',
            path: '/admin/create-module',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
        },
        {
            title: 'Module Management',
            description: 'View modules and inspect created group structures.',
            path: '/admin/modules',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
        },
        {
            title: 'Leadership Requests',
            description: 'Review and approve pending leadership requests.',
            path: '/admin/leadership-requests',
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
        },
    ];

    const statCards = [
        { title: 'Total Users',           value: stats.users,              subtitle: 'Registered accounts',   color: '#ff7a1a' },
        { title: 'Total Modules',         value: stats.modules,            subtitle: 'Modules in the system', color: '#34d399' },
        { title: 'Leadership Requests',   value: stats.leadershipRequests, subtitle: 'Pending approvals',     color: '#a78bfa' },
    ];

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#f4f4f6' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                /* ── HERO ── */
                .ad-hero {
                    background: linear-gradient(135deg, #1c1c20 0%, #161618 60%, #1a1510 100%);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    padding: 36px 40px;
                    margin-bottom: 24px;
                    position: relative;
                    overflow: hidden;
                }
                .ad-hero::before {
                    content: '';
                    position: absolute;
                    top: -60px; right: -60px;
                    width: 220px; height: 220px;
                    background: radial-gradient(circle, rgba(255,106,0,0.12) 0%, transparent 70%);
                    pointer-events: none;
                }
                .ad-hero::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, rgba(255,106,0,0.4), transparent 60%);
                }
                .ad-hero-inner {
                    display: flex; flex-direction: column; gap: 24px;
                    position: relative; z-index: 1;
                }
                @media(min-width:1280px){
                    .ad-hero-inner { flex-direction: row; align-items: center; justify-content: space-between; }
                }
                .ad-hero-tag {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: rgba(255,106,0,0.1);
                    border: 1px solid rgba(255,106,0,0.2);
                    border-radius: 20px;
                    padding: 4px 12px;
                    font-size: 11px; font-weight: 600;
                    color: #ff8533; letter-spacing: 0.04em;
                    margin-bottom: 14px;
                }
                .ad-hero-tag-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #ff6a00;
                    box-shadow: 0 0 6px rgba(255,106,0,0.6);
                    animation: pulse 2s ease infinite;
                }
                @keyframes pulse {
                    0%,100% { opacity: 1; } 50% { opacity: 0.4; }
                }
                .ad-hero-title {
                    font-size: clamp(24px, 3vw, 34px);
                    font-weight: 800; color: #f4f4f6;
                    line-height: 1.15; letter-spacing: -0.03em;
                    margin-bottom: 12px;
                }
                .ad-hero-title span { color: #ff7a1a; }
                .ad-hero-desc { font-size: 13.5px; color: rgba(244,244,246,0.45); line-height: 1.8; max-width: 520px; }
                .ad-hero-actions { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }

                .ad-btn-primary {
                    padding: 11px 22px;
                    background: linear-gradient(135deg, #ff6a00, #ff8533);
                    border: none; border-radius: 10px;
                    color: #fff; font-family: inherit; font-size: 13px; font-weight: 700;
                    cursor: pointer; transition: all 0.18s;
                    box-shadow: 0 4px 16px rgba(255,106,0,0.3);
                }
                .ad-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(255,106,0,0.4); }
                .ad-btn-primary:active { transform: translateY(0); }

                .ad-btn-ghost {
                    padding: 11px 20px;
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px; color: rgba(244,244,246,0.65);
                    font-family: inherit; font-size: 13px; font-weight: 500;
                    cursor: pointer; transition: all 0.18s;
                }
                .ad-btn-ghost:hover { background: rgba(255,255,255,0.09); color: #f4f4f6; }

                /* ── MESSAGE ── */
                .ad-msg {
                    border-radius: 12px; padding: 12px 16px;
                    font-size: 13px; font-weight: 500;
                    margin-bottom: 20px;
                    display: flex; align-items: center; gap: 10px;
                }
                .ad-msg.error  { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.18); color: #fca5a5; }
                .ad-msg.success{ background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.18); color: #6ee7b7; }

                /* ── STATS ── */
                .ad-stats {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 14px; margin-bottom: 24px;
                }
                @media(min-width:640px){ .ad-stats { grid-template-columns: repeat(3, 1fr); } }

                .ad-stat {
                    background: linear-gradient(135deg, #1c1c20 0%, #161618 100%);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px; padding: 22px 24px;
                    position: relative; overflow: hidden;
                    transition: border-color 0.2s, transform 0.2s;
                }
                .ad-stat:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-1px); }
                .ad-stat-glow {
                    position: absolute; top: -30px; right: -30px;
                    width: 100px; height: 100px; border-radius: 50%;
                    opacity: 0.12; pointer-events: none;
                }
                .ad-stat-label {
                    font-size: 11px; font-weight: 600; letter-spacing: 0.07em;
                    text-transform: uppercase; color: rgba(244,244,246,0.38);
                    margin-bottom: 14px; position: relative;
                }
                .ad-stat-value {
                    font-size: 40px; font-weight: 800;
                    letter-spacing: -0.03em; line-height: 1;
                    position: relative; margin-bottom: 8px;
                }
                .ad-stat-sub {
                    font-size: 12px; color: rgba(244,244,246,0.32); position: relative;
                }

                /* ── SECTION HEADER ── */
                .ad-sec-head { margin-bottom: 14px; }
                .ad-sec-title { font-size: 18px; font-weight: 800; color: #f4f4f6; letter-spacing: -0.02em; }
                .ad-sec-sub   { font-size: 12.5px; color: rgba(244,244,246,0.38); margin-top: 3px; }

                /* ── QUICK ACTIONS ── */
                .ad-actions {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 12px; margin-bottom: 24px;
                }
                @media(min-width:640px){ .ad-actions { grid-template-columns: repeat(2, 1fr); } }

                .ad-action-btn {
                    background: linear-gradient(135deg, #1c1c20 0%, #161618 100%);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px; padding: 22px 22px 20px;
                    text-align: left; cursor: pointer; width: 100%;
                    font-family: inherit; transition: all 0.2s;
                    position: relative; overflow: hidden;
                }
                .ad-action-btn:hover {
                    border-color: rgba(255,106,0,0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 28px rgba(0,0,0,0.25);
                }
                .ad-action-btn:hover .ad-action-arrow { transform: translateX(3px); color: #ff6a00; }
                .ad-action-icon-wrap {
                    width: 40px; height: 40px;
                    background: rgba(255,106,0,0.1);
                    border: 1px solid rgba(255,106,0,0.18);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: #ff7a1a; margin-bottom: 14px;
                    transition: background 0.2s;
                }
                .ad-action-btn:hover .ad-action-icon-wrap { background: rgba(255,106,0,0.16); }
                .ad-action-top { display: flex; align-items: flex-start; justify-content: space-between; }
                .ad-action-title { font-size: 15px; font-weight: 700; color: #f4f4f6; margin-bottom: 6px; letter-spacing: -0.01em; }
                .ad-action-desc { font-size: 12.5px; color: rgba(244,244,246,0.38); line-height: 1.65; }
                .ad-action-arrow { font-size: 16px; color: rgba(244,244,246,0.2); transition: all 0.2s; margin-top: 2px; }

                /* ── BOTTOM PANELS ── */
                .ad-panels { display: grid; grid-template-columns: 1fr; gap: 14px; }
                @media(min-width:1280px){ .ad-panels { grid-template-columns: 1fr 1fr; } }

                .ad-panel {
                    background: linear-gradient(135deg, #1c1c20 0%, #161618 100%);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px; padding: 24px 26px;
                }
                .ad-panel-title {
                    font-size: 14px; font-weight: 700; color: #f4f4f6;
                    letter-spacing: -0.01em; margin-bottom: 12px;
                    padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .ad-panel-body { font-size: 13px; color: rgba(244,244,246,0.42); line-height: 1.8; }

                .ad-flow-list { display: flex; flex-direction: column; gap: 11px; }
                .ad-flow-item { display: flex; align-items: flex-start; gap: 12px; }
                .ad-flow-num {
                    width: 22px; height: 22px; border-radius: 6px;
                    background: rgba(255,106,0,0.12); border: 1px solid rgba(255,106,0,0.22);
                    color: #ff7a1a; font-size: 11px; font-weight: 700;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .ad-flow-text { font-size: 13px; color: rgba(244,244,246,0.42); line-height: 1.65; padding-top: 2px; }
            `}</style>

            {/* HERO */}
            <div className="ad-hero">
                <div className="ad-hero-inner">
                    <div>
                        <div className="ad-hero-tag">
                            <span className="ad-hero-tag-dot" />
                            Admin Workspace
                        </div>
                        <h2 className="ad-hero-title">
                            Manage users, modules,{' '}
                            <span>and group operations</span>
                        </h2>
                        <p className="ad-hero-desc">
                            Central control panel for StudySync. Create modules, organize group flow,
                            manage users, and review leadership requests — all from one place.
                        </p>
                    </div>
                    <div className="ad-hero-actions">
                        <button onClick={() => navigate('/admin/create-module')} className="ad-btn-primary">
                            + Create New Module
                        </button>
                        <button onClick={fetchDashboardStats} className="ad-btn-ghost">
                            Refresh Stats
                        </button>
                    </div>
                </div>
            </div>

            {/* MESSAGE */}
            {message.text && (
                <div className={`ad-msg ${message.type}`}>{message.text}</div>
            )}

            {/* STATS */}
            <div className="ad-stats">
                {statCards.map((card) => (
                    <div key={card.title} className="ad-stat">
                        <div className="ad-stat-glow" style={{ background: card.color }} />
                        <div className="ad-stat-label">{card.title}</div>
                        <div className="ad-stat-value" style={{ color: card.color }}>
                            {loading ? '—' : card.value}
                        </div>
                        <div className="ad-stat-sub">{card.subtitle}</div>
                    </div>
                ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="ad-sec-head">
                <div className="ad-sec-title">Quick Actions</div>
                <div className="ad-sec-sub">Go directly to the most important admin functions.</div>
            </div>
            <div className="ad-actions">
                {quickActions.map((action) => (
                    <button key={action.path} onClick={() => navigate(action.path)} className="ad-action-btn">
                        <div className="ad-action-icon-wrap">{action.icon}</div>
                        <div className="ad-action-top">
                            <div>
                                <div className="ad-action-title">{action.title}</div>
                                <div className="ad-action-desc">{action.description}</div>
                            </div>
                            <div className="ad-action-arrow">→</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* BOTTOM PANELS */}
            <div className="ad-panels">
                <div className="ad-panel">
                    <div className="ad-panel-title">System Overview</div>
                    <p className="ad-panel-body">
                        Use this dashboard as the central hub for your group management flow.
                        Create modules first, then generate groups under them, and finally
                        review student leadership requests once group activity begins.
                    </p>
                </div>

                <div className="ad-panel">
                    <div className="ad-panel-title">Recommended Flow</div>
                    <div className="ad-flow-list">
                        {[
                            'Create a module with valid details and enrollment key.',
                            'Open module management and generate empty groups.',
                            'Let students enroll into modules using the key.',
                            'Review leadership requests and finalize group structure.',
                        ].map((step, i) => (
                            <div key={i} className="ad-flow-item">
                                <div className="ad-flow-num">{i + 1}</div>
                                <div className="ad-flow-text">{step}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;