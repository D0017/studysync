import React, { useState } from 'react';
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
.hero-title { font-size:clamp(22px,3vw,32px);font-weight:800;color:#f4f4f6;letter-spacing:-.03em;margin-bottom:8px; }
.hero-desc  { font-size:13px;color:rgba(244,244,246,.44);line-height:1.8; }
.msg { border-radius:12px;padding:12px 16px;font-size:13px;font-weight:500;margin-bottom:18px; }
.msg.error   { background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);color:#fca5a5; }
.msg.success { background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.18);color:#6ee7b7; }
.form-card { padding:28px 30px; }
.form-section-title {
    font-size:14px;font-weight:800;color:#f4f4f6;letter-spacing:-.01em;
    margin-bottom:16px;display:flex;align-items:center;gap:10px;
}
.form-section-badge {
    display:inline-flex;align-items:center;justify-content:center;
    width:22px;height:22px;border-radius:6px;
    background:rgba(255,106,0,0.15);border:1px solid rgba(255,106,0,.25);
    font-size:11px;font-weight:800;color:#ff7a1a;flex-shrink:0;
}
.form-divider { border:none;border-top:1px solid rgba(255,255,255,.07);margin:24px 0; }
.grid-2 { display:grid;grid-template-columns:1fr;gap:14px; }
@media(min-width:640px){ .grid-2 { grid-template-columns:1fr 1fr; } }
.grid-3 { display:grid;grid-template-columns:1fr;gap:14px; }
@media(min-width:640px){ .grid-3 { grid-template-columns:1fr 1fr 1fr; } }
.form-field { display:flex;flex-direction:column; }
.form-label {
    font-size:12px;font-weight:600;color:rgba(244,244,246,.6);
    margin-bottom:7px;letter-spacing:.01em;
}
.form-input {
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.1);
    border-radius:10px;padding:11px 14px;
    color:#f4f4f6;font-family:inherit;font-size:13.5px;
    outline:none;transition:border-color .18s,box-shadow .18s;
    width:100%;
}
.form-input::placeholder { color:rgba(244,244,246,.22); }
.form-input:focus {
    border-color:rgba(255,106,0,.5);
    box-shadow:0 0 0 3px rgba(255,106,0,.1);
}
.btn-row { display:flex;flex-direction:column;gap:10px;margin-top:8px; }
@media(min-width:480px){ .btn-row { flex-direction:row; } }
.btn-submit {
    padding:12px 24px;
    background:linear-gradient(135deg,#ff6a00,#ff8533);
    border:none;border-radius:10px;color:#fff;
    font-family:inherit;font-size:13.5px;font-weight:700;cursor:pointer;
    box-shadow:0 4px 16px rgba(255,106,0,.28);transition:all .18s;
}
.btn-submit:hover { transform:translateY(-1px);box-shadow:0 6px 22px rgba(255,106,0,.38); }
.btn-submit:disabled { opacity:.5;cursor:not-allowed;transform:none; }
.btn-reset {
    padding:12px 22px;
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
    border-radius:10px;color:rgba(244,244,246,.6);
    font-family:inherit;font-size:13.5px;font-weight:500;cursor:pointer;transition:all .18s;
}
.btn-reset:hover { background:rgba(255,255,255,.09);color:#f4f4f6; }
.btn-reset:disabled { opacity:.4;cursor:not-allowed; }
`;

const CreateModule = () => {
    const [moduleData, setModuleData] = useState({ moduleCode: '', moduleName: '', year: 1, semester: 1, enrollmentKey: '' });
    const [groupData, setGroupData] = useState({ numberOfGroups: 1, maxCapacity: 5 });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleModuleChange = (e) => {
        const { name, value } = e.target;
        setModuleData(prev => ({ ...prev, [name]: (name === 'year' || name === 'semester') ? Number(value) : value }));
    };

    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        setGroupData(prev => ({ ...prev, [name]: Number(value) }));
    };

    const validateForm = () => {
        if (!moduleData.moduleCode.trim())   return 'Module code is required.';
        if (!moduleData.moduleName.trim())   return 'Module name is required.';
        if (!moduleData.enrollmentKey.trim()) return 'Enrollment key is required.';
        if (moduleData.year <= 0)            return 'Year must be greater than 0.';
        if (moduleData.semester <= 0)        return 'Semester must be greater than 0.';
        if (groupData.numberOfGroups <= 0)   return 'Number of groups must be greater than 0.';
        if (groupData.maxCapacity <= 0)      return 'Max capacity must be greater than 0.';
        return null;
    };

    const resetForm = () => {
        setModuleData({ moduleCode: '', moduleName: '', year: 1, semester: 1, enrollmentKey: '' });
        setGroupData({ numberOfGroups: 1, maxCapacity: 5 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        const err = validateForm();
        if (err) { setMessage({ type: 'error', text: err }); return; }
        try {
            setLoading(true);
            const moduleResponse = await axios.post('/api/admin/modules', moduleData);
            const createdModule = moduleResponse.data;
            const groupsResponse = await axios.post(`/api/admin/modules/${createdModule.id}/groups`, groupData);
            setMessage({ type: 'success', text: `${createdModule.moduleCode} created successfully. ${groupsResponse.data}` });
            resetForm();
        } catch (error) {
            console.error('Create module/groups failed:', error);
            setMessage({ type: 'error', text: getErrorMessage(error, 'Something went wrong while creating module and groups.') });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pg">
            <style>{S}</style>

            {/* Hero */}
            <div className="hero">
                <div className="hero-tag">Admin Management</div>
                <h2 className="hero-title">Create Module</h2>
                <p className="hero-desc">Create a module first, then generate empty groups for students to join.</p>
            </div>

            {message.text && <div className={`msg ${message.type}`}>{message.text}</div>}

            {/* Form */}
            <div className="card form-card">
                <form onSubmit={handleSubmit}>
                    {/* Module Details */}
                    <div className="form-section-title">
                        <span className="form-section-badge">1</span>
                        Module Details
                    </div>

                    <div className="grid-2" style={{ marginBottom: '14px' }}>
                        <div className="form-field">
                            <label className="form-label">Module Code</label>
                            <input type="text" name="moduleCode" value={moduleData.moduleCode}
                                onChange={handleModuleChange} placeholder="e.g. IT3040"
                                className="form-input" required />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Module Name</label>
                            <input type="text" name="moduleName" value={moduleData.moduleName}
                                onChange={handleModuleChange} placeholder="e.g. Software Engineering"
                                className="form-input" required />
                        </div>
                    </div>

                    <div className="grid-3">
                        <div className="form-field">
                            <label className="form-label">Year</label>
                            <input type="number" name="year" min="1" value={moduleData.year}
                                onChange={handleModuleChange} className="form-input" required />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Semester</label>
                            <input type="number" name="semester" min="1" value={moduleData.semester}
                                onChange={handleModuleChange} className="form-input" required />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Enrollment Key</label>
                            <input type="text" name="enrollmentKey" value={moduleData.enrollmentKey}
                                onChange={handleModuleChange} placeholder="e.g. MATH2026"
                                className="form-input" required />
                        </div>
                    </div>

                    <hr className="form-divider" />

                    {/* Group Settings */}
                    <div className="form-section-title">
                        <span className="form-section-badge">2</span>
                        Group Settings
                    </div>

                    <div className="grid-2">
                        <div className="form-field">
                            <label className="form-label">Number of Groups</label>
                            <input type="number" name="numberOfGroups" min="1" value={groupData.numberOfGroups}
                                onChange={handleGroupChange} className="form-input" required />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Max Capacity Per Group</label>
                            <input type="number" name="maxCapacity" min="1" value={groupData.maxCapacity}
                                onChange={handleGroupChange} className="form-input" required />
                        </div>
                    </div>

                    <hr className="form-divider" />

                    {/* Actions */}
                    <div className="btn-row">
                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? 'Creating…' : 'Create Module & Groups'}
                        </button>
                        <button type="button" onClick={resetForm} disabled={loading} className="btn-reset">
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateModule;