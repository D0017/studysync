import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProjectForGroup, getProjectByGroup } from '../../services/projectService';
import { assignIssue, createIssue, deleteIssue, getIssuesByProject, updateIssueStatus } from '../../services/issueService';

const STATUS_COLUMNS = [
    { key: 'TODO', label: 'To Do', color: 'bg-gray-100' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100' },
    { key: 'REVIEW', label: 'Review', color: 'bg-yellow-100' },
    { key: 'DONE', label: 'Done', color: 'bg-green-100' }
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const TYPES = ['TASK', 'BUG', 'STORY'];

const priorityColors = {
    'LOW': 'bg-green-50 border-green-300',
    'MEDIUM': 'bg-blue-50 border-blue-300',
    'HIGH': 'bg-orange-50 border-orange-300',
    'URGENT': 'bg-red-50 border-red-300'
};

const priorityBadge = {
    'LOW': 'bg-green-100 text-green-700',
    'MEDIUM': 'bg-blue-100 text-blue-700',
    'HIGH': 'bg-orange-100 text-orange-700',
    'URGENT': 'bg-red-100 text-red-700'
};

const JiraBoard = () => {
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
        assigneeId: '',
        storyPoints: ''
    });
    const [filterPriority, setFilterPriority] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

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

    // Filter and search issues
    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            const matchesPriority = !filterPriority || issue.priority === filterPriority;
            const matchesType = !filterType || issue.type === filterType;
            const matchesAssignee = !filterAssignee || issue.assignee?.id === Number(filterAssignee);
            const matchesSearch = !searchQuery || 
                issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.issueKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.description.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesPriority && matchesType && matchesAssignee && matchesSearch;
        });
    }, [issues, filterPriority, filterType, filterAssignee, searchQuery]);

    const groupedIssues = useMemo(() => {
        const groups = {
            TODO: [],
            IN_PROGRESS: [],
            REVIEW: [],
            DONE: []
        };
        filteredIssues.forEach((issue) => {
            if (groups[issue.status]) {
                groups[issue.status].push(issue);
            }
        });
        return groups;
    }, [filteredIssues]);

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
                assigneeId: '',
                storyPoints: ''
            });
            setShowCreateForm(false);
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
            setMessage({ type: 'error', text: error.response?.data || 'Failed to delete issue.' });
        }
    };

    const getProgressPercentage = () => {
        if (issues.length === 0) return 0;
        const done = issues.filter(i => i.status === 'DONE').length;
        return Math.round((done / issues.length) * 100);
    };

    const getIssueStats = () => {
        return {
            total: issues.length,
            todo: issues.filter(i => i.status === 'TODO').length,
            inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
            review: issues.filter(i => i.status === 'REVIEW').length,
            done: issues.filter(i => i.status === 'DONE').length
        };
    };

    const stats = getIssueStats();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Jira Board</h1>
                        <p className="text-gray-500 mt-1">Advanced project management with filtering and analytics.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/groups/${groupId}/project`)}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Simple Board
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Back
                        </button>
                    </div>
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
                        <p className="text-gray-500">Loading Jira board...</p>
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
                        {/* Project Info & Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
                                <p className="text-gray-500 text-sm font-semibold">PROJECT</p>
                                <h3 className="text-lg font-bold text-gray-900 mt-1">{project.name}</h3>
                                <p className="text-gray-600 text-xs mt-2">Group: {project.groupName}</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
                                <p className="text-gray-500 text-sm font-semibold">TOTAL ISSUES</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                            </div>
                            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
                                <p className="text-gray-500 text-sm font-semibold">PROGRESS</p>
                                <div className="mt-2">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-2xl font-bold text-green-600">{getProgressPercentage()}%</h3>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all"
                                            style={{ width: `${getProgressPercentage()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
                                <p className="text-gray-500 text-sm font-semibold">STATUS BREAKDOWN</p>
                                <div className="mt-2 space-y-1 text-xs">
                                    <p className="text-blue-600">📌 {stats.todo} To Do</p>
                                    <p className="text-orange-600">⚡ {stats.inProgress} In Progress</p>
                                    <p className="text-yellow-600">👀 {stats.review} Review</p>
                                    <p className="text-green-600">✅ {stats.done} Done</p>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <input
                                    type="text"
                                    placeholder="Search issues..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Priorities</option>
                                    {PRIORITIES.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterAssignee}
                                    onChange={(e) => setFilterAssignee(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Assignees</option>
                                    {members.map((member) => (
                                        <option key={member.id} value={member.id}>{member.fullName}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => {
                                        setFilterPriority('');
                                        setFilterType('');
                                        setFilterAssignee('');
                                        setSearchQuery('');
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-semibold text-sm transition"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>

                        {/* Create Issue Button */}
                        <div className="mb-6">
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className={`${
                                    showCreateForm 
                                        ? 'bg-blue-700 hover:bg-blue-800' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-semibold px-6 py-3 rounded-lg transition`}
                            >
                                {showCreateForm ? '✕ Cancel' : '+ Create Issue'}
                            </button>
                        </div>

                        {/* Create Issue Form */}
                        {showCreateForm && (
                            <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Issue</h3>
                                <p className="text-sm text-gray-500 mb-4">Fields marked with <span className="text-red-600">*</span> are required</p>
                                <form onSubmit={handleCreateIssue} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title <span className="text-red-600">*</span></label>
                                        <input
                                            type="text"
                                            value={issueForm.title}
                                            onChange={(e) => setIssueForm((prev) => ({ ...prev, title: e.target.value }))}
                                            placeholder="Enter issue title"
                                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description <span className="text-red-600">*</span></label>
                                        <textarea
                                            value={issueForm.description}
                                            onChange={(e) => setIssueForm((prev) => ({ ...prev, description: e.target.value }))}
                                            placeholder="Enter issue description"
                                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                                        <select
                                            value={issueForm.type}
                                            onChange={(e) => setIssueForm((prev) => ({ ...prev, type: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {TYPES.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                                        <select
                                            value={issueForm.priority}
                                            onChange={(e) => setIssueForm((prev) => ({ ...prev, priority: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {PRIORITIES.map((priority) => (
                                                <option key={priority} value={priority}>{priority}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            value={issueForm.dueDate}
                                            onChange={(e) => setIssueForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {issueForm.dueDate && (
                                            <p className="text-xs text-gray-500 mt-1">Must be a future date</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Story Points</label>
                                        <input
                                            type="number"
                                            placeholder="Optional"
                                            value={issueForm.storyPoints}
                                            onChange={(e) => setIssueForm((prev) => ({ ...prev, storyPoints: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Assign to</label>
                                        <select
                                            value={issueForm.assigneeId}
                                            onChange={(e) => setIssueForm((prev) => ({ ...prev, assigneeId: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select a team member (Optional)</option>
                                            {members.map((member) => (
                                                <option key={member.id} value={member.id}>{member.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={!issueForm.title.trim() || !issueForm.description.trim() || !issueForm.dueDate || (issueForm.dueDate && new Date(issueForm.dueDate) < new Date().setHours(0,0,0,0) && new Date(issueForm.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0))}
                                            className={`font-semibold px-6 py-3 rounded-lg transition ${
                                                !issueForm.title.trim() || !issueForm.description.trim() || !issueForm.dueDate
                                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                        >
                                            Create Issue
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateForm(false)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Kanban Board */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {STATUS_COLUMNS.map((column) => (
                                <div key={column.key} className={`${column.color} rounded-2xl shadow border border-gray-200 p-4`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-lg font-bold text-gray-900">{column.label}</h4>
                                        <span className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-700 border border-gray-300">
                                            {groupedIssues[column.key].length}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {groupedIssues[column.key].length === 0 ? (
                                            <p className="text-sm text-gray-500">No issues</p>
                                        ) : (
                                            groupedIssues[column.key].map((issue) => (
                                                <div key={issue.id} className={`${priorityColors[issue.priority]} border-2 rounded-xl p-3`}>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">{issue.issueKey}</p>
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityBadge[issue.priority]}`}>
                                                            {issue.priority}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2 mt-2">
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
                                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                                                    )}
                                                    <div className="flex gap-2 mt-2 flex-wrap">
                                                        <span className="bg-white px-2 py-1 rounded text-xs font-semibold border border-gray-300">{issue.type}</span>
                                                        {issue.storyPoints && (
                                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
                                                                {issue.storyPoints}pts
                                                            </span>
                                                        )}
                                                    </div>

                                                    {issue.dueDate && (
                                                        <p className="text-xs text-gray-500 mt-2">📅 {new Date(issue.dueDate).toLocaleDateString()}</p>
                                                    )}

                                                    <div className="mt-3 space-y-2">
                                                        <select
                                                            value={issue.status}
                                                            onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                                            className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500"
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
                                                            className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Unassigned</option>
                                                            {members.map((member) => (
                                                                <option key={member.id} value={member.id}>
                                                                    {member.fullName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {issue.assignee && (
                                                            <div className="bg-white rounded p-2 text-xs border border-gray-300">
                                                                👤 Assigned to: <strong>{issue.assignee.fullName}</strong>
                                                            </div>
                                                        )}
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

export default JiraBoard;
