import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return fallback;
};

const S = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.pg { font-family:'Plus Jakarta Sans',sans-serif; color:#f4f4f6; }
.card {
    background:linear-gradient(135deg,#1e1e22 0%,#18181b 100%);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:18px;
}
.hero {
    background:linear-gradient(135deg,#1e1e22 0%,#18181b 60%,#1c1a14 100%);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:20px;padding:34px 38px;margin-bottom:22px;
    position:relative;overflow:hidden;
}
.hero::after {
    content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,rgba(255,106,0,0.4),transparent 55%);
}
.hero-tag {
    display:inline-flex;align-items:center;gap:6px;
    background:rgba(255,106,0,0.1);border:1px solid rgba(255,106,0,0.2);
    border-radius:20px;padding:4px 12px;
    font-size:11px;font-weight:600;color:#ff8533;letter-spacing:.04em;margin-bottom:12px;
}
.hero-row { display:flex;flex-direction:column;gap:20px; }
@media(min-width:768px){ .hero-row { flex-direction:row;align-items:center;justify-content:space-between; } }
.hero-title { font-size:clamp(22px,3vw,32px);font-weight:800;color:#f4f4f6;letter-spacing:-.03em;margin-bottom:8px; }
.hero-desc  { font-size:13px;color:rgba(244,244,246,.44);line-height:1.8; }
.btn-primary {
    padding:10px 20px;background:linear-gradient(135deg,#ff6a00,#ff8533);
    border:none;border-radius:10px;color:#fff;
    font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
    box-shadow:0 4px 14px rgba(255,106,0,.28);transition:all .18s;white-space:nowrap;
}
.btn-primary:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,106,0,.38); }
.msg { border-radius:12px;padding:12px 16px;font-size:13px;font-weight:500;margin-bottom:18px; }
.msg.error   { background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);color:#fca5a5; }
.msg.success { background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.18);color:#6ee7b7; }
.stat-grid3 { display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:20px; }
@media(min-width:640px){ .stat-grid3 { grid-template-columns:1fr 1fr 1fr; } }
.stat-card { padding:20px 22px; }
.stat-lbl { font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:rgba(244,244,246,.35);margin-bottom:10px; }
.stat-val { font-size:36px;font-weight:800;letter-spacing:-.03em;line-height:1; }
.stat-sub { font-size:11px;color:rgba(244,244,246,.3);margin-top:6px; }
/* TABLE */
.tbl-wrap {
    overflow-x:auto;
    border-radius:18px;
    margin-bottom:18px;
}
table { width:100%;border-collapse:collapse;min-width:700px; }
thead tr { background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.07); }
thead th {
    padding:13px 16px;text-align:left;
    font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
    color:rgba(244,244,246,.35);white-space:nowrap;
}
tbody tr { border-bottom:1px solid rgba(255,255,255,.05);transition:background .15s; }
tbody tr:last-child { border-bottom:none; }
tbody tr:hover { background:rgba(255,255,255,.03); }
tbody td { padding:13px 16px;font-size:13px;color:rgba(244,244,246,.75);vertical-align:middle; }
.td-name { font-weight:600;color:#f4f4f6; }
.td-mono { font-family:monospace;font-size:12.5px; }
.badge { display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap; }
.badge-admin   { background:rgba(168,85,247,.12);border:1px solid rgba(168,85,247,.22);color:#c4b5fd; }
.badge-lect    { background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.2);color:#93c5fd; }
.badge-student { background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);color:#6ee7b7; }
.badge-active  { background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);color:#6ee7b7; }
.badge-inactive{ background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.18);color:#fca5a5; }
.sel {
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
    border-radius:8px;padding:7px 10px;color:#f4f4f6;
    font-family:inherit;font-size:12.5px;outline:none;cursor:pointer;
    transition:border-color .18s;
}
.sel:focus { border-color:rgba(255,106,0,.45);box-shadow:0 0 0 3px rgba(255,106,0,.1); }
.sel option { background:#1e1e22;color:#f4f4f6; }
.btn-activate {
    padding:7px 14px;border:none;border-radius:8px;
    font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .18s;white-space:nowrap;
}
.btn-deactivate { background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.2); }
.btn-deactivate:hover { background:rgba(239,68,68,.2); }
.btn-do-activate { background:rgba(52,211,153,.1);color:#6ee7b7;border:1px solid rgba(52,211,153,.2); }
.btn-do-activate:hover { background:rgba(52,211,153,.18); }
/* MOBILE CARDS */
.mob-cards { display:flex;flex-direction:column;gap:12px; }
.mob-card { padding:18px 20px; }
.mob-top  { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px; }
.mob-name  { font-size:15px;font-weight:700;color:#f4f4f6; }
.mob-email { font-size:12px;color:rgba(244,244,246,.42);margin-top:3px; }
.mob-uid   { font-size:12px;font-family:monospace;color:rgba(244,244,246,.38);margin-top:2px; }
.mob-badges{ display:flex;flex-direction:column;gap:6px;align-items:flex-end; }
.mob-actions{ display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px; }
.mob-sel {
    width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
    border-radius:9px;padding:10px 12px;color:#f4f4f6;
    font-family:inherit;font-size:13px;outline:none;
}
.mob-sel:focus { border-color:rgba(255,106,0,.45); }
.mob-sel option { background:#1e1e22; }
.mob-btn-activate {
    width:100%;padding:10px;border:none;border-radius:9px;
    font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .18s;
}
.empty {
    background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.08);
    border-radius:14px;padding:36px;text-align:center;
    font-size:13px;color:rgba(244,244,246,.3);
}
`;

const roleBadgeClass = (role) => {
    if (role === 'ADMIN')    return 'badge badge-admin';
    if (role === 'LECTURER') return 'badge badge-lect';
    return 'badge badge-student';
};

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            const response = await axios.get('/api/users/all');
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage({ type: 'error', text: getErrorMessage(error, 'Could not load users.') });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const getUserActiveStatus = (user) => {
        if (typeof user.active === 'boolean') return user.active;
        if (typeof user.isActive === 'boolean') return user.isActive;
        return false;
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`/api/users/${userId}/role`, newRole, { headers: { 'Content-Type': 'application/json' } });
            setMessage({ type: 'success', text: 'Role updated successfully.' });
            await fetchUsers();
        } catch (error) {
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to update role.') });
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await axios.put(`/api/users/${userId}/status`, { active: !currentStatus });
            setMessage({ type: 'success', text: `User ${currentStatus ? 'deactivated' : 'activated'} successfully.` });
            await fetchUsers();
        } catch (error) {
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to update user status.') });
        }
    };

    return (
        <div className="pg">
            <style>{S}</style>

            {/* Hero */}
            <div className="hero">
                <div className="hero-row">
                    <div>
                        <div className="hero-tag">Admin Management</div>
                        <h2 className="hero-title">User Management</h2>
                        <p className="hero-desc">View all registered users, update roles, and control account access.</p>
                    </div>
                    <button onClick={fetchUsers} className="btn-primary">Refresh List</button>
                </div>
            </div>

            {message.text && <div className={`msg ${message.type}`}>{message.text}</div>}

            {loading && users.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'rgba(244,244,246,.4)', fontSize: '13px' }}>
                    Loading users…
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="stat-grid3">
                        <div className="card stat-card">
                            <div className="stat-lbl">Total Users</div>
                            <div className="stat-val" style={{ color: '#ff7a1a' }}>{users.length}</div>
                            <div className="stat-sub">Registered accounts</div>
                        </div>
                        <div className="card stat-card">
                            <div className="stat-lbl">Active Accounts</div>
                            <div className="stat-val" style={{ color: '#34d399' }}>{users.filter(u => getUserActiveStatus(u)).length}</div>
                            <div className="stat-sub">Currently active</div>
                        </div>
                        <div className="card stat-card">
                            <div className="stat-lbl">Inactive Accounts</div>
                            <div className="stat-val" style={{ color: '#f87171' }}>{users.filter(u => !getUserActiveStatus(u)).length}</div>
                            <div className="stat-sub">Deactivated</div>
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="card" style={{ overflow: 'hidden', marginBottom: '18px', display: 'none' }}
                        ref={el => { if (el) el.style.display = window.innerWidth >= 1280 ? 'block' : 'none'; }}>
                    </div>
                    <div style={{ display: 'none' }} className="xl-only" />

                    <div className="card tbl-wrap" style={{ display: 'block' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ display: 'none' }} className="desktop-tbl" />
                        </div>
                    </div>

                    {/* Desktop Table (xl) */}
                    <div className="card" style={{ overflow: 'hidden', marginBottom: '18px' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ display: 'table', width: '100%', borderCollapse: 'collapse', minWidth: '780px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                                        {['Name', 'University ID', 'Email', 'Role', 'Status', 'Change Role', 'Action'].map(h => (
                                            <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(244,244,246,.32)', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr><td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'rgba(244,244,246,.3)', fontSize: '13px' }}>No users found in the system.</td></tr>
                                    ) : users.map(user => {
                                        const active = getUserActiveStatus(user);
                                        return (
                                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,.05)', transition: 'background .15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.03)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <td style={{ padding: '13px 16px', fontWeight: 600, color: '#f4f4f6', fontSize: '13px' }}>{user.fullName}</td>
                                                <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontSize: '12.5px', color: 'rgba(244,244,246,.6)' }}>{user.universityId}</td>
                                                <td style={{ padding: '13px 16px', fontSize: '13px', color: 'rgba(244,244,246,.6)' }}>{user.email}</td>
                                                <td style={{ padding: '13px 16px' }}><span className={roleBadgeClass(user.role)}>{user.role}</span></td>
                                                <td style={{ padding: '13px 16px' }}>
                                                    <span className={`badge ${active ? 'badge-active' : 'badge-inactive'}`}>{active ? 'ACTIVE' : 'INACTIVE'}</span>
                                                </td>
                                                <td style={{ padding: '13px 16px' }}>
                                                    <select className="sel" value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}>
                                                        <option value="STUDENT">Student</option>
                                                        <option value="LECTURER">Lecturer</option>
                                                        <option value="ADMIN">Admin</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '13px 16px' }}>
                                                    <button
                                                        onClick={() => handleStatusToggle(user.id, active)}
                                                        className={`btn-activate ${active ? 'btn-deactivate' : 'btn-do-activate'}`}
                                                    >
                                                        {active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="mob-cards" style={{ marginTop: '0' }}>
                        {users.length === 0 ? (
                            <div className="empty">No users found in the system.</div>
                        ) : users.map(user => {
                            const active = getUserActiveStatus(user);
                            return (
                                <div key={`m-${user.id}`} className="card mob-card">
                                    <div className="mob-top">
                                        <div>
                                            <div className="mob-name">{user.fullName}</div>
                                            <div className="mob-email">{user.email}</div>
                                            <div className="mob-uid">{user.universityId}</div>
                                        </div>
                                        <div className="mob-badges">
                                            <span className={roleBadgeClass(user.role)}>{user.role}</span>
                                            <span className={`badge ${active ? 'badge-active' : 'badge-inactive'}`}>{active ? 'ACTIVE' : 'INACTIVE'}</span>
                                        </div>
                                    </div>
                                    <div className="mob-actions">
                                        <select className="mob-sel" value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}>
                                            <option value="STUDENT">Student</option>
                                            <option value="LECTURER">Lecturer</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                        <button
                                            onClick={() => handleStatusToggle(user.id, active)}
                                            className="mob-btn-activate"
                                            style={{
                                                background: active ? 'rgba(239,68,68,.12)' : 'rgba(52,211,153,.1)',
                                                color: active ? '#f87171' : '#6ee7b7',
                                                border: `1px solid ${active ? 'rgba(239,68,68,.2)' : 'rgba(52,211,153,.2)'}`,
                                                fontWeight: 600
                                            }}
                                        >
                                            {active ? 'Deactivate' : 'Activate Account'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUserManagement;