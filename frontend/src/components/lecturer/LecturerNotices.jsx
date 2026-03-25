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

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Group Notices</h1>
        <p className="text-gray-600">Broadcast important updates to specific project groups.</p>
      </header>

      {/* Create Notice Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-blue-600">Create New Notice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notice Title</label>
            <input
              type="text"
              className={`w-full p-2 border rounded-lg outline-none transition-all ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="e.g., Upcoming Viva Requirements"
              value={notice.title}
              onChange={(e) => setNotice({...notice, title: e.target.value})}
            />
            {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Group/Module</label>
            <select
              className={`w-full p-2 border rounded-lg outline-none transition-all ${errors.targetGroup ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
              value={notice.targetGroup}
              onChange={(e) => setNotice({...notice, targetGroup: e.target.value})}
            >
              <option value="">Select Group</option>
              <option value="Group 01 - AgroLeave">Group 01 - AgroLeave</option>
              <option value="Group 02 - HealthTrack">Group 02 - HealthTrack</option>
              <option value="All Groups">All Groups (Module Wide)</option>
            </select>
            {errors.targetGroup && <span className="text-red-500 text-xs mt-1">{errors.targetGroup}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notice Content</label>
            <textarea
              rows="4"
              className={`w-full p-2 border rounded-lg outline-none transition-all ${errors.content ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
              placeholder="Write your detailed instructions here..."
              value={notice.content}
              onChange={(e) => setNotice({...notice, content: e.target.value})}
            ></textarea>
            {errors.content && <span className="text-red-500 text-xs mt-1">{errors.content}</span>}
          </div>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Post Notice
          </button>
        </form>
      </div>

      {/* Recent Notices List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Recently Posted</h2>
        {notices.length === 0 ? (
          <p className="text-gray-500 italic">No notices posted yet.</p>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800">{n.title}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{n.targetGroup}</span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">{n.content}</p>
              <p className="text-xs text-gray-400 mt-3">Posted on: {n.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LecturerNotices;