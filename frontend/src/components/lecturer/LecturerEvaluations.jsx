import React, { useState } from 'react';

const LecturerEvaluations = () => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [scores, setScores] = useState({
    technical: 0,
    presentation: 0,
    documentation: 0,
    collaboration: 0
  });

  const [feedback, setFeedback] = useState('');

  const totalScore = Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0);

  const handleScoreChange = (criterion, value) => {
    if (value >= 0 && value <= 25) {
      setScores({ ...scores, [criterion]: value });
    }
  };

  const submitEvaluation = () => {
    if (!selectedGroup) return alert("Please select a group first.");
    
    const evaluationData = {
      groupId: selectedGroup,
      scores,
      totalScore,
      feedback,
      evaluatedAt: new Date().toISOString()
    };

    console.log("Submitting Evaluation:", evaluationData);
    alert(`Evaluation for ${selectedGroup} submitted! Final Score: ${totalScore}/100`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Updated Header with 0A0A0C Box */}
      <header className="mb-10 bg-[#0A0A0C] p-8 rounded-2xl shadow-xl border-b-4 border-b-[#FF6A00]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-1 bg-[#FF6A00] rounded-full"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Academic Assessment
          </span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">
          Rubric Evaluation
        </h1>
        <p className="text-gray-400 font-medium mt-1 text-sm">
          Formal assessment of project groups based on academic rubrics.
        </p>
      </header>

      {/* WHOLE MAIN BOX UPDATED TO #F4F4F6 */}
      <div className="bg-[#F4F4F6] rounded-[2rem] shadow-xl border border-gray-200 border-b-8 border-b-[#FF6A00] overflow-hidden">
        
        {/* Selection Header */}
        <div className="p-8 border-b border-gray-200 bg-white/50">
          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">
            Target Group Selection
          </label>

          <div className="relative w-full md:w-1/2">
            <select 
              className="w-full p-4 pr-12 bg-white text-[#0A0A0C] border border-gray-200 rounded-2xl outline-none focus:border-[#FF6A00] transition-all cursor-pointer font-bold text-sm appearance-none hover:border-[#FF6A00]"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Select a group to evaluate...</option>
              <option value="Group 01 - AgroLeave">Group 01 - AgroLeave</option>
              <option value="Group 02 - HealthTrack">Group 02 - HealthTrack</option>
            </select>

            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg 
                className="w-5 h-5 text-[#FF6A00]" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-4">
          {/* Rubric Criteria - MAINTAINED #1F1F23 FOR CONTRAST */}
          {[
            { id: 'technical', label: 'Technical Implementation', desc: 'Code quality, architecture, and functionality.' },
            { id: 'presentation', label: 'Viva & Presentation', desc: 'Clarity of explanation and demo.' },
            { id: 'documentation', label: 'Project Documentation', desc: 'Quality of reports and diagrams.' },
            { id: 'collaboration', label: 'Team Collaboration', desc: 'Equal contribution and Git history.' }
          ].map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-[#1F1F23] border border-transparent hover:border-[#FF6A00]/50 transition-all group"
            >
              <div className="flex-1">
                <h3 className="font-black text-white text-lg tracking-tight group-hover:text-[#FF6A00] transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center space-x-4 bg-[#0A0A0C] p-3 rounded-xl border border-white/5">
                <input 
                  type="number"
                  max="25"
                  min="0"
                  className="w-16 bg-transparent text-xl font-black text-[#FF6A00] outline-none text-center"
                  value={scores[item.id]}
                  onChange={(e) => handleScoreChange(item.id, e.target.value)}
                />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                  / 25.0
                </span>
              </div>
            </div>
          ))}

          {/* Feedback */}
          <div className="mt-8">
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">
              Detailed Feedback
            </label>
            <textarea 
              className="w-full bg-white text-[#0A0A0C] p-5 border border-gray-200 rounded-3xl h-40 outline-none focus:border-[#FF6A00] transition-all resize-none placeholder:text-gray-400 font-medium text-sm shadow-inner"
              placeholder="Provide constructive feedback for the group's performance..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-[#FF6A00] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-orange-950/60 uppercase text-[10px] font-black tracking-[0.2em]">
              Final Aggregated Score
            </span>
            <div className="text-5xl font-black text-white tracking-tighter">
              {totalScore} 
              <span className="text-xl font-bold text-orange-200"> / 100</span>
            </div>
          </div>

          <button 
            onClick={submitEvaluation}
            className="w-full md:w-auto px-12 py-5 bg-[#0A0A0C] text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase text-xs tracking-widest"
          >
            Submit Evaluation
          </button>
        </div>
      </div>

      <p className="text-center text-gray-400 text-[10px] font-bold uppercase mt-8 tracking-widest">
        Scores are saved to the academic record upon submission.
      </p>
    </div>
  );
};

export default LecturerEvaluations;