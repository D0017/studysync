import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProjectForGroup, getProjectByGroup } from '../../services/projectService';
import { assignIssue, createIssue, deleteIssue, getIssuesByProject, updateIssueStatus } from '../../services/issueService';

const STATUS_COLUMNS = [
    { key: 'TODO', label: 'To Do' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'REVIEW', label: 'Review' },
    { key: 'DONE', label: 'Done' }
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const TYPES = ['TASK', 'BUG', 'STORY'];

const columnStyles = {
    TODO: {
        title: 'text-slate-100',
        badge: 'bg-slate-900/80 text-blue-300 border border-blue-500/30',
        card: 'border-orange-500/60 bg-gradient-to-br from-[#2b1d1a] to-[#1c1414]',
    },
    IN_PROGRESS: {
        title: 'text-slate-100',
        badge: 'bg-slate-900/80 text-blue-300 border border-blue-500/30',
        card: 'border-blue-500/60 bg-gradient-to-br from-[#162238] to-[#111827]',
    },
    REVIEW: {
        title: 'text-slate-100',
        badge: 'bg-slate-900/80 text-blue-300 border border-blue-500/30',
        card: 'border-red-500/60 bg-gradient-to-br from-[#2a1518] to-[#1a1114]',
    },
    DONE: {
        title: 'text-slate-100',
        badge: 'bg-slate-900/80 text-blue-300 border border-blue-500/30',
        card: 'border-emerald-500/60 bg-gradient-to-br from-[#14241d] to-[#101917]',
    }
};

const priorityStyles = {
    LOW: 'bg-slate-800 text-slate-300 border border-slate-600/70',
    MEDIUM: 'bg-blue-500/15 text-blue-300 border border-blue-500/40',
    HIGH: 'bg-orange-500/15 text-orange-300 border border-orange-500/40',
    URGENT: 'bg-red-500/15 text-red-300 border border-red-500/40'
};

const GroupProjectBoard = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [createProjectName, setCreateProjectName] = useState('');
    const [issueForm, setIssueForm] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        type: 'TASK',
        dueDate: '',
        assigneeId: ''
    });

    const members = project?.members || [];

    const loadProjectBoard = useCallback(async () => {
        if (!storedUser?.id) {
            setMessage({ type: 'error', text: 'User ID not found. Please login again.' });
            setLoading(false);
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const projectData = await getProjectByGroup(groupId, storedUser.id);
            setProject(projectData);

            const issuesData = await getIssuesByProject(projectData.id, storedUser.id);
            setIssues(Array.isArray(issuesData) ? issuesData : []);
        } catch (error) {
            setProject(null);
            setIssues([]);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Project board is not available yet.'
            });
        } finally {
            setLoading(false);
        }
    }, [groupId, storedUser?.id]);

    useEffect(() => {
        loadProjectBoard();
    }, [loadProjectBoard]);

    const groupedIssues = useMemo(() => {
        const groups = {
            TODO: [],
            IN_PROGRESS: [],
            REVIEW: [],
            DONE: []
        };
        issues.forEach((issue) => {
            if (groups[issue.status]) {
                groups[issue.status].push(issue);
            }
        });
        return groups;
    }, [issues]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const created = await createProjectForGroup(groupId, {
                name: createProjectName,
                userId: storedUser?.id
            });
            setProject(created);
            setIssues([]);
            setMessage({ type: 'success', text: 'Project created successfully.' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data || 'Failed to create project.' });
        }
    };

    const validateIssueForm = () => {
        const trimmedTitle = issueForm.title.trim();
        const trimmedDescription = issueForm.description.trim();

        if (!trimmedTitle) {
            setMessage({ type: 'error', text: 'Title cannot be empty.' });
            return false;
        }

        if (!trimmedDescription) {
            setMessage({ type: 'error', text: 'Description cannot be empty.' });
            return false;
        }

        if (!issueForm.dueDate) {
            setMessage({ type: 'error', text: 'Due date is required.' });
            return false;
        }

        const selectedDate = new Date(issueForm.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setMessage({ type: 'error', text: 'Due date cannot be in the past. Please select a future date.' });
            return false;
        }

        return true;
    };

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        if (!project) return;

        setMessage({ type: '', text: '' });

        if (!validateIssueForm()) {
            return;
        }

        const trimmedTitle = issueForm.title.trim();
        const trimmedDescription = issueForm.description.trim();

        try {
            const createdIssue = await createIssue(project.id, {
                userId: storedUser?.id,
                title: trimmedTitle,
                description: trimmedDescription,
                priority: issueForm.priority,
                type: issueForm.type,
                dueDate: issueForm.dueDate || null,
                assigneeId: issueForm.assigneeId ? Number(issueForm.assigneeId) : null
            });

            setIssues((prev) => [...prev, createdIssue]);
            setIssueForm({
                title: '',
                description: '',
                priority: 'MEDIUM',
                type: 'TASK',
                dueDate: '',
                assigneeId: ''
            });
            setMessage({ type: 'success', text: 'Issue created successfully.' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data || 'Failed to create issue.' });
        }
    };

    const handleStatusChange = async (issueId, status) => {
        try {
            const updated = await updateIssueStatus(issueId, {
                userId: storedUser?.id,
                status
            });
            setIssues((prev) => prev.map((issue) => (issue.id === issueId ? updated : issue)));
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data || 'Failed to update issue status.' });
        }
    };

    const handleAssigneeChange = async (issueId, assigneeId) => {
        try {
            const updated = await assignIssue(issueId, {
                userId: storedUser?.id,
                assigneeId: assigneeId ? Number(assigneeId) : null
            });
            setIssues((prev) => prev.map((issue) => (issue.id === issueId ? updated : issue)));
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data || 'Failed to assign issue.' });
        }
    };

    const handleDeleteIssue = async (issueId) => {
        if (!window.confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteIssue(issueId, storedUser?.id);
            setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
            setMessage({ type: 'success', text: 'Issue deleted successfully.' });
        } catch (error) {
            console.log(error);
            setMessage({ type: 'error', text: error.response?.data || 'Failed to delete issue.' });
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Group Project Board</h1>
                        <p className="mt-1 text-slate-400">Manage project issues for your existing group.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/groups/${groupId}/jira-board`)}
                            className="px-4 py-2 rounded-xl font-semibold transition border border-blue-500/40 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 shadow-sm"
                        >
                            📊 Visual Board
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded-xl font-semibold transition border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 shadow-sm"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-2xl text-sm font-medium border ${
                            message.type === 'success'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-3xl border border-slate-800 bg-[#111827] shadow-xl p-6">
                        <p className="text-slate-400">Loading project board...</p>
                    </div>
                ) : !project ? (
                    <div className="rounded-3xl border border-slate-800 bg-[#111827] shadow-xl p-6">
                        <h2 className="text-2xl font-bold mb-2 text-white">Create Project Workspace</h2>
                        <p className="mb-4 text-slate-400">
                            No project exists for this group yet. Create one to start managing issues.
                        </p>
                        <form onSubmit={handleCreateProject} className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                value={createProjectName}
                                onChange={(e) => setCreateProjectName(e.target.value)}
                                placeholder="Project name (optional)"
                                className="flex-1 rounded-xl p-3 outline-none border border-slate-700 bg-[#0f172a] text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="font-semibold px-6 py-3 rounded-xl transition bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Create Project
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="rounded-3xl border border-slate-800 bg-[#111827] shadow-xl p-6 mb-6">
                            <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                            <p className="mt-1 text-slate-400">
                                Group: <span className="text-blue-400 font-semibold">{project.groupName}</span>
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-[#111827] shadow-xl p-6 mb-6">
                            <h3 className="text-xl font-bold mb-4 text-white">Create Issue</h3>
                            <p className="text-sm mb-4 text-slate-400">
                                Fields marked with <span className="text-red-400">*</span> are required
                            </p>

                            <form onSubmit={handleCreateIssue} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1 text-slate-300">
                                        Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={issueForm.title}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter issue title"
                                        className="w-full rounded-xl p-3 outline-none border border-slate-700 bg-[#0f172a] text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1 text-slate-300">
                                        Description <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={issueForm.description}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter issue description"
                                        className="w-full rounded-xl p-3 outline-none border border-slate-700 bg-[#0f172a] text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-300">Type</label>
                                    <select
                                        value={issueForm.type}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, type: e.target.value }))}
                                        className="w-full rounded-xl p-3 border border-slate-700 bg-[#0f172a] text-slate-100 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                                    >
                                        {TYPES.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-300">Priority</label>
                                    <select
                                        value={issueForm.priority}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, priority: e.target.value }))}
                                        className="w-full rounded-xl p-3 border border-slate-700 bg-[#0f172a] text-slate-100 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                                    >
                                        {PRIORITIES.map((priority) => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-300">Due Date</label>
                                    <input
                                        type="date"
                                        value={issueForm.dueDate}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                                        className="w-full rounded-xl p-3 border border-slate-700 bg-[#0f172a] text-slate-100 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                                    />
                                    {issueForm.dueDate && (
                                        <p className="text-xs mt-1 text-slate-500">Must be a future date</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-300">Assign to</label>
                                    <select
                                        value={issueForm.assigneeId}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, assigneeId: e.target.value }))}
                                        className="w-full rounded-xl p-3 border border-slate-700 bg-[#0f172a] text-slate-100 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                                    >
                                        <option value="">Select a team member (Optional)</option>
                                        {members.map((member) => (
                                            <option key={member.id} value={member.id}>{member.fullName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={!issueForm.title.trim() || !issueForm.description.trim() || !issueForm.dueDate}
                                        className={`font-semibold px-6 py-3 rounded-xl transition ${
                                            !issueForm.title.trim() || !issueForm.description.trim() || !issueForm.dueDate
                                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        Create Issue
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {STATUS_COLUMNS.map((column) => (
                                <div
                                    key={column.key}
                                    className="rounded-3xl border border-slate-800 bg-[#111827] shadow-xl p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className={`text-lg font-bold ${columnStyles[column.key].title}`}>
                                            {column.label}
                                        </h4>
                                        <span className="min-w-[32px] h-8 px-2 inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-[#0f172a] text-slate-300 border border-slate-700">
                                            {groupedIssues[column.key].length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {groupedIssues[column.key].length === 0 ? (
                                            <div className="rounded-2xl border border-dashed border-slate-700 bg-[#0f172a] p-4">
                                                <p className="text-sm text-slate-500">No issues</p>
                                            </div>
                                        ) : (
                                            groupedIssues[column.key].map((issue) => (
                                                <div
                                                    key={issue.id}
                                                    className={`rounded-2xl p-4 border shadow-lg ${columnStyles[column.key].card}`}
                                                >
                                                    <div className="flex items-start justify-between gap-3 mb-3">
                                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${columnStyles[column.key].badge}`}>
                                                            {issue.issueKey}
                                                        </span>

                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                                                                    priorityStyles[issue.priority] || 'bg-slate-800 text-slate-300 border border-slate-600/70'
                                                                }`}
                                                            >
                                                                {issue.priority}
                                                            </span>
                                                            <button
                                                                onClick={() => handleDeleteIssue(issue.id)}
                                                                className="text-slate-400 hover:text-red-400 transition flex-shrink-0"
                                                                title="Delete issue"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <h5 className="font-semibold text-white text-lg leading-snug">
                                                        {issue.title}
                                                    </h5>

                                                    {issue.description && (
                                                        <p className="text-sm mt-2 text-slate-400 line-clamp-3">
                                                            {issue.description}
                                                        </p>
                                                    )}

                                                    <p className="text-xs mt-3 text-slate-500">
                                                        {issue.type} • {issue.priority}
                                                    </p>

                                                    <div className="mt-4 space-y-2">
                                                        <select
                                                            value={issue.status}
                                                            onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                                            className="w-full rounded-xl p-2.5 text-sm border border-slate-700 bg-[#0f172a] text-slate-100 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                                                        >
                                                            {STATUS_COLUMNS.map((statusColumn) => (
                                                                <option key={statusColumn.key} value={statusColumn.key}>
                                                                    {statusColumn.label}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <select
                                                            value={issue.assignee?.id || ''}
                                                            onChange={(e) => handleAssigneeChange(issue.id, e.target.value)}
                                                            className="w-full rounded-xl p-2.5 text-sm border border-slate-700 bg-[#0f172a] text-slate-100 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
                                                        >
                                                            <option value="">Unassigned</option>
                                                            {members.map((member) => (
                                                                <option key={member.id} value={member.id}>{member.fullName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GroupProjectBoard;