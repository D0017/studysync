import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo11.png';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Roles', href: '#roles' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    setMobileOpen(false);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogoClick = (e) => {
    setMobileOpen(false);

    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return;
    }

    navigate('/');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 80);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F1218]/88 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex min-w-0 items-center gap-3 rounded-2xl px-1 py-1 transition hover:opacity-95"
            aria-label="Go to top of landing page"
          >
            <img
              src={logo}
              alt="StudySync Logo"
              className="h-11 w-auto object-contain sm:h-12"
            />

            <div className="min-w-0">
              <p className="truncate text-[1.75rem] font-semibold leading-none tracking-tight text-white sm:text-xl">
                StudySync
              </p>
              <p className="hidden truncate text-sm text-slate-400 sm:block">
                Academic Group & Learning Management System
              </p>
            </div>
          </Link>

          {isHomePage && (
            <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 md:flex">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-5 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <div className="hidden items-center gap-3 md:flex">
            {storedUser ? (
              <button
                onClick={handleLogout}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FF6A00] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,106,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FF7B22]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 pb-4 pt-4 md:hidden">
            {isHomePage && (
              <nav className="mb-4 flex flex-col gap-2">
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}

            <div className="flex flex-col gap-3">
              {storedUser ? (
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-[#FF6A00] px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,106,0,0.18)] transition hover:bg-[#FF7B22]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;