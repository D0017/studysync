import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
.hero-title { font-size:clamp(20px,2.8vw,30px);font-weight:800;color:#f4f4f6;letter-spacing:-.03em;margin-bottom:8px; }
.hero-desc  { font-size:13px;color:rgba(244,244,246,.44);line-height:1.8; }
.btn-row { display:flex;gap:10px;flex-wrap:wrap; }
.btn-primary {
    padding:10px 20px;background:linear-gradient(135deg,#ff6a00,#ff8533);
    border:none;border-radius:10px;color:#fff;
    font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
    box-shadow:0 4px 14px rgba(255,106,0,.28);transition:all .18s;
}
.btn-primary:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,106,0,.38); }
.btn-primary:disabled { opacity:.5;cursor:not-allowed;transform:none; }
.btn-ghost {
    padding:10px 18px;background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.1);border-radius:10px;
    color:rgba(244,244,246,.62);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .18s;
}
.btn-ghost:hover { background:rgba(255,255,255,.09);color:#f4f4f6; }
.btn-violet {
    padding:10px 22px;
    background:linear-gradient(135deg,#7c3aed,#a855f7);
    border:none;border-radius:10px;color:#fff;
    font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
    box-shadow:0 4px 14px rgba(124,58,237,.25);transition:all .18s;
}
.btn-violet:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(124,58,237,.35); }
.btn-violet:disabled { opacity:.5;cursor:not-allowed;transform:none; }
.btn-green {
    padding:10px 22px;
    background:linear-gradient(135deg,#059669,#10b981);
    border:none;border-radius:10px;color:#fff;
    font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
    box-shadow:0 4px 14px rgba(16,185,129,.22);transition:all .18s;
}
.btn-green:hover { transform:translateY(-1px);box-shadow:0 6px 18px rgba(16,185,129,.32); }
.msg { border-radius:12px;padding:12px 16px;font-size:13px;font-weight:500;margin-bottom:18px; }
.msg.error   { background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);color:#fca5a5; }
.msg.success { background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.18);color:#6ee7b7; }
.stat-grid { display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:20px; }
@media(min-width:640px){ .stat-grid { grid-template-columns:1fr 1fr 1fr; } }
.stat-card { padding:20px 22px; }
.stat-lbl { font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:rgba(244,244,246,.35);margin-bottom:10px; }
.stat-val { font-size:28px;font-weight:800;letter-spacing:-.02em;line-height:1; }
.sec-wrap { padding:24px 26px;margin-bottom:18px; }
.sec-title { font-size:17px;font-weight:800;color:#f4f4f6;letter-spacing:-.02em;margin-bottom:4px; }
.sec-sub   { font-size:12px;color:rgba(244,244,246,.35);margin-bottom:18px; }
.form-label { display:block;font-size:12.5px;font-weight:600;color:rgba(244,244,246,.7);margin-bottom:7px; }
.form-input {
    width:100%;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.1);
    border-radius:10px;
    padding:10px 14px;
    color:#f4f4f6;
    font-family:inherit;font-size:13.5px;
    outline:none;transition:border-color .18s,box-shadow .18s;
}
.form-input:focus { border-color:rgba(255,106,0,.5);box-shadow:0 0 0 3px rgba(255,106,0,.1); }
.form-input option { background:#1e1e22;color:#f4f4f6; }
.form-helper { font-size:12px;color:rgba(244,244,246,.38);margin-top:6px; }
.form-grid-2 { display:grid;grid-template-columns:1fr;gap:14px; }
@media(min-width:640px){ .form-grid-2 { grid-template-columns:1fr auto; } }
.form-grid-3 { display:grid;grid-template-columns:1fr;gap:14px; }
@media(min-width:640px){ .form-grid-3 { grid-template-columns:1fr 1fr auto; } }
.group-grid { display:grid;grid-template-columns:1fr;gap:12px; }
@media(min-width:640px){ .group-grid { grid-template-columns:1fr 1fr; } }
.grp-card { border-radius:16px;overflow:hidden; }
.grp-bar  { height:3px;background:linear-gradient(90deg,#34d399,#06b6d4); }
.grp-body { padding:18px 20px; }
.grp-top  { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px; }
.grp-name { font-size:17px;font-weight:800;color:#f4f4f6;letter-spacing:-.02em; }
.grp-count{ font-size:12px;color:rgba(244,244,246,.42);margin-top:3px; }
.badge { display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap; }
.badge-green  { background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);color:#6ee7b7; }
.badge-amber  { background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.2);color:#fcd34d; }
.badge-gray   { background:rgba(148,163,184,.1);border:1px solid rgba(148,163,184,.15);color:#94a3b8; }
.member-list  { display:flex;flex-direction:column;gap:6px;margin-top:8px; }
.member-item  {
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
    border-radius:9px;padding:8px 12px;
    font-size:12.5px;color:rgba(244,244,246,.7);
}
.grp-meta { display:flex;flex-direction:column;gap:5px;margin-top:12px; }
.grp-meta-row { font-size:12px;color:rgba(244,244,246,.42); }
.grp-meta-row strong { color:rgba(244,244,246,.8);font-weight:600; }
.grp-sub-title { font-size:12px;font-weight:700;color:rgba(244,244,246,.6);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px; }
.empty {
    background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.08);
    border-radius:14px;padding:36px;text-align:center;
    font-size:13px;color:rgba(244,244,246,.3);
}
`;

const AdminModuleDetails = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();

    const [moduleData, setModuleData] = useState(null);
    const [groups, setGroups] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningLecturer, setAssigningLecturer] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedLecturerId, setSelectedLecturerId] = useState('');
    const [groupForm, setGroupForm] = useState({ numberOfGroups: 1, maxCapacity: 5 });

    const fetchPageData = useCallback(async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            const [moduleRes, groupsRes, lecturersRes] = await Promise.all([
                axios.get(`/api/admin/modules/${moduleId}`),
                axios.get(`/api/groups/modules/${moduleId}/all`),
                axios.get('/api/admin/lecturers'),
            ]);
            const module = moduleRes.data;
            setModuleData(module);
            setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
            setLecturers(Array.isArray(lecturersRes.data) ? lecturersRes.data : []);
            setSelectedLecturerId(module?.lecturer?.id ? String(module.lecturer.id) : '');
        } catch (error) {
            console.error('Failed to load module details:', error);
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to load module details.') });
            setGroups([]); setLecturers([]); setModuleData(null);
        } finally {
            setLoading(false);
        }
    }, [moduleId]);

    useEffect(() => { fetchPageData(); }, [fetchPageData]);

    const handleGroupFormChange = (e) => {
        const { name, value } = e.target;
        setGroupForm(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleCreateMoreGroups = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        if (groupForm.numberOfGroups <= 0) { setMessage({ type: 'error', text: 'Number of groups must be greater than 0.' }); return; }
        if (groupForm.maxCapacity <= 0)    { setMessage({ type: 'error', text: 'Max capacity must be greater than 0.' }); return; }
        try {
            const response = await axios.post(`/api/admin/modules/${moduleId}/groups`, groupForm);
            setMessage({ type: 'success', text: response.data });
            setGroupForm({ numberOfGroups: 1, maxCapacity: 5 });
            await fetchPageData();
        } catch (error) {
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to create additional groups.') });
        }
    };

    const handleAssignLecturer = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            setAssigningLecturer(true);
            const response = await axios.put(`/api/admin/modules/${moduleId}/lecturer`, {
                lecturerId: selectedLecturerId ? Number(selectedLecturerId) : null,
            });
            const updatedModule = response.data;
            setModuleData(updatedModule);
            setSelectedLecturerId(updatedModule?.lecturer?.id ? String(updatedModule.lecturer.id) : '');
            setMessage({
                type: 'success',
                text: updatedModule?.lecturer
                    ? `Lecturer assigned successfully to ${updatedModule.moduleCode}.`
                    : `Lecturer removed successfully from ${updatedModule.moduleCode}.`,
            });
        } catch (error) {
            setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to assign lecturer.') });
        } finally {
            setAssigningLecturer(false);
        }
    };

    const memberCount = (group) => Array.isArray(group.currentMembers) ? group.currentMembers.length : 0;

    return (
        <div className="pg">
            <style>{S}</style>

            {/* Hero */}
            <div className="hero">
                <div className="hero-row">
                    <div>
                        <div className="hero-tag">Admin Management</div>
                        <h2 className="hero-title">
                            {moduleData ? `${moduleData.moduleCode} — ${moduleData.moduleName}` : 'Module Details'}
                        </h2>
                        <p className="hero-desc">Assign one lecturer to this module and manage its group structure.</p>
                    </div>
                    <div className="btn-row">
                        <button onClick={() => navigate('/admin/modules')} className="btn-ghost">← Back to Modules</button>
                        <button onClick={fetchPageData} className="btn-primary">Refresh</button>
                    </div>
                </div>
            </div>

            {message.text && <div className={`msg ${message.type}`}>{message.text}</div>}

            {/* Module Info Stats */}
            {moduleData && (
                <div className="stat-grid">
                    <div className="card stat-card">
                        <div className="stat-lbl">Module Code</div>
                        <div className="stat-val" style={{ color: '#ff7a1a' }}>{moduleData.moduleCode}</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-lbl">Semester</div>
                        <div className="stat-val" style={{ color: '#34d399' }}>{moduleData.semester}</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-lbl">Assigned Lecturer</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: moduleData.lecturer ? '#f4f4f6' : 'rgba(244,244,246,.3)', marginTop: '8px' }}>
                            {moduleData.lecturer ? moduleData.lecturer.fullName : 'Not assigned'}
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Lecturer */}
            <div className="card sec-wrap">
                <div className="sec-title">Assign Lecturer</div>
                <div className="sec-sub">One lecturer can be assigned to this module. You can change or remove the assignment later.</div>
                <form onSubmit={handleAssignLecturer}>
                    <div className="form-grid-2">
                        <div>
                            <label className="form-label">Select Lecturer</label>
                            <select
                                className="form-input"
                                value={selectedLecturerId}
                                onChange={e => setSelectedLecturerId(e.target.value)}
                            >
                                <option value="">— No Lecturer Assigned —</option>
                                {lecturers.map(lecturer => (
                                    <option key={lecturer.id} value={lecturer.id}>
                                        {lecturer.fullName} ({lecturer.universityId})
                                    </option>
                                ))}
                            </select>
                            {moduleData?.lecturer && (
                                <p className="form-helper">
                                    Current: <strong style={{ color: '#f4f4f6' }}>{moduleData.lecturer.fullName}</strong> ({moduleData.lecturer.email})
                                </p>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" disabled={assigningLecturer} className="btn-violet" style={{ whiteSpace: 'nowrap' }}>
                                {assigningLecturer ? 'Saving…' : 'Save Lecturer'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Create More Groups */}
            <div className="card sec-wrap">
                <div className="sec-title">Create More Groups</div>
                <div className="sec-sub">Add additional empty groups to this module whenever needed.</div>
                <form onSubmit={handleCreateMoreGroups}>
                    <div className="form-grid-3">
                        <div>
                            <label className="form-label">Number of Groups</label>
                            <input
                                type="number" name="numberOfGroups" min="1"
                                value={groupForm.numberOfGroups}
                                onChange={handleGroupFormChange}
                                className="form-input" required
                            />
                        </div>
                        <div>
                            <label className="form-label">Max Capacity</label>
                            <input
                                type="number" name="maxCapacity" min="1"
                                value={groupForm.maxCapacity}
                                onChange={handleGroupFormChange}
                                className="form-input" required
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                Add Groups
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Existing Groups */}
            <div className="card sec-wrap">
                <div className="sec-title">Existing Groups</div>
                <div className="sec-sub">Current groups created under this module.</div>

                {loading ? (
                    <div className="empty">Loading groups…</div>
                ) : groups.length === 0 ? (
                    <div className="empty">No groups found for this module yet.</div>
                ) : (
                    <div className="group-grid">
                        {groups.map(group => (
                            <div key={group.id} className="card grp-card">
                                <div className="grp-bar" />
                                <div className="grp-body">
                                    <div className="grp-top">
                                        <div>
                                            <div className="grp-name">{group.groupName}</div>
                                            <div className="grp-count">Members: {memberCount(group)} / {group.maxCapacity}</div>
                                        </div>
                                        {group.leader ? (
                                            <span className="badge badge-green">Leader Assigned</span>
                                        ) : group.requestedLeader ? (
                                            <span className="badge badge-amber">Leader Pending</span>
                                        ) : (
                                            <span className="badge badge-gray">No Leader</span>
                                        )}
                                    </div>

                                    <div className="grp-sub-title">Current Members</div>
                                    {Array.isArray(group.currentMembers) && group.currentMembers.length > 0 ? (
                                        <div className="member-list">
                                            {group.currentMembers.map(member => (
                                                <div key={member.id} className="member-item">
                                                    {member.fullName} ({member.universityId})
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ fontSize: '12.5px', color: 'rgba(244,244,246,.3)', marginTop: '4px' }}>No members yet.</p>
                                    )}

                                    {(group.leader || (group.requestedLeader && !group.leader)) && (
                                        <div className="grp-meta">
                                            {group.leader && (
                                                <div className="grp-meta-row">
                                                    <strong>Leader:</strong> {group.leader.fullName} ({group.leader.universityId})
                                                </div>
                                            )}
                                            {group.requestedLeader && !group.leader && (
                                                <div className="grp-meta-row">
                                                    <strong>Pending Request:</strong> {group.requestedLeader.fullName} ({group.requestedLeader.universityId})
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminModuleDetails;