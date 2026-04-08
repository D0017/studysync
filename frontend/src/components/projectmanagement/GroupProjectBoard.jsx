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

        // Check if title is empty
        if (!trimmedTitle) {
            setMessage({ type: 'error', text: 'Title cannot be empty.' });
            return false;
        }

        // Check if description is empty
        if (!trimmedDescription) {
            setMessage({ type: 'error', text: 'Description cannot be empty.' });
            return false;
        }

        // Check if dueDate is provided
        if (!issueForm.dueDate) {
            setMessage({ type: 'error', text: 'Due date is required.' });
            return false;
        }

        // Check if dueDate is a future date
        const selectedDate = new Date(issueForm.dueDate);
        const today = new Date();
        // Set time to midnight for both dates to compare only the date part
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

        // Validate form before submission
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
            console.log(error)
            setMessage({ type: 'error', text: error.response?.data || 'Failed to delete issue.' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Group Project Board</h1>
                        <p className="mt-1 text-gray-500">Manage project issues for your existing group.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/groups/${groupId}/jira-board`)}
                            className="px-4 py-2 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            📊 Visual Board
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded-lg font-semibold transition bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div
                        className={`mb-6 p-4 rounded-lg text-sm font-medium border ${
                            message.type === 'success'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-2xl border border-gray-100 shadow p-6 bg-white">
                        <p className="text-gray-500">Loading project board...</p>
                    </div>
                ) : !project ? (
                    <div className="rounded-2xl border border-gray-100 shadow p-6 bg-white">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">Create Project Workspace</h2>
                        <p className="mb-4 text-gray-500">
                            No project exists for this group yet. Create one to start managing issues.
                        </p>
                        <form onSubmit={handleCreateProject} className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                value={createProjectName}
                                onChange={(e) => setCreateProjectName(e.target.value)}
                                placeholder="Project name (optional)"
                                className="flex-1 rounded-lg p-3 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="font-semibold px-6 py-3 rounded-lg transition bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Create Project
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="rounded-2xl border border-gray-100 shadow p-6 mb-6 bg-white">
                            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
                            <p className="mt-1 text-gray-600">
                                Group: <span className="text-blue-600 font-semibold">{project.groupName}</span>
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 shadow p-6 mb-6 bg-white">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Create Issue</h3>
                            <p className="text-sm mb-4 text-gray-500">Fields marked with <span className="text-red-600">*</span> are required</p>
                            <form onSubmit={handleCreateIssue} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Title <span className="text-red-600">*</span></label>
                                    <input
                                        type="text"
                                        value={issueForm.title}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter issue title"
                                        className="w-full rounded-lg p-3 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Description <span className="text-red-600">*</span></label>
                                    <textarea
                                        value={issueForm.description}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter issue description"
                                        className="w-full rounded-lg p-3 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Type</label>
                                    <select
                                        value={issueForm.type}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, type: e.target.value }))}
                                        className="w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    >
                                        {TYPES.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Priority</label>
                                    <select
                                        value={issueForm.priority}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, priority: e.target.value }))}
                                        className="w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    >
                                        {PRIORITIES.map((priority) => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Due Date</label>
                                    <input
                                        type="date"
                                        value={issueForm.dueDate}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                                        className="w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    />
                                    {issueForm.dueDate && (
                                        <p className="text-xs mt-1 text-gray-500">Must be a future date</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Assign to</label>
                                    <select
                                        value={issueForm.assigneeId}
                                        onChange={(e) => setIssueForm((prev) => ({ ...prev, assigneeId: e.target.value }))}
                                        className="w-full rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                                        className={`font-semibold px-6 py-3 rounded-lg transition ${
                                            !issueForm.title.trim() || !issueForm.description.trim() || !issueForm.dueDate
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
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
                                <div key={column.key} className="rounded-2xl border border-gray-100 shadow p-4 bg-gray-50">
                                    <h4 className="text-lg font-bold mb-3 text-blue-600">{column.label}</h4>
                                    <div className="space-y-3">
                                        {groupedIssues[column.key].length === 0 ? (
                                            <p className="text-sm text-gray-500">No issues</p>
                                        ) : (
                                            groupedIssues[column.key].map((issue) => (
                                                <div key={issue.id} className="rounded-xl p-3 border border-gray-200 bg-white shadow-sm">
                                                    <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{issue.issueKey}</p>
                                                    <div className="flex items-center justify-between gap-2 mt-1">
                                                        <h5 className="font-semibold text-gray-900">{issue.title}</h5>
                                                        <button
                                                            onClick={() => handleDeleteIssue(issue.id)}
                                                            className="text-lg hover:opacity-70 transition flex-shrink-0"
                                                            title="Delete issue"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                    {issue.description && (
                                                        <p className="text-sm mt-1 text-gray-600">{issue.description}</p>
                                                    )}
                                                    <p className="text-xs mt-2 text-gray-500">
                                                        {issue.type} • {issue.priority}
                                                    </p>
                                                    <div className="mt-3 space-y-2">
                                                        <select
                                                            value={issue.status}
                                                            onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                                            className="w-full rounded-lg p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
                                                        >
                                                            {STATUS_COLUMNS.map((statusColumn) => (
                                                                <option key={statusColumn.key} value={statusColumn.key}>{statusColumn.label}</option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={issue.assignee?.id || ''}
                                                            onChange={(e) => handleAssigneeChange(issue.id, e.target.value)}
                                                            className="w-full rounded-lg p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
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