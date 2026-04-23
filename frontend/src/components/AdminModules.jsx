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

const S = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.pg { font-family:'Plus Jakarta Sans',sans-serif; color:#f4f4f6; }
.card {
    background:linear-gradient(135deg,#1e1e22 0%,#18181b 100%);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:18px;
}
.card:hover { border-color:rgba(255,255,255,0.13); }
.hero {
    background:linear-gradient(135deg,#1e1e22 0%,#18181b 60%,#1c1a14 100%);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:20px;
    padding:34px 38px;
    margin-bottom:22px;
    position:relative;
    overflow:hidden;
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
.hero-title { font-size:clamp(22px,3vw,32px);font-weight:800;color:#f4f4f6;letter-spacing:-.03em;margin-bottom:8px; }
.hero-desc  { font-size:13px;color:rgba(244,244,246,.44);line-height:1.8; }
.hero-row   { display:flex;flex-direction:column;gap:20px; }
@media(min-width:768px){ .hero-row { flex-direction:row;align-items:center;justify-content:space-between; } }
.btn-row { display:flex;gap:10px;flex-wrap:wrap; }
.btn-primary {
    padding:10px 20px;
    background:linear-gradient(135deg,#ff6a00,#ff8533);
    border:none;border-radius:10px;color:#fff;
    font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
    box-shadow:0 4px 14px rgba(255,106,0,0.28);transition:all .18s;
}
.btn-primary:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,106,0,.38); }
.btn-ghost {
    padding:10px 18px;background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.1);border-radius:10px;
    color:rgba(244,244,246,.62);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .18s;
}
.btn-ghost:hover { background:rgba(255,255,255,.09);color:#f4f4f6; }
.msg { border-radius:12px;padding:12px 16px;font-size:13px;font-weight:500;margin-bottom:18px; }
.msg.error   { background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);color:#fca5a5; }
.msg.success { background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.18);color:#6ee7b7; }
.stat-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px; }
.stat-card { padding:20px 22px; }
.stat-lbl { font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:rgba(244,244,246,.35);margin-bottom:10px; }
.stat-val { font-size:36px;font-weight:800;letter-spacing:-.03em;line-height:1; }
.stat-sub { font-size:11px;color:rgba(244,244,246,.3);margin-top:6px; }
.sec-wrap { padding:24px 26px; }
.sec-title { font-size:18px;font-weight:800;color:#f4f4f6;letter-spacing:-.02em;margin-bottom:4px; }
.sec-sub   { font-size:12px;color:rgba(244,244,246,.38);margin-bottom:18px; }
.mod-grid  { display:grid;grid-template-columns:1fr;gap:12px; }
@media(min-width:640px){ .mod-grid { grid-template-columns:1fr 1fr; } }
.mod-card  { border-radius:16px;overflow:hidden; }
.mod-bar   { height:3px;background:linear-gradient(90deg,#ff6a00,#ff8533); }
.mod-body  { padding:20px 22px; }
.mod-top   { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px; }
.mod-code  { font-size:18px;font-weight:800;color:#f4f4f6;letter-spacing:-.02em; }
.mod-name  { font-size:13px;color:rgba(244,244,246,.5);margin-top:3px; }
.badge {
    display:inline-block;padding:3px 10px;border-radius:20px;
    font-size:11px;font-weight:700;white-space:nowrap;
}
.badge-blue   { background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.2);color:#93c5fd; }
.badge-green  { background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);color:#6ee7b7; }
.badge-gray   { background:rgba(148,163,184,.1);border:1px solid rgba(148,163,184,.15);color:#94a3b8; }
.mod-info  { display:flex;flex-direction:column;gap:7px;margin-bottom:16px; }
.mod-row   { font-size:12.5px;color:rgba(244,244,246,.44); }
.mod-row strong { color:#f4f4f6;font-weight:600; }
.btn-manage {
    width:100%;padding:10px;
    background:linear-gradient(135deg,#ff6a00,#ff8533);
    border:none;border-radius:10px;color:#fff;
    font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
    box-shadow:0 3px 12px rgba(255,106,0,.22);transition:all .18s;
}
.btn-manage:hover { transform:translateY(-1px);box-shadow:0 5px 18px rgba(255,106,0,.32); }
.empty {
    background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.08);
    border-radius:14px;padding:40px;text-align:center;
    font-size:13px;color:rgba(244,244,246,.3);
}
`;

const AdminModules = () => {
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchModules = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            const response = await axios.get('/api/admin/modules');
            setModules(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to load modules.') });
            setModules([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchModules(); }, [fetchModules]);

    return (
        <div className="pg">
            <style>{S}</style>

            {/* Hero */}
            <div className="hero">
                <div className="hero-row">
                    <div>
                        <div className="hero-tag">Admin Management</div>
                        <h2 className="hero-title">Module Management</h2>
                        <p className="hero-desc">View created modules, inspect groups, and assign lecturers.</p>
                    </div>
                    <div className="btn-row">
                        <button onClick={() => navigate('/admin/create-module')} className="btn-primary">+ Create Module</button>
                        <button onClick={fetchModules} className="btn-ghost">Refresh</button>
                    </div>
                </div>
            </div>

            {message.text && <div className={`msg ${message.type}`}>{message.text}</div>}

            {/* Stats */}
            <div className="stat-grid">
                <div className="card stat-card">
                    <div className="stat-lbl">Total Modules</div>
                    <div className="stat-val" style={{ color: '#34d399' }}>{loading ? '—' : modules.length}</div>
                    <div className="stat-sub">In the system</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-lbl">Lecturer Assigned</div>
                    <div className="stat-val" style={{ color: '#ff7a1a' }}>{loading ? '—' : modules.filter(m => m.lecturer).length}</div>
                    <div className="stat-sub">Modules with lecturer</div>
                </div>
            </div>

            {/* Module list */}
            <div className="card sec-wrap">
                <div className="sec-title">Created Modules</div>
                <div className="sec-sub">All modules currently available in the system.</div>

                {loading ? (
                    <div className="empty">Loading modules...</div>
                ) : modules.length === 0 ? (
                    <div className="empty">No modules found yet.</div>
                ) : (
                    <div className="mod-grid">
                        {modules.map((module) => (
                            <div key={module.id} className="card mod-card">
                                <div className="mod-bar" />
                                <div className="mod-body">
                                    <div className="mod-top">
                                        <div>
                                            <div className="mod-code">{module.moduleCode}</div>
                                            <div className="mod-name">{module.moduleName}</div>
                                        </div>
                                        <span className="badge badge-blue">Year {module.year}</span>
                                    </div>
                                    <div className="mod-info">
                                        <div className="mod-row"><strong>Semester:</strong> {module.semester}</div>
                                        <div className="mod-row"><strong>Enrollment Key:</strong> {module.enrollmentKey}</div>
                                        <div className="mod-row">
                                            <strong>Assigned Lecturer:</strong>{' '}
                                            {module.lecturer
                                                ? `${module.lecturer.fullName} (${module.lecturer.universityId})`
                                                : <span style={{ color: 'rgba(244,244,246,.3)' }}>Not assigned</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => navigate(`/admin/modules/${module.id}`)} className="btn-manage">
                                        Manage Module →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminModules;