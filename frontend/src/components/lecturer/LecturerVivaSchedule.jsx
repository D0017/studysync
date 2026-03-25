import React, { useState } from 'react';

const LecturerVivaSchedule = () => {
  const [viva, setViva] = useState({ group: '', date: '', time: '', location: 'Online - Zoom' });
  const [errors, setErrors] = useState({});
  const [schedules, setSchedules] = useState([]);

  const validate = () => {
    let tempErrors = {};
    const selectedDate = new Date(viva.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!viva.group) tempErrors.group = "Please select a project group";
    if (!viva.date) tempErrors.date = "Date is required";
    else if (selectedDate < today) tempErrors.date = "Cannot schedule a viva in the past";
    
    if (!viva.time) tempErrors.time = "Time is required";
    if (!viva.location.trim()) tempErrors.location = "Location or Meeting Link is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    if (validate()) {
      const newSchedule = { ...viva, id: Date.now() };
      setSchedules([...schedules, newSchedule]);
      setViva({ group: '', date: '', time: '', location: 'Online - Zoom' });
      alert("Viva session scheduled successfully!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Viva Scheduling</h1>
        <p className="text-gray-600">Organize and manage project evaluation sessions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduling Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">New Session</h2>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Group</label>
              <select 
                className={`w-full p-2 border rounded-lg mt-1 ${errors.group ? 'border-red-500' : 'border-gray-300'}`}
                value={viva.group}
                onChange={(e) => setViva({...viva, group: e.target.value})}
              >
                <option value="">Choose a group...</option>
                <option value="Group 01 - AgroLeave">Group 01 - AgroLeave</option>
                <option value="Group 02 - HealthTrack">Group 02 - HealthTrack</option>
              </select>
              {errors.group && <p className="text-red-500 text-xs mt-1">{errors.group}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input 
                  type="date" 
                  className={`w-full p-2 border rounded-lg mt-1 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                  value={viva.date}
                  onChange={(e) => setViva({...viva, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input 
                  type="time" 
                  className={`w-full p-2 border rounded-lg mt-1 ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
                  value={viva.time}
                  onChange={(e) => setViva({...viva, time: e.target.value})}
                />
              </div>
            </div>
            {(errors.date || errors.time) && <p className="text-red-500 text-xs">{errors.date || errors.time}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700">Location / Link</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                value={viva.location}
                onChange={(e) => setViva({...viva, location: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors">
              Schedule Session
            </button>
          </form>
        </div>

        {/* Upcoming Vivas List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Sessions</h2>
          {schedules.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-500">
              No sessions scheduled yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600">Group</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Date & Time</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Location</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">{s.group}</td>
                      <td className="p-4 text-sm text-gray-600">{s.date} at {s.time}</td>
                      <td className="p-4 text-sm text-gray-600">{s.location}</td>
                      <td className="p-4">
                        <button className="text-red-600 hover:underline text-sm font-medium">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerVivaSchedule;