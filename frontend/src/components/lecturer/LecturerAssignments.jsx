import React, { useState } from 'react';

const LecturerAssignments = () => {
  const [assignment, setAssignment] = useState({
    title: '',
    deadline: '',
    module: '',
    weightage: 20
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};
    if (!assignment.title.trim()) temp.title = "Assignment title is required";
    if (!assignment.deadline) temp.deadline = "Deadline is required";
    if (new Date(assignment.deadline) < new Date())
      temp.deadline = "Deadline must be in the future";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            📚 Assignment Management
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Create, manage and monitor student submissions easily
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100">

          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-2">
            🚀 Create New Assignment
          </h2>

          <form onSubmit={handleCreate} className="space-y-6">

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="Final Project Report"
                  value={assignment.title}
                  onChange={(e) =>
                    setAssignment({ ...assignment, title: e.target.value })
                  }
                  className={`w-full p-3 rounded-xl border transition-all outline-none ${
                    errors.title
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:shadow-md'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Module */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📚 Target Module
                </label>
                <select
                  value={assignment.module}
                  onChange={(e) =>
                    setAssignment({ ...assignment, module: e.target.value })
                  }
                  className={`w-full p-3 rounded-xl border transition-all outline-none ${
                    errors.module
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:shadow-md'
                  }`}
                >
                  <option value="">Select Module</option>
                  <option value="IT3040">IT3040 - IT Project Management</option>
                  <option value="IT3020">IT3020 - Distributed Systems</option>
                </select>
                {errors.module && (
                  <p className="text-red-500 text-xs mt-1">{errors.module}</p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏰ Submission Deadline
                </label>
                <input
                  type="datetime-local"
                  value={assignment.deadline}
                  onChange={(e) =>
                    setAssignment({ ...assignment, deadline: e.target.value })
                  }
                  className={`w-full p-3 rounded-xl border transition-all outline-none ${
                    errors.deadline
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:shadow-md'
                  }`}
                />
                {errors.deadline && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.deadline}
                  </p>
                )}
              </div>

              {/* Weightage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📊 Weightage (%)
                </label>
                <input
                  type="number"
                  value={assignment.weightage}
                  onChange={(e) =>
                    setAssignment({
                      ...assignment,
                      weightage: e.target.value
                    })
                  }
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:shadow-md outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-10 py-3 rounded-xl font-bold text-white 
                bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-700 hover:to-indigo-700 
                transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
              >
                🚀 Publish Assignment
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LecturerAssignments;