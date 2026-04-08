import React, { useState } from 'react';

const LecturerNotices = () => {
  const [notice, setNotice] = useState({ title: '', content: '', targetGroup: '' });
  const [errors, setErrors] = useState({});
  const [notices, setNotices] = useState([]); // Mock list for now

  const validate = () => {
    let tempErrors = {};
    if (!notice.title.trim()) tempErrors.title = "Title is required";
    else if (notice.title.length < 5) tempErrors.title = "Title must be at least 5 characters";
    
    if (!notice.content.trim()) tempErrors.content = "Content is required";
    
    if (!notice.targetGroup) tempErrors.targetGroup = "Please select a target group or module";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate API Call
      const newNotice = { ...notice, id: Date.now(), date: new Date().toLocaleDateString() };
      setNotices([newNotice, ...notices]);
      setNotice({ title: '', content: '', targetGroup: '' }); // Reset form
      alert("Notice posted successfully!");
    }
  };

  // Function to delete a notice
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter(n => n.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Updated Header with 0A0A0C Box */}
      <header className="mb-8 bg-[#0A0A0C] p-8 rounded-2xl shadow-xl border-b-4 border-b-[#FF6A00]">
        <h1 className="text-3xl font-black text-white tracking-tight">Group Notices</h1>
        <p className="text-gray-400 font-medium mt-1">Broadcast important updates to specific project groups.</p>
      </header>

      {/* Create Notice Form */}
      <div className="bg-[#F4F4F6] p-8 rounded-2xl shadow-sm border border-gray-200 border-b-4 border-b-[#FF6A00] mb-8">
        <h2 className="text-lg font-bold mb-6 text-[#0A0A0C] uppercase tracking-widest">Create New Notice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Notice Title</label>
            <input
              type="text"
              className={`w-full p-3 bg-white text-[#0A0A0C] border rounded-xl outline-none transition-all ${errors.title ? 'border-red-500' : 'border-gray-200 focus:border-[#FF6A00]'}`}
              placeholder="e.g., Upcoming Viva Requirements"
              value={notice.title}
              onChange={(e) => setNotice({...notice, title: e.target.value})}
            />
            {errors.title && <span className="text-red-500 text-xs mt-1 block font-bold italic">{errors.title}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Target Group/Module</label>
            <div className="relative">
              <select
                className={`w-full p-3 bg-white text-[#0A0A0C] border rounded-xl outline-none transition-all appearance-none ${errors.targetGroup ? 'border-red-500' : 'border-gray-200 focus:border-[#FF6A00]'}`}
                value={notice.targetGroup}
                onChange={(e) => setNotice({...notice, targetGroup: e.target.value})}
              >
                <option value="">Select Group</option>
                <option value="Group 01 - AgroLeave">Group 01 - AgroLeave</option>
                <option value="Group 02 - HealthTrack">Group 02 - HealthTrack</option>
                <option value="All Groups">All Groups (Module Wide)</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            {errors.targetGroup && <span className="text-red-500 text-xs mt-1 block font-bold italic">{errors.targetGroup}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Notice Content</label>
            <textarea
              rows="4"
              className={`w-full p-3 bg-white text-[#0A0A0C] border rounded-xl outline-none transition-all resize-none ${errors.content ? 'border-red-500' : 'border-gray-200 focus:border-[#FF6A00]'}`}
              placeholder="Write your detailed instructions here..."
              value={notice.content}
              onChange={(e) => setNotice({...notice, content: e.target.value})}
            ></textarea>
            {errors.content && <span className="text-red-500 text-xs mt-1 block font-bold italic">{errors.content}</span>}
          </div>

          <button type="submit" className="w-full bg-[#FF6A00] text-white px-6 py-3 rounded-xl hover:bg-[#E55F00] transition-all font-black uppercase text-sm tracking-widest shadow-lg shadow-orange-950/10 flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Post Notice</span>
          </button>
        </form>
      </div>

      {/* Recent Notices List */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-[#0A0A0C] uppercase tracking-tighter">Recently Posted</h2>
        {notices.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-gray-200 rounded-2xl text-center">
            <p className="text-gray-400 italic font-medium">No notices posted yet.</p>
          </div>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="relative bg-[#1F1F23] p-6 rounded-2xl border-l-8 border-[#FF6A00] shadow-xl transition-transform hover:scale-[1.01]">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-[#FF6A00] bg-[#FF6A00]/10 px-3 py-1 rounded-full border border-[#FF6A00]/20 whitespace-nowrap uppercase tracking-widest">
                            {n.targetGroup}
                        </span>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{n.date}</p>
                    </div>
                  <h3 className="font-black text-white text-lg leading-tight">{n.title}</h3>
                </div>
                
                <button 
                  onClick={() => handleDelete(n.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-white/5 rounded-lg transition-all"
                  title="Delete Notice"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 mt-3 text-sm font-medium leading-relaxed">{n.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LecturerNotices;