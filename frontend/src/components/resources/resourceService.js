import axios from "axios";

const API = "/api/resources";

const getAllResources = async () => {

    const res = await axios.get(API);

    return res.data;

};

const createResource = async (resource) => {

    const res = await axios.post(API, resource);

    return res.data;

};

export default {

    getAllResources,

    createResource

};