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

  // Calculate total out of 100 (assuming each is out of 25)
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
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rubric Evaluation</h1>
        <p className="text-gray-600">Formal assessment of project groups based on academic rubrics.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target Group</label>
          <select 
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select a group to evaluate...</option>
            <option value="Group 01 - AgroLeave">Group 01 - AgroLeave</option>
            <option value="Group 02 - HealthTrack">Group 02 - HealthTrack</option>
          </select>
        </div>

        <div className="p-6 space-y-6">
          {/* Rubric Criteria */}
          {[
            { id: 'technical', label: 'Technical Implementation', desc: 'Code quality, architecture, and functionality.' },
            { id: 'presentation', label: 'Viva & Presentation', desc: 'Clarity of explanation and demo.' },
            { id: 'documentation', label: 'Project Documentation', desc: 'Quality of reports and diagrams.' },
            { id: 'collaboration', label: 'Team Collaboration', desc: 'Equal contribution and Git history.' }
          ].map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.label}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="number"
                  max="25"
                  min="0"
                  className="w-20 p-2 border border-gray-300 rounded text-center font-bold text-blue-600"
                  value={scores[item.id]}
                  onChange={(e) => handleScoreChange(item.id, e.target.value)}
                />
                <span className="text-gray-400 font-medium">/ 25</span>
              </div>
            </div>
          ))}

          {/* Feedback */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Feedback</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide constructive feedback for the group..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer with Total */}
        <div className="p-6 bg-blue-600 flex flex-col md:flex-row justify-between items-center text-white">
          <div className="mb-4 md:mb-0">
            <span className="text-blue-100 uppercase text-xs font-bold tracking-widest">Calculated Result</span>
            <div className="text-3xl font-black">{totalScore} <span className="text-lg font-normal text-blue-200">/ 100</span></div>
          </div>
          <button 
            onClick={submitEvaluation}
            className="w-full md:w-auto px-10 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Submit Final Grade
          </button>
        </div>
      </div>
    </div>
  );
};

export default LecturerEvaluations;