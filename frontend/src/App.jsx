import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';

import UploadResource from './components/resources/UploadResource';
import ResourceDashboard from './components/resources/ResourceDashboard';
import FacultyModules from './components/resources/FacultyModules';
import ModuleResources from './components/resources/ModuleResources';

function AppContent() {
  const location = useLocation();

  const hideTopNavbar =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/student') ||
    location.pathname.startsWith('/lecturer') ||
    location.pathname.startsWith('/resources') ||
    location.pathname.startsWith('/upload-resource') ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      {!hideTopNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Shared resource routes for all logged users */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'LECTURER', 'STUDENT']} />}>
          <Route path="/resources" element={<ResourceDashboard />} />
          <Route path="/resources/:facultyName" element={<FacultyModules />} />
          <Route path="/resources/:facultyName/:moduleName" element={<ModuleResources />} />

          {/* Optional alias for your student dashboard button */}
          <Route path="/student/resources" element={<ResourceDashboard />} />
        </Route>

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
          <Route path="/upload-resource" element={<UploadResource />} />
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