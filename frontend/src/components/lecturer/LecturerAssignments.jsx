import React, { useState } from 'react';

const LecturerAssignments = () => {
  const [assignment, setAssignment] = useState({ title: '', deadline: '', module: '', weightage: 20 });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};
    if (!assignment.title.trim()) temp.title = "Assignment title is required";
    if (!assignment.deadline) temp.deadline = "Deadline is required";
    if (new Date(assignment.deadline) < new Date()) temp.deadline = "Deadline must be in the future";
    if (!assignment.module) temp.module = "Please select a module";
    
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (validate()) {
      alert(`Assignment "${assignment.title}" created for ${assignment.module}`);
      setAssignment({ title: '', deadline: '', module: '', weightage: 20 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Assignment Management</h1>
        <p className="text-gray-600">Create and monitor academic submissions.</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-blue-600 mb-6 border-b pb-2">Create New Submission Portal</h2>
        
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
              <input 
                type="text"
                className={`w-full p-2 border rounded-lg outline-none ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                placeholder="e.g., Final Project Report"
                value={assignment.title}
                onChange={(e) => setAssignment({...assignment, title: e.target.value})}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Module</label>
              <select 
                className={`w-full p-2 border rounded-lg outline-none ${errors.module ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                value={assignment.module}
                onChange={(e) => setAssignment({...assignment, module: e.target.value})}
              >
                <option value="">Select Module</option>
                <option value="IT3040">IT3040 - IT Project Management</option>
                <option value="IT3020">IT3020 - Distributed Systems</option>
              </select>
              {errors.module && <p className="text-red-500 text-xs mt-1">{errors.module}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Submission Deadline</label>
              <input 
                type="datetime-local"
                className={`w-full p-2 border rounded-lg outline-none ${errors.deadline ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                value={assignment.deadline}
                onChange={(e) => setAssignment({...assignment, deadline: e.target.value})}
              />
              {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Final Grade Weightage (%)</label>
              <input 
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={assignment.weightage}
                onChange={(e) => setAssignment({...assignment, weightage: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>🚀</span>
              <span>Publish Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LecturerAssignments;