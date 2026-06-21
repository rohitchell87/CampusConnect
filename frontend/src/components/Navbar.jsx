import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Profile', to: '/profile' },
];

function Navbar() {
  return (
    <header className="glass-card sticky top-0 z-50 mx-auto mb-8 w-full max-w-7xl rounded-3xl border border-white/10 px-6 py-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link className="text-2xl font-semibold tracking-tight text-white" to="/">
          CampusConnect
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-slate-300">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full bg-slate-800 px-4 py-2 text-white transition'
                  : 'rounded-full px-4 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white'
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="rounded-full bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
