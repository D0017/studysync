import axios from 'axios';

const API_BASE = '/api/jira';

/**
 * Get comprehensive project analytics and statistics
 */
export const getProjectAnalytics = async (projectId, userId) => {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/analytics`, {
        params: { userId }
    });
    return response.data;
};

/**
 * Get filtered issues with multiple criteria
 */
export const getFilteredIssues = async (projectId, userId, filters = {}) => {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/issues/filtered`, {
        params: {
            userId,
            status: filters.status || null,
            priority: filters.priority || null,
            type: filters.type || null,
            assigneeId: filters.assigneeId || null,
            searchQuery: filters.searchQuery || null
        }
    });
    return response.data;
};

/**
 * Get burndown chart data
 */
export const getBurndownChartData = async (projectId, userId) => {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/burndown`, {
        params: { userId }
    });
    return response.data;
};

/**
 * Get issues grouped by status
 */
export const getIssuesGroupedByStatus = async (projectId, userId) => {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/issues/grouped`, {
        params: { userId }
    });
    return response.data;
};

/**
 * Get issues assigned to a specific user
 */
export const getIssuesByAssignee = async (projectId, userId, assigneeId) => {
    const response = await axios.get(
        `${API_BASE}/projects/${projectId}/issues/assignee/${assigneeId}`,
        { params: { userId } }
    );
    return response.data;
};

/**
 * Get overdue issues
 */
export const getOverdueIssues = async (projectId, userId) => {
    const response = await axios.get(`${API_BASE}/projects/${projectId}/issues/overdue`, {
        params: { userId }
    });
    return response.data;
};

/**
 * Get issues by priority
 */
export const getIssuesByPriority = async (projectId, userId, priority) => {
    const response = await axios.get(
        `${API_BASE}/projects/${projectId}/issues/priority/${priority}`,
        { params: { userId } }
    );
    return response.data;
};
