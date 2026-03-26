import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Register from './components/Register';
import Login from './components/Login';

import CreateModule from './components/CreateModule';
import AdminUserManagement from './components/AdminUserManagement';
import AdminDashboard from './components/AdminDashboard';
import AdminModules from './components/AdminModules';
import AdminModuleDetails from './components/AdminModuleDetails';
import LeadershipRequests from './components/LeadershipRequests';

import StudentDashboard from './components/StudentDashboard';
import ModuleGroups from './components/ModuleGroups';

import LecturerDashboard from './components/LecturerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import UploadResource from "./components/resources/UploadResource";
import ResourceDashboard from "./components/resources/ResourceDashboard";
import FacultyModules from "./components/resources/FacultyModules";
import ModuleResources from "./components/resources/ModuleResources";

function App() {

  return (

    <Router>

      <div className="min-h-screen bg-gray-50">

        <nav className="bg-white shadow-sm p-4 flex justify-between items-center">

          <h1 className="text-xl font-bold text-blue-600">
            StudySync
          </h1>

          <div className="space-x-4">

            <Link to="/" className="text-gray-600">
              Home
            </Link>

            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded">
              Get Started
            </Link>

          </div>

        </nav>


        <Routes>

          {/* PUBLIC */}

          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />


          {/* RESOURCES FOR ALL LOGGED USERS */}

          <Route element={<ProtectedRoute allowedRoles={['ADMIN','LECTURER','STUDENT']} />}>

            <Route path="/resources" element={<ResourceDashboard />} />

            <Route path="/resources/:facultyName" element={<FacultyModules />} />

            <Route path="/resources/:facultyName/:moduleName" element={<ModuleResources />} />

          </Route>


          {/* ADMIN */}

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>

            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            <Route path="/admin/users" element={<AdminUserManagement />} />

            <Route path="/admin/create-module" element={<CreateModule />} />

            <Route path="/admin/modules" element={<AdminModules />} />

            <Route path="/admin/modules/:moduleId" element={<AdminModuleDetails />} />

            <Route path="/admin/leadership-requests" element={<LeadershipRequests />} />

          </Route>


          {/* STUDENT */}

          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>

            <Route path="/student-dashboard" element={<StudentDashboard />} />

            <Route path="/student/modules/:moduleId" element={<ModuleGroups />} />

          </Route>


          {/* LECTURER */}

          <Route element={<ProtectedRoute allowedRoles={['LECTURER']} />}>

            <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />

            <Route path="/upload-resource" element={<UploadResource />} />

          </Route>


        </Routes>

      </div>

    </Router>

  );

}

export default App;