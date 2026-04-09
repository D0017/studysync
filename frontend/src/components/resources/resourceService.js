import axios from "axios";

const API = "/api/resources";

const getAllResources = async () => {
  const res = await axios.get(API);
  return res.data;
};

const getResourcesByFacultyAndModule = async (faculty, module) => {
  const res = await axios.get(`${API}/faculty/${encodeURIComponent(faculty)}/module/${encodeURIComponent(module)}`);
  return res.data;
};

const createResource = async (formData) => {
  const res = await axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const updateResource = async (id, formData) => {
  const res = await axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const deleteResource = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};

const getDownloadUrl = (id) => `${API}/${id}/download`;

export default {
  getAllResources,
  getResourcesByFacultyAndModule,
  createResource,
  updateResource,
  deleteResource,
  getDownloadUrl,
};