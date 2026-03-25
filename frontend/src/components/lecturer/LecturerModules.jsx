import React from 'react';

const LecturerModules = () => {
  // Mock data representing modules assigned to the logged-in lecturer
  const modules = [
    { id: 'IT3040', name: 'IT Project Management', groups: 12, students: 48 },
    { id: 'IT3020', name: 'Distributed Systems', groups: 8, students: 32 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Modules</h1>
          <p className="text-gray-600">Overview of modules assigned to your academic profile.</p>
        </div>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          Total Modules: {modules.length}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                {mod.id}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View Groups →</button>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{mod.name}</h3>
            <div className="flex space-x-6 mt-4 pt-4 border-t border-gray-50 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-2">👥</span> {mod.groups} Groups
              </div>
              <div className="flex items-center">
                <span className="mr-2">🎓</span> {mod.students} Students
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerModules;