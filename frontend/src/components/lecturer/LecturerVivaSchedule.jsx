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

  // Logic to cancel a session
  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this viva session?")) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Updated Header with 0A0A0C Box */}
      <header className="mb-8 bg-[#0A0A0C] p-8 rounded-2xl shadow-xl border-b-4 border-b-[#FF6A00]">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Viva Scheduling</h1>
        <p className="text-gray-400 font-medium mt-1">Organize and manage project evaluation sessions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduling Form - UPDATED TO #F4F4F6 */}
        <div className="lg:col-span-1 bg-[#F4F4F6] p-6 rounded-2xl shadow-sm border border-gray-200 border-b-4 border-[#FF6A00] h-fit">
          <h2 className="text-lg font-bold mb-6 text-[#0A0A0C] uppercase tracking-widest flex items-center gap-2">
            <span className="text-[#FF6A00]">●</span> New Session
          </h2>
          <form onSubmit={handleSchedule} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Select Group</label>
              <div className="relative">
                <select 
                  className={`w-full p-3 bg-white text-[#0A0A0C] border rounded-xl outline-none transition-all appearance-none cursor-pointer ${errors.group ? 'border-red-500' : 'border-gray-200 focus:border-[#FF6A00]'}`}
                  value={viva.group}
                  onChange={(e) => setViva({...viva, group: e.target.value})}
                >
                  <option value="">Choose a group...</option>
                  <option value="Group 01 - AgroLeave">Group 01 - AgroLeave</option>
                  <option value="Group 02 - HealthTrack">Group 02 - HealthTrack</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#FF6A00]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
              {errors.group && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.group}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Date</label>
                <input 
                  type="date" 
                  className={`w-full p-3 bg-white text-[#0A0A0C] border rounded-xl outline-none transition-all cursor-pointer ${errors.date ? 'border-red-500' : 'border-gray-200 focus:border-[#FF6A00]'}`}
                  value={viva.date}
                  onChange={(e) => setViva({...viva, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Time</label>
                <input 
                  type="time" 
                  className={`w-full p-3 bg-white text-[#0A0A0C] border rounded-xl outline-none transition-all cursor-pointer ${errors.time ? 'border-red-500' : 'border-gray-200 focus:border-[#FF6A00]'}`}
                  value={viva.time}
                  onChange={(e) => setViva({...viva, time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Location / Link</label>
              <input 
                type="text" 
                className="w-full p-3 bg-white text-[#0A0A0C] border border-gray-200 rounded-xl outline-none focus:border-[#FF6A00] transition-all"
                value={viva.location}
                onChange={(e) => setViva({...viva, location: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-[#FF6A00] text-white py-4 rounded-xl hover:bg-[#E55F00] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg shadow-orange-950/10 active:scale-95 mt-2">
              Schedule Session
            </button>
          </form>
        </div>

        {/* Upcoming Vivas List - UPDATED TO #1F1F23 */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black mb-4 text-[#0A0A0C] uppercase tracking-tighter">Upcoming Sessions</h2>
          {schedules.length === 0 ? (
            <div className="bg-[#1F1F23] border-2 border-dashed border-gray-700 rounded-3xl p-16 text-center">
              <p className="text-gray-500 font-bold italic tracking-wide">No sessions scheduled yet.</p>
            </div>
          ) : (
            <div className="bg-[#1F1F23] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Group</th>
                    <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</th>
                    <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-5">
                        <span className="font-black text-white text-sm group-hover:text-[#FF6A00] transition-colors">{s.group}</span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-200">{s.date}</span>
                          <span className="text-[10px] font-bold text-gray-500">{s.time}</span>
                        </div>
                      </td>
                      <td className="p-5 text-sm">
                        <span className="bg-white/5 text-gray-300 px-3 py-1 rounded-full text-[11px] font-bold border border-white/10">
                           {s.location}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => handleCancel(s.id)}
                          className="text-[10px] font-black text-gray-500 hover:text-red-500 uppercase tracking-widest transition-colors"
                        >
                          Cancel
                        </button>
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