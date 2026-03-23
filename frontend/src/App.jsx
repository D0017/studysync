import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CreateModule from './components/CreateModule';
import AdminUserManagement from './components/AdminUserManagement';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import ModuleGroups from './components/ModuleGroups';
import AdminModules from './components/AdminModules';
import LeadershipRequests from './components/LeadershipRequests';
import AdminModuleDetails from './components/AdminModuleDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">StudySync</h1>
          <div className="space-x-4">
            <Link title="Home" to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link
              title="Register"
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center mt-20">
                <h2 className="text-4xl font-bold">Welcome to StudySync</h2>
                <p className="mt-4 text-gray-600">Academic Group & Learning Management System</p>
              </div>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/create-module" element={<CreateModule />} />
          <Route path="/admin/modules" element={<AdminModules />} />
          <Route path="/admin/modules/:moduleId" element={<AdminModuleDetails />} />
          <Route path="/admin/leadership-requests" element={<LeadershipRequests />} />

          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/modules/:moduleId" element={<ModuleGroups />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;