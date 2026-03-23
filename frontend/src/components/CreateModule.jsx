import React, { useState } from 'react';
import axios from 'axios';

const CreateModule = () => {
    const [moduleData, setModuleData] = useState({
        moduleCode: '',
        moduleName: '',
        year: 1,
        semester: 1,
        enrollmentKey: ''
    });
    const [numGroups, setNumGroups] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8090/api/admin/create-module-groups', {
                module: moduleData,
                numberOfGroups: numGroups
            });
            alert("Module and Groups created successfully!");
       } catch (error) {
        console.error("Creation failed:", error); 
        alert("Error creating module.");
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Module</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium">Module Code</label>
                    <input type="text" className="w-full border p-2 rounded" 
                        onChange={(e) => setModuleData({...moduleData, moduleCode: e.target.value})} required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Module Name</label>
                    <input type="text" className="w-full border p-2 rounded" 
                        onChange={(e) => setModuleData({...moduleData, moduleName: e.target.value})} required />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium">Number of Groups</label>
                        <input type="number" min="1" className="w-full border p-2 rounded" 
                            value={numGroups} onChange={(e) => setNumGroups(e.target.value)} />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium">Enrollment Key</label>
                        <input type="text" className="w-full border p-2 rounded" 
                            onChange={(e) => setModuleData({...moduleData, enrollmentKey: e.target.value})} required />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                    Generate Module & Groups
                </button>
            </form>
        </div>
    );
};

export default CreateModule;