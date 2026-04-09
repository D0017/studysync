import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const LecturerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Modernized Icons using SVG paths for a premium SaaS look
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/lecturer-dashboard', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    { 
      name: 'Assignment Management', 
      path: '/lecturer/assignments', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      )
    },
    { 
      name: 'My Modules', 
      path: '/lecturer/modules', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    { 
      name: 'Group Notices', 
      path: '/lecturer/notices', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    },
    { 
      name: 'Viva Schedule', 
      path: '/lecturer/viva-schedule', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    { 
      name: 'Evaluations', 
      path: '/lecturer/evaluations', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F4F4F6]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0A0A0C] flex flex-col shadow-2xl z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 w-1 bg-[#FF6A00]"></div>
            <h2 className="text-2xl font-black text-white tracking-tighter italic">STUDYSYNC</h2>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black ml-3">Lecturer Portal</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-[#FF6A00] text-white shadow-lg shadow-[#FF6A00]/20 translate-x-2' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#FF6A00]/70 group-hover:text-[#FF6A00]'}`}>
                  {item.icon}
                </span>
                <span className={`text-[11px] uppercase tracking-[0.15em] font-black ${isActive ? 'text-white' : ''}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Session Info / Logout */}
        <div className="p-6 border-t border-white/5 bg-[#141417]/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all group"
          >
            <span className="text-xs uppercase tracking-widest font-black">Logout Session</span>
            <span className="group-hover:translate-x-1 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FF6A00]/5 blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="p-8 md:p-12">
          <Outlet /> 
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E2E2; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF6A00; }
      `}} />
    </div>
  );
};

export default LecturerLayout;