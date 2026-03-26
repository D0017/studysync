import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0C]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF6A00] text-lg font-extrabold text-white shadow-[0_12px_30px_rgba(255,106,0,0.35)]">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">StudySync</h1>
            <p className="text-xs text-gray-400">Smart LMS Collaboration Platform</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-gray-300 transition hover:text-white">
            Features
          </a>
          <a href="#benefits" className="text-sm font-medium text-gray-300 transition hover:text-white">
            Benefits
          </a>
          <a href="#roles" className="text-sm font-medium text-gray-300 transition hover:text-white">
            Roles
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-[#FF6A00] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,106,0,0.35)] transition hover:scale-[1.02] hover:bg-[#ff7b22]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;