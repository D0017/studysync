import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const LecturerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/lecturer-dashboard', icon: '📊' },
    { name: 'My Modules', path: '/lecturer/modules', icon: '📚' },
    { name: 'Group Notices', path: '/lecturer/notices', icon: '📢' },
    { name: 'Viva Schedule', path: '/lecturer/viva-schedule', icon: '📅' },
    { name: 'Evaluations', path: '/lecturer/evaluations', icon: '📝' },
  ];

  const handleLogout = () => {
    // Clear your auth tokens here later
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">StudySync</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Lecturer Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* This is where the specific pages will render */}
      </main>
    </div>
  );
};

export default LecturerLayout;