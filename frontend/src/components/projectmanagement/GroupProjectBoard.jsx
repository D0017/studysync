import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProjectForGroup, getProjectByGroup } from '../../services/projectService';
import { assignIssue, createIssue, getIssuesByProject, updateIssueStatus } from '../../services/issueService';

const STATUS_COLUMNS = [
    { key: 'TODO', label: 'To Do' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'REVIEW', label: 'Review' },
    { key: 'DONE', label: 'Done' }
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const TYPES = ['TASK', 'BUG', 'STORY'];

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

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        if (!project) return;

        setMessage({ type: '', text: '' });

        try {
            const createdIssue = await createIssue(project.id, {
                userId: storedUser?.id,
                title: issueForm.title,
                description: issueForm.description,
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Group Project Board</h1>
                        <p className="text-gray-500 mt-1">Manage project issues for your existing group.</p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                        Back
                    </button>
                </div>

                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                        <p className="text-gray-500">Loading project board...</p>
                    </div>
                ) : !project ? (
                    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Project Workspace</h2>
                        <p className="text-gray-500 mb-4">
                            No project exists for this group yet. Create one to start managing issues.
                        </p>
                        <form onSubmit={handleCreateProject} className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                value={createProjectName}
                                onChange={(e) => setCreateProjectName(e.target.value)}
                                placeholder="Project name (optional)"
                                className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                            >
                                Create Project
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
                            <p className="text-gray-600 mt-1">
                                Group: <span className="font-semibold">{project.groupName}</span>
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Issue</h3>
                            <form onSubmit={handleCreateIssue} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={issueForm.title}
                                    onChange={(e) => setIssueForm((prev) => ({ ...prev, title: e.target.value }))}
                                    placeholder="Issue title"
                                    className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                                    required
                                />
                                <textarea
                                    value={issueForm.description}
                                    onChange={(e) => setIssueForm((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Issue description"
                                    className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                                    rows={3}
                                />
                                <select
                                    value={issueForm.type}
                                    onChange={(e) => setIssueForm((prev) => ({ ...prev, type: e.target.value }))}
                                    className="border border-gray-300 rounded-lg p-3"
                                >
                                    {TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={issueForm.priority}
                                    onChange={(e) => setIssueForm((prev) => ({ ...prev, priority: e.target.value }))}
                                    className="border border-gray-300 rounded-lg p-3"
                                >
                                    {PRIORITIES.map((priority) => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    value={issueForm.dueDate}
                                    onChange={(e) => setIssueForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                                    className="border border-gray-300 rounded-lg p-3"
                                />
                                <select
                                    value={issueForm.assigneeId}
                                    onChange={(e) => setIssueForm((prev) => ({ ...prev, assigneeId: e.target.value }))}
                                    className="border border-gray-300 rounded-lg p-3"
                                >
                                    <option value="">Unassigned</option>
                                    {members.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.fullName}
                                        </option>
                                    ))}
                                </select>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                                    >
                                        Create Issue
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {STATUS_COLUMNS.map((column) => (
                                <div key={column.key} className="bg-white rounded-2xl shadow border border-gray-100 p-4">
                                    <h4 className="text-lg font-bold text-gray-900 mb-3">{column.label}</h4>
                                    <div className="space-y-3">
                                        {groupedIssues[column.key].length === 0 ? (
                                            <p className="text-sm text-gray-500">No issues</p>
                                        ) : (
                                            groupedIssues[column.key].map((issue) => (
                                                <div key={issue.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                                                    <p className="text-xs font-semibold text-blue-700">{issue.issueKey}</p>
                                                    <h5 className="font-semibold text-gray-900 mt-1">{issue.title}</h5>
                                                    {issue.description && (
                                                        <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {issue.type} • {issue.priority}
                                                    </p>
                                                    <div className="mt-3 space-y-2">
                                                        <select
                                                            value={issue.status}
                                                            onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
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
                                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                        >
                                                            <option value="">Unassigned</option>
                                                            {members.map((member) => (
                                                                <option key={member.id} value={member.id}>
                                                                    {member.fullName}
                                                                </option>
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
