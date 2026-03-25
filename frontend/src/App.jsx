import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CreateModule from './components/CreateModule';
import AdminUserManagement from './components/AdminUserManagement';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminModules from './components/AdminModules';
import AdminModuleDetails from './components/AdminModuleDetails';
import LeadershipRequests from './components/LeadershipRequests';
import StudentDashboard from './components/StudentDashboard';
import ModuleGroups from './components/ModuleGroups';
import LecturerDashboard from './components/LecturerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();

  const hideTopNavbar =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/student') ||
    location.pathname.startsWith('/lecturer');

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideTopNavbar && (
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">StudySync</h1>
          <div className="space-x-4">
            <Link
              title="Home"
              to="/"
              className="text-gray-600 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              title="Register"
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <div className="text-center mt-20">
              <h2 className="text-4xl font-bold">Welcome to StudySync</h2>
              <p className="mt-4 text-gray-600">
                Academic Group & Learning Management System
              </p>
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/create-module" element={<CreateModule />} />
            <Route path="/admin/modules" element={<AdminModules />} />
            <Route path="/admin/modules/:moduleId" element={<AdminModuleDetails />} />
            <Route path="/admin/leadership-requests" element={<LeadershipRequests />} />
          </Route>
        </Route>

        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/modules/:moduleId" element={<ModuleGroups />} />
        </Route>

        {/* Lecturer routes */}
        <Route element={<ProtectedRoute allowedRoles={['LECTURER']} />}>
          <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;