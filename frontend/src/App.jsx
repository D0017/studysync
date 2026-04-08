import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CreateModule from './components/CreateModule';
import AdminUserManagement from './components/AdminUserManagement';
import StudentDashboard from './components/StudentDashboard';
import ModuleGroups from './components/ModuleGroups';
import GroupProjectBoard from './components/projectmanagement/GroupProjectBoard';
import JiraBoard from './components/projectmanagement/JiraBoard';

function App() {
  return (
    <Router>
      {/* Changed bg-gray-50 to your Light Background #F4F4F6 */}
      <div className="min-h-screen" style={{ backgroundColor: '#F4F4F6' }}>
        
        {/* Navbar: Changed to Secondary Dark #1F1F23 with Orange accents */}
        <nav className="shadow-md p-4 flex justify-between items-center" style={{ backgroundColor: '#1F1F23' }}>
          <h1 className="text-xl font-bold" style={{ color: '#FF6A00' }}>StudySync</h1>
          
          <div className="space-x-4">
            <Link 
              title="Home" 
              to="/" 
              className="hover:opacity-80 transition-colors" 
              style={{ color: '#F4F4F6' }}
            >
              Home
            </Link>
            
            {/* Button: Primary Orange #FF6A00 with Deep Black #0A0A0C text */}
            <Link 
              title="Register" 
              to="/register" 
              className="px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
              style={{ backgroundColor: '#FF6A00', color: '#0A0A0C' }}
            >
              Get Started
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="text-center mt-20">
              {/* Heading: Primary Black #0A0A0C */}
              <h2 className="text-4xl font-bold" style={{ color: '#0A0A0C' }}>
                Welcome to <span style={{ color: '#FF6A00' }}>StudySync</span>
              </h2>
              <p className="mt-4 text-lg" style={{ color: '#1F1F23' }}>
                Academic Group & Learning Management System
              </p>
            </div>
          } />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/create-module" element={<CreateModule />} />
          <Route path="/admin-dashboard" element={<AdminUserManagement />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/modules/:moduleId" element={<ModuleGroups />} />
          <Route path="/groups/:groupId/project" element={<GroupProjectBoard />} />
          <Route path="/groups/:groupId/jira-board" element={<JiraBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;