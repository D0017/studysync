import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return fallback;
};

const S = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pg {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #f4f4f6;
}

.card {
    background: linear-gradient(135deg, #1f1f23 0%, #18181b 100%);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.16);
}

.hero {
    background: linear-gradient(135deg, #1f1f23 0%, #18181b 62%, #1d1a15 100%);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 22px;
    padding: 34px 38px;
    margin-bottom: 22px;
    position: relative;
    overflow: hidden;
}

.hero::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, rgba(255,106,0,0.38), transparent 55%);
}

.hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,106,0,0.10), transparent 70%);
    pointer-events: none;
}

.hero-row {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 1;
}

@media(min-width:768px){
    .hero-row {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,106,0,0.10);
    border: 1px solid rgba(255,106,0,0.20);
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 600;
    color: #ff8a33;
    letter-spacing: .04em;
    margin-bottom: 12px;
}

.hero-title {
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 800;
    color: #f4f4f6;
    letter-spacing: -.03em;
    margin-bottom: 8px;
}

.hero-desc {
    font-size: 13px;
    color: rgba(244,244,246,.46);
    line-height: 1.8;
    max-width: 620px;
}

.btn-primary {
    padding: 10px 20px;
    background: linear-gradient(135deg, #ff6a00, #ff8533);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(255,106,0,.28);
    transition: all .18s;
    white-space: nowrap;
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255,106,0,.38);
}

.msg {
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 18px;
}

.msg.error {
    background: rgba(239,68,68,.08);
    border: 1px solid rgba(239,68,68,.18);
    color: #fca5a5;
}

.msg.success {
    background: rgba(52,211,153,.08);
    border: 1px solid rgba(52,211,153,.18);
    color: #6ee7b7;
}

.stat-grid3 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
}

@media(min-width:640px){
    .stat-grid3 {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

.stat-card {
    padding: 22px 24px;
}

.stat-lbl {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: rgba(244,244,246,.35);
    margin-bottom: 10px;
}

.stat-val {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -.03em;
    line-height: 1;
}

.stat-sub {
    font-size: 11px;
    color: rgba(244,244,246,.30);
    margin-top: 6px;
}

.table-card {
    padding: 24px 26px;
}

.sec-title {
    font-size: 18px;
    font-weight: 800;
    color: #f4f4f6;
    letter-spacing: -.02em;
    margin-bottom: 4px;
}

.sec-sub {
    font-size: 12px;
    color: rgba(244,244,246,.38);
    margin-bottom: 18px;
}

.tbl-wrap {
    overflow-x: auto;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
}

table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
}

thead tr {
    background: rgba(255,255,255,.04);
    border-bottom: 1px solid rgba(255,255,255,.07);
}

thead th {
    padding: 14px 16px;
    text-align: left;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .10em;
    text-transform: uppercase;
    color: rgba(244,244,246,.35);
    white-space: nowrap;
}

tbody tr {
    border-bottom: 1px solid rgba(255,255,255,.05);
    transition: background .15s ease;
}

tbody tr:last-child {
    border-bottom: none;
}

tbody tr:hover {
    background: rgba(255,255,255,.03);
}

tbody td {
    padding: 15px 16px;
    font-size: 13px;
    color: rgba(244,244,246,.76);
    vertical-align: middle;
}

.user-name {
    font-weight: 700;
    color: #f4f4f6;
    letter-spacing: -.01em;
}

.user-id {
    font-family: monospace;
    color: rgba(244,244,246,.58);
}

.badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
}

.badge-admin {
    background: rgba(168,85,247,.12);
    border: 1px solid rgba(168,85,247,.22);
    color: #c4b5fd;
}

.badge-lect {
    background: rgba(59,130,246,.12);
    border: 1px solid rgba(59,130,246,.20);
    color: #93c5fd;
}

.badge-student {
    background: rgba(52,211,153,.10);
    border: 1px solid rgba(52,211,153,.20);
    color: #6ee7b7;
}

.badge-active {
    background: rgba(52,211,153,.10);
    border: 1px solid rgba(52,211,153,.20);
    color: #6ee7b7;
}

.badge-inactive {
    background: rgba(239,68,68,.10);
    border: 1px solid rgba(239,68,68,.18);
    color: #fca5a5;
}

.action-cell {
    min-width: 130px;
}

.btn-activate {
    padding: 8px 14px;
    border: none;
    border-radius: 10px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all .18s;
    white-space: nowrap;
}

.btn-deactivate {
    background: rgba(239,68,68,.12);
    color: #f87171;
    border: 1px solid rgba(239,68,68,.20);
}

.btn-deactivate:hover {
    background: rgba(239,68,68,.20);
}

.btn-do-activate {
    background: rgba(52,211,153,.10);
    color: #6ee7b7;
    border: 1px solid rgba(52,211,153,.20);
}

.btn-do-activate:hover {
    background: rgba(52,211,153,.18);
}

.empty {
    padding: 38px;
    text-align: center;
    color: rgba(244,244,246,.30);
    font-size: 13px;
}

.table-note {
    margin-top: 12px;
    font-size: 11.5px;
    color: rgba(244,244,246,.28);
}
`;

const roleBadgeClass = (role) => {
    if (role === 'ADMIN') return 'badge badge-admin';
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
            const errorText = getErrorMessage(error, 'Could not load users.');
            setMessage({ type: 'error', text: errorText });
            toast.error(errorText);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const getUserActiveStatus = (user) => {
        if (typeof user.active === 'boolean') return user.active;
        if (typeof user.isActive === 'boolean') return user.isActive;
        return false;
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            await axios.put(`/api/users/${userId}/status`, { active: !currentStatus });
            const successText = `User ${currentStatus ? 'deactivated' : 'activated'} successfully.`;
            setMessage({ type: 'success', text: successText });
            toast.success(successText);
            await fetchUsers();
        } catch (error) {
            const errorText = getErrorMessage(error, 'Failed to update user status.');
            setMessage({ type: 'error', text: errorText });
            toast.error(errorText);
        }
    };

    return (
        <div className="pg">
            <style>{S}</style>

            <div className="hero">
                <div className="hero-row">
                    <div>
                        <div className="hero-tag">Admin Management</div>
                        <h2 className="hero-title">User Management</h2>
                        <p className="hero-desc">
                            View all registered users and control account access from one clean management table.
                        </p>
                    </div>
                    <button onClick={fetchUsers} className="btn-primary">
                        Refresh List
                    </button>
                </div>
            </div>

            {message.text && <div className={`msg ${message.type}`}>{message.text}</div>}

            {loading && users.length === 0 ? (
                <div
                    className="card"
                    style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: 'rgba(244,244,246,.4)',
                        fontSize: '13px'
                    }}
                >
                    Loading users…
                </div>
            ) : (
                <>
                    <div className="stat-grid3">
                        <div className="card stat-card">
                            <div className="stat-lbl">Total Users</div>
                            <div className="stat-val" style={{ color: '#ff7a1a' }}>{users.length}</div>
                            <div className="stat-sub">Registered accounts</div>
                        </div>

                        <div className="card stat-card">
                            <div className="stat-lbl">Active Accounts</div>
                            <div className="stat-val" style={{ color: '#34d399' }}>
                                {users.filter((u) => getUserActiveStatus(u)).length}
                            </div>
                            <div className="stat-sub">Currently active</div>
                        </div>

                        <div className="card stat-card">
                            <div className="stat-lbl">Inactive Accounts</div>
                            <div className="stat-val" style={{ color: '#f87171' }}>
                                {users.filter((u) => !getUserActiveStatus(u)).length}
                            </div>
                            <div className="stat-sub">Deactivated</div>
                        </div>
                    </div>

                    <div className="card table-card">
                        <div className="sec-title">Registered Users</div>
                        <div className="sec-sub">
                        </div>

                        <div className="tbl-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        {['Name', 'University ID', 'Email', 'Role', 'Status', 'Action'].map((h) => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="empty">
                                                No users found in the system.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => {
                                            const active = getUserActiveStatus(user);

                                            return (
                                                <tr key={user.id}>
                                                    <td className="user-name">{user.fullName}</td>
                                                    <td className="user-id">{user.universityId}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={roleBadgeClass(user.role)}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${active ? 'badge-active' : 'badge-inactive'}`}>
                                                            {active ? 'ACTIVE' : 'INACTIVE'}
                                                        </span>
                                                    </td>
                                                    <td className="action-cell">
                                                        <button
                                                            onClick={() => handleStatusToggle(user.id, active)}
                                                            className={`btn-activate ${active ? 'btn-deactivate' : 'btn-do-activate'}`}
                                                        >
                                                            {active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUserManagement;