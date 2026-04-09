import axios from 'axios';

const API_BASE = '/api/projects';

export const getProjectByGroup = async (groupId, userId) => {
    const response = await axios.get(`${API_BASE}/groups/${groupId}`, {
        params: { userId }
    });
    return response.data;
};

export const createProjectForGroup = async (groupId, payload) => {
    const response = await axios.post(`${API_BASE}/groups/${groupId}`, payload);
    return response.data;
};
