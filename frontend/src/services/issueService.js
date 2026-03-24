import axios from 'axios';

const API_BASE = '/api/issues';

export const getIssuesByProject = async (projectId, userId) => {
    const response = await axios.get(`${API_BASE}/projects/${projectId}`, {
        params: { userId }
    });
    return response.data;
};

export const createIssue = async (projectId, payload) => {
    const response = await axios.post(`${API_BASE}/projects/${projectId}`, payload);
    return response.data;
};

export const updateIssueStatus = async (issueId, payload) => {
    const response = await axios.put(`${API_BASE}/${issueId}/status`, payload);
    return response.data;
};

export const assignIssue = async (issueId, payload) => {
    const response = await axios.put(`${API_BASE}/${issueId}/assign`, payload);
    return response.data;
};
