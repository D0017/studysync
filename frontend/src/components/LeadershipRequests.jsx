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
.stat-wrap { margin-bottom:20px; }
.stat-card { padding:20px 22px;display:inline-block;min-width:180px; }
.stat-lbl { font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:rgba(244,244,246,.35);margin-bottom:10px; }
.stat-val { font-size:36px;font-weight:800;letter-spacing:-.03em;line-height:1; }
.stat-sub { font-size:11px;color:rgba(244,244,246,.3);margin-top:6px; }
.sec-wrap { padding:24px 26px; }
.sec-title { font-size:18px;font-weight:800;color:#f4f4f6;letter-spacing:-.02em;margin-bottom:4px; }
.sec-sub   { font-size:12px;color:rgba(244,244,246,.38);margin-bottom:18px; }
.req-grid { display:grid;grid-template-columns:1fr;gap:12px; }
@media(min-width:640px){ .req-grid { grid-template-columns:1fr 1fr; } }
.req-card { border-radius:16px;overflow:hidden;transition:border-color .2s,transform .2s; }
.req-card:hover { border-color:rgba(255,106,0,.25);transform:translateY(-1px); }
.req-bar  { height:3px;background:linear-gradient(90deg,#f59e0b,#f97316); }
.req-body { padding:20px 22px; }
.req-top  { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px; }
.req-name { font-size:17px;font-weight:800;color:#f4f4f6;letter-spacing:-.02em; }
.req-sub  { font-size:12px;color:rgba(244,244,246,.38);margin-top:3px; }
.badge-pending { display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;
    background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.2);color:#fcd34d; }
.req-info { display:flex;flex-direction:column;gap:7px;margin-bottom:16px; }
.req-row  { font-size:12.5px;color:rgba(244,244,246,.44); }
.req-row strong { color:#f4f4f6;font-weight:600; }
.btn-approve {
    width:100%;padding:11px;
    background:linear-gradient(135deg,#059669,#10b981);
    border:none;border-radius:10px;color:#fff;
    font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
    box-shadow:0 3px 12px rgba(16,185,129,.2);transition:all .18s;
}
.btn-approve:hover { transform:translateY(-1px);box-shadow:0 5px 18px rgba(16,185,129,.3); }
.empty {
    background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.08);
    border-radius:14px;padding:40px;text-align:center;
    font-size:13px;color:rgba(244,244,246,.3);
}
`;

const LeadershipRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            const response = await axios.get('/api/admin/leadership-requests');
            setRequests(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch leadership requests:', error);
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to load leadership requests.') });
            setRequests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    const handleApprove = async (groupId) => {
        setMessage({ type: '', text: '' });
        try {
            const response = await axios.post(`/api/admin/leadership-requests/${groupId}/approve`);
            setMessage({ type: 'success', text: response.data });
            await fetchRequests();
        } catch (error) {
            console.error('Approval failed:', error);
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to approve leadership request.') });
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
                        <h2 className="hero-title">Leadership Requests</h2>
                        <p className="hero-desc">Review and approve students who requested to become group leaders.</p>
                    </div>
                    <button onClick={fetchRequests} className="btn-primary">Refresh Requests</button>
                </div>
            </div>

            {message.text && <div className={`msg ${message.type}`}>{message.text}</div>}

            {/* Stat */}
            <div className="stat-wrap">
                <div className="card stat-card">
                    <div className="stat-lbl">Pending Requests</div>
                    <div className="stat-val" style={{ color: '#fbbf24' }}>{loading ? '—' : requests.length}</div>
                    <div className="stat-sub">Awaiting approval</div>
                </div>
            </div>

            {/* Requests */}
            <div className="card sec-wrap">
                <div className="sec-title">Pending Approvals</div>
                <div className="sec-sub">Approve the student who should officially become the leader of the group.</div>

                {loading ? (
                    <div className="empty">Loading leadership requests…</div>
                ) : requests.length === 0 ? (
                    <div className="empty">No pending leadership requests found.</div>
                ) : (
                    <div className="req-grid">
                        {requests.map(request => (
                            <div key={request.groupId} className="card req-card">
                                <div className="req-bar" />
                                <div className="req-body">
                                    <div className="req-top">
                                        <div>
                                            <div className="req-name">{request.groupName}</div>
                                            <div className="req-sub">Group leadership request</div>
                                        </div>
                                        <span className="badge-pending">Pending</span>
                                    </div>
                                    <div className="req-info">
                                        <div className="req-row"><strong>Module:</strong> {request.moduleCode} — {request.moduleName}</div>
                                        <div className="req-row"><strong>Requested by:</strong> {request.requesterName}</div>
                                        <div className="req-row"><strong>University ID:</strong> {request.requesterUniversityId}</div>
                                        <div className="req-row"><strong>Members:</strong> {request.currentMemberCount} / {request.maxCapacity}</div>
                                    </div>
                                    <button onClick={() => handleApprove(request.groupId)} className="btn-approve">
                                        Approve as Leader
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

export default LeadershipRequests;