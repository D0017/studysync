import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Simple Navigation Bar */}
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">StudySync</h1>
          <div className="space-x-4">
            <Link title="Home" to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link title="Register" to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Route Definitions */}
        <Routes>
          <Route path="/" element={
            <div className="text-center mt-20">
              <h2 className="text-4xl font-bold">Welcome to StudySync</h2>
              <p className="mt-4 text-gray-600">Academic Group & Learning Management System</p>
            </div>
          } />
          
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;